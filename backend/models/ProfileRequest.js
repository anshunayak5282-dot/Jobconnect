const { query } = require('../config/db');
const User = require('./User');

const ProfileRequest = {
  // Create a new profile edit request or update existing pending request
  async create({ userId, userName, userEmail, currentData, proposedData }) {
    const currentJson = typeof currentData === 'string' ? currentData : JSON.stringify(currentData || {});
    const proposedJson = typeof proposedData === 'string' ? proposedData : JSON.stringify(proposedData || {});

    // Check if user already has an active pending request
    const [existing] = await query(
      "SELECT id FROM `profile_requests` WHERE `user_id` = ? AND `status` = 'Pending' LIMIT 1",
      [userId]
    );

    if (existing.length > 0) {
      await query(
        "UPDATE `profile_requests` SET `proposed_data` = ?, `current_data` = ?, `user_name` = ?, `user_email` = ?, `updated_at` = NOW() WHERE `id` = ?",
        [proposedJson, currentJson, userName, userEmail, existing[0].id]
      );
      return this.findById(existing[0].id);
    }

    const [result] = await query(
      'INSERT INTO `profile_requests` (`user_id`, `user_name`, `user_email`, `current_data`, `proposed_data`, `status`) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, userName, userEmail, currentJson, proposedJson, 'Pending']
    );

    return this.findById(result.insertId);
  },

  // Find request by ID
  async findById(id) {
    const [rows] = await query('SELECT * FROM `profile_requests` WHERE `id` = ? LIMIT 1', [id]);
    if (!rows[0]) return null;
    return this.formatRequest(rows[0]);
  },

  // Find all requests (Admin)
  async findAll() {
    const [rows] = await query('SELECT * FROM `profile_requests` ORDER BY `id` DESC');
    return rows.map(r => this.formatRequest(r));
  },

  // Find pending requests (Admin)
  async findPending() {
    const [rows] = await query("SELECT * FROM `profile_requests` WHERE `status` = 'Pending' ORDER BY `id` DESC");
    return rows.map(r => this.formatRequest(r));
  },

  // Find latest request for user
  async findLatestByUserId(userId) {
    const [rows] = await query(
      'SELECT * FROM `profile_requests` WHERE `user_id` = ? ORDER BY `id` DESC LIMIT 1',
      [userId]
    );
    if (!rows[0]) return null;
    return this.formatRequest(rows[0]);
  },

  // Find all requests for a user
  async findByUserId(userId) {
    const [rows] = await query(
      'SELECT * FROM `profile_requests` WHERE `user_id` = ? ORDER BY `id` DESC',
      [userId]
    );
    return rows.map(r => this.formatRequest(r));
  },

  // Approve a request:
  // 1. Updates request status to 'Approved'
  // 2. Updates HR user's actual profile in users table
  async approve(id, adminId) {
    const request = await this.findById(id);
    if (!request) throw new Error('Profile request not found');

    await query(
      "UPDATE `profile_requests` SET `status` = 'Approved', `reviewed_by` = ?, `reviewed_at` = NOW() WHERE `id` = ?",
      [adminId, id]
    );

    // Apply proposed fields to user table in MySQL
    const updatedUser = await User.updateProfile(request.user_id, request.proposed_data);
    const updatedRequest = await this.findById(id);

    return { request: updatedRequest, user: updatedUser };
  },

  // Reject a request:
  // 1. Updates request status to 'Rejected'
  // 2. User table remains unchanged
  async reject(id, adminId, reason = 'Changes could not be verified by platform administrator.') {
    const request = await this.findById(id);
    if (!request) throw new Error('Profile request not found');

    await query(
      "UPDATE `profile_requests` SET `status` = 'Rejected', `admin_notes` = ?, `reviewed_by` = ?, `reviewed_at` = NOW() WHERE `id` = ?",
      [reason, adminId, id]
    );

    const updatedRequest = await this.findById(id);
    return { request: updatedRequest };
  },

  // Helper to parse JSON fields safely
  formatRequest(row) {
    if (!row) return null;
    let current = {};
    let proposed = {};
    try {
      current = typeof row.current_data === 'string' ? JSON.parse(row.current_data) : (row.current_data || {});
    } catch (e) {
      current = {};
    }
    try {
      proposed = typeof row.proposed_data === 'string' ? JSON.parse(row.proposed_data) : (row.proposed_data || {});
    } catch (e) {
      proposed = {};
    }

    return {
      id: row.id,
      _id: row.id,
      user_id: row.user_id,
      userId: row.user_id,
      userName: row.user_name,
      user_name: row.user_name,
      userEmail: row.user_email,
      user_email: row.user_email,
      current_data: current,
      currentData: current,
      proposed_data: proposed,
      proposedData: proposed,
      status: row.status,
      admin_notes: row.admin_notes,
      adminNotes: row.admin_notes,
      reviewed_by: row.reviewed_by,
      reviewed_at: row.reviewed_at,
      created_at: row.created_at,
      createdAt: row.created_at,
      updated_at: row.updated_at
    };
  }
};

module.exports = ProfileRequest;

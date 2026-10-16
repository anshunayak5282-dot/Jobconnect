const { query } = require('../config/db');

const User = {
  // Find user by email
  async findOne({ email }) {
    const [rows] = await query('SELECT * FROM `users` WHERE `email` = ? LIMIT 1', [email]);
    if (!rows[0]) return null;
    const user = rows[0];
    try {
      user.education = user.education ? (typeof user.education === 'string' ? JSON.parse(user.education) : user.education) : [];
    } catch (e) { user.education = []; }
    try {
      user.experience = user.experience ? (typeof user.experience === 'string' ? JSON.parse(user.experience) : user.experience) : [];
    } catch (e) { user.experience = []; }
    try {
      user.projects = user.projects ? (typeof user.projects === 'string' ? JSON.parse(user.projects) : user.projects) : [];
    } catch (e) { user.projects = []; }
    return user;
  },

  // Find user by ID (exclude password by default)
  async findById(id) {
    const [rows] = await query(
      'SELECT id, name, email, role, status, company_name, phone, location, title, about, resume_name, skills, education, experience, projects, created_at, updated_at FROM `users` WHERE `id` = ? LIMIT 1',
      [id]
    );
    if (!rows[0]) return null;
    const user = rows[0];
    try {
      user.education = user.education ? (typeof user.education === 'string' ? JSON.parse(user.education) : user.education) : [];
    } catch (e) { user.education = []; }
    try {
      user.experience = user.experience ? (typeof user.experience === 'string' ? JSON.parse(user.experience) : user.experience) : [];
    } catch (e) { user.experience = []; }
    try {
      user.projects = user.projects ? (typeof user.projects === 'string' ? JSON.parse(user.projects) : user.projects) : [];
    } catch (e) { user.projects = []; }
    return user;
  },

  // Create a new user
  async create({ name, email, password, role = 'user', company = null, phone = null }) {
    const [result] = await query(
      'INSERT INTO `users` (`name`, `email`, `password`, `role`, `company_name`, `phone`) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, role, company, phone]
    );
    return {
      _id: result.insertId,
      id: result.insertId,
      name,
      email,
      role,
      company_name: company,
      phone
    };
  },

  // Get all users (for Admin Directory)
  async findAll() {
    const [rows] = await query(
      'SELECT id, name, email, role, status, company_name, phone, location, created_at FROM `users` ORDER BY id DESC'
    );
    return rows.map(u => ({
      ...u,
      _id: u.id
    }));
  },

  // Update user status (Active / Suspended)
  async updateStatus(id, status) {
    await query('UPDATE `users` SET `status` = ? WHERE `id` = ?', [status, id]);
    return this.findById(id);
  },

  // Update user profile fields in MySQL
  async updateProfile(id, fields = {}) {
    if (fields.company !== undefined && fields.company_name === undefined) {
      fields.company_name = fields.company;
    }
    const allowed = ['name', 'phone', 'location', 'title', 'about', 'skills', 'resume_name', 'education', 'experience', 'projects', 'company_name'];
    const setClauses = [];
    const values = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        setClauses.push(`\`${key}\` = ?`);
        let val = fields[key];
        if (['education', 'experience', 'projects'].includes(key) && typeof val !== 'string') {
          val = JSON.stringify(val);
        }
        values.push(val);
      }
    }

    if (setClauses.length > 0) {
      values.push(id);
      await query(`UPDATE \`users\` SET ${setClauses.join(', ')} WHERE \`id\` = ?`, values);
    }

    return this.findById(id);
  }
};

module.exports = User;

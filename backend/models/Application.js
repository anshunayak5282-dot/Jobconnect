const { query } = require('../config/db');

const formatAppRow = (row) => {
  if (!row) return null;
  const rawJobId = row.job_id;
  const formattedJobId = rawJobId !== null && rawJobId !== undefined ? String(rawJobId) : '';
  return {
    _id: row.id,
    id: row.id,
    jobId: formattedJobId,
    job_id: row.job_id,
    job: {
      _id: row.job_id,
      id: row.job_id,
      title: row.job_title || 'Application Vacancy',
      company: row.job_company || 'Partner Enterprise',
      companyName: row.job_company || 'Partner Enterprise',
      location: row.job_location || 'India',
      salaryMin: Number(row.job_salary_min || 0),
      salaryMax: Number(row.job_salary_max || 0),
      jobType: row.job_type || 'Full Time',
      experience: row.job_experience || 'Fresher'
    },
    applicant: {
      _id: row.applicant_id,
      id: row.applicant_id,
      name: row.applicant_name || 'Candidate',
      email: row.applicant_email || '',
      phone: row.applicant_phone || '',
      location: row.applicant_location || ''
    },
    applicantId: row.applicant_id,
    applicant_id: row.applicant_id,
    applicantName: row.applicant_name || 'Candidate',
    applicantEmail: row.applicant_email || '',
    applicantPhone: row.applicant_phone || '',
    applicantLocation: row.applicant_location || '',
    resume: row.resume_url,
    resumeUrl: row.resume_url,
    coverLetter: row.cover_letter || '',
    status: row.status || 'Applied',
    appliedAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Just now',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const parseNumericId = (id) => {
  if (id === null || id === undefined) return null;
  if (typeof id === 'number') return id;
  const match = String(id).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const Application = {
  // Check if applicant already applied to job
  async findOne({ job, applicant }) {
    const numJob = parseNumericId(job);
    const numApplicant = parseNumericId(applicant);
    const [rows] = await query(
      'SELECT * FROM `applications` WHERE (`job_id` = ? OR `job_id` = ?) AND (`applicant_id` = ? OR `applicant_id` = ?) LIMIT 1',
      [job, numJob || job, applicant, numApplicant || applicant]
    );
    return rows[0] ? { _id: rows[0].id, id: rows[0].id, ...rows[0] } : null;
  },

  // Find application by ID
  async findById(id) {
    const sql = `
      SELECT 
        a.*,
        j.title AS job_title, j.company_name AS job_company, j.location AS job_location,
        j.salary_min AS job_salary_min, j.salary_max AS job_salary_max, j.job_type, j.experience AS job_experience,
        u.name AS applicant_name, u.email AS applicant_email, u.phone AS applicant_phone, u.location AS applicant_location
      FROM \`applications\` a
      LEFT JOIN \`jobs\` j ON a.job_id = j.id
      LEFT JOIN \`users\` u ON a.applicant_id = u.id
      WHERE a.id = ?
      LIMIT 1
    `;
    const [rows] = await query(sql, [id]);
    return formatAppRow(rows[0]);
  },

  // Create application
  async create({ job, applicant, resume, coverLetter = '', status = 'Applied' }) {
    const numJob = parseNumericId(job) || job;
    const numApplicant = parseNumericId(applicant) || applicant;
    const [result] = await query(
      `INSERT INTO \`applications\` (\`job_id\`, \`applicant_id\`, \`resume_url\`, \`cover_letter\`, \`status\`)
       VALUES (?, ?, ?, ?, ?)`,
      [numJob, numApplicant, resume, coverLetter, status]
    );
    return this.findById(result.insertId);
  },

  // Find applications with populated relations
  async find(filters = {}) {
    let sql = `
      SELECT 
        a.*,
        j.title AS job_title, j.company_name AS job_company, j.location AS job_location,
        j.salary_min AS job_salary_min, j.salary_max AS job_salary_max, j.job_type, j.experience AS job_experience,
        u.name AS applicant_name, u.email AS applicant_email, u.phone AS applicant_phone, u.location AS applicant_location
      FROM \`applications\` a
      LEFT JOIN \`jobs\` j ON a.job_id = j.id
      LEFT JOIN \`users\` u ON a.applicant_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.applicant) {
      const numApplicant = parseNumericId(filters.applicant);
      if (filters.applicantEmail) {
        sql += ' AND (a.applicant_id = ? OR a.applicant_id = ? OR LOWER(u.email) = LOWER(?))';
        params.push(filters.applicant, numApplicant || filters.applicant, filters.applicantEmail);
      } else {
        sql += ' AND (a.applicant_id = ? OR a.applicant_id = ?)';
        params.push(filters.applicant, numApplicant || filters.applicant);
      }
    } else if (filters.applicantEmail) {
      sql += ' AND LOWER(u.email) = LOWER(?)';
      params.push(filters.applicantEmail);
    }

    if (filters.job) {
      const numJob = parseNumericId(filters.job);
      sql += ' AND (a.job_id = ? OR a.job_id = ?)';
      params.push(filters.job, numJob || filters.job);
    }

    if (filters.status) {
      sql += ' AND a.status = ?';
      params.push(filters.status);
    }

    if (filters.companyName) {
      sql += ' AND (j.company_name = ? OR j.company_name IS NULL)';
      params.push(filters.companyName);
    }

    sql += ' ORDER BY a.created_at DESC';

    const [rows] = await query(sql, params);
    return rows.map(formatAppRow);
  },

  // Update status (Applied, Under Review, Shortlisted, Interview, Selected, Rejected)
  async findByIdAndUpdate(id, { status }) {
    await query('UPDATE \`applications\` SET \`status\` = ? WHERE \`id\` = ?', [status, id]);
    return this.findById(id);
  }
};

module.exports = Application;

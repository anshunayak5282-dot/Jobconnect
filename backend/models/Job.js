const { query } = require('../config/db');

const cleanJobId = (id) => {
  if (typeof id === 'string' && id.startsWith('job-')) {
    const parsed = parseInt(id.replace('job-', ''), 10);
    return isNaN(parsed) ? id : parsed;
  }
  return id;
};

const formatJobRow = (row) => {
  if (!row) return null;
  const recruiterName = row.recruiter_name || row.posted_by_name || '';
  const recruiterEmail = row.recruiter_email || row.posted_by_email || '';
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    company: row.company_name,
    companyName: row.company_name,
    postedBy: recruiterName ? `HR - ${recruiterName}` : (row.posted_by ? String(row.posted_by) : 'HR Recruiter'),
    posted_by: row.posted_by,
    postedByEmail: recruiterEmail,
    postedByName: recruiterName,
    description: row.description,
    location: row.location,
    salaryMin: Number(row.salary_min),
    salaryMax: Number(row.salary_max),
    experience: row.experience,
    jobType: row.job_type,
    skills: typeof row.skills === 'string'
      ? row.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(row.skills) ? row.skills : [],
    deadline: row.deadline || 'In 30 days',
    status: row.status,
    createdAt: row.created_at
      ? (typeof row.created_at === 'string' ? row.created_at.split('T')[0] : new Date(row.created_at).toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at
  };
};

const Job = {
  // Find jobs with filtering and recruiter details from users table
  async find(filters = {}) {
    let sql = `
      SELECT j.*, u.name AS recruiter_name, u.email AS recruiter_email
      FROM \`jobs\` j
      LEFT JOIN \`users\` u ON j.posted_by = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by specific status (if status is 'all', do not filter by status)
    if (filters.status && filters.status !== 'all') {
      sql += ' AND j.`status` = ?';
      params.push(filters.status);
    }

    // Role-based recruiter visibility: Show Approved jobs OR this recruiter's own jobs
    if (filters.forRecruiterId) {
      sql += ' AND (j.`status` = "Approved" OR j.`posted_by` = ?)';
      params.push(filters.forRecruiterId);
    }

    if (filters.keyword) {
      const kw = `%${filters.keyword}%`;
      sql += ' AND (j.`title` LIKE ? OR j.`company_name` LIKE ? OR j.`skills` LIKE ? OR j.`description` LIKE ?)';
      params.push(kw, kw, kw, kw);
    }

    if (filters.location) {
      sql += ' AND j.`location` LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.jobType) {
      sql += ' AND j.`job_type` = ?';
      params.push(filters.jobType);
    }

    if (filters.experience) {
      sql += ' AND j.`experience` = ?';
      params.push(filters.experience);
    }

    if (filters.minSalary) {
      sql += ' AND j.`salary_max` >= ?';
      params.push(Number(filters.minSalary));
    }

    if (filters.postedBy) {
      sql += ' AND j.`posted_by` = ?';
      params.push(filters.postedBy);
    }

    if (filters.company || filters.companyName) {
      sql += ' AND j.`company_name` = ?';
      params.push(filters.company || filters.companyName);
    }

    sql += ' ORDER BY j.`created_at` DESC';

    const [rows] = await query(sql, params);
    return rows.map(formatJobRow);
  },

  // Find job by ID
  async findById(id) {
    const cleanId = cleanJobId(id);
    const [rows] = await query(
      `SELECT j.*, u.name AS recruiter_name, u.email AS recruiter_email
       FROM \`jobs\` j
       LEFT JOIN \`users\` u ON j.posted_by = u.id
       WHERE j.\`id\` = ?
       LIMIT 1`,
      [cleanId]
    );
    return formatJobRow(rows[0]);
  },

  // Create job
  async create(jobData) {
    const skillsString = Array.isArray(jobData.skills)
      ? jobData.skills.join(', ')
      : jobData.skills || '';

    const [result] = await query(
      `INSERT INTO \`jobs\` 
       (\`title\`, \`company_name\`, \`posted_by\`, \`description\`, \`location\`, \`salary_min\`, \`salary_max\`, \`experience\`, \`job_type\`, \`skills\`, \`deadline\`, \`status\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobData.title,
        jobData.companyName || jobData.company || 'ABC Technologies',
        jobData.postedBy || jobData.posted_by,
        jobData.description,
        jobData.location,
        Number(jobData.salaryMin || 3),
        Number(jobData.salaryMax || 6),
        jobData.experience || 'Fresher',
        jobData.jobType || 'Full Time',
        skillsString,
        jobData.deadline || '2026-11-30',
        jobData.status || 'Pending'
      ]
    );

    return this.findById(result.insertId);
  },

  // Update status (Approve, Reject, Close)
  async findByIdAndUpdate(id, { status }) {
    const cleanId = cleanJobId(id);
    await query('UPDATE `jobs` SET `status` = ? WHERE `id` = ?', [status, cleanId]);
    return this.findById(cleanId);
  }
};

module.exports = Job;

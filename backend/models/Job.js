const { query } = require('../config/db');

const formatJobRow = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    company: row.company_name,
    companyName: row.company_name,
    postedBy: row.posted_by,
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
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const Job = {
  // Find jobs with filtering
  async find(filters = {}) {
    let sql = 'SELECT * FROM `jobs` WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND `status` = ?';
      params.push(filters.status);
    }

    if (filters.keyword) {
      const kw = `%${filters.keyword}%`;
      sql += ' AND (`title` LIKE ? OR `company_name` LIKE ? OR `skills` LIKE ? OR `description` LIKE ?)';
      params.push(kw, kw, kw, kw);
    }

    if (filters.location) {
      sql += ' AND `location` LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.jobType) {
      sql += ' AND `job_type` = ?';
      params.push(filters.jobType);
    }

    if (filters.experience) {
      sql += ' AND `experience` = ?';
      params.push(filters.experience);
    }

    if (filters.minSalary) {
      sql += ' AND `salary_max` >= ?';
      params.push(Number(filters.minSalary));
    }

    if (filters.postedBy) {
      sql += ' AND `posted_by` = ?';
      params.push(filters.postedBy);
    }

    sql += ' ORDER BY `created_at` DESC';

    const [rows] = await query(sql, params);
    return rows.map(formatJobRow);
  },

  // Find job by ID
  async findById(id) {
    const [rows] = await query('SELECT * FROM `jobs` WHERE `id` = ? LIMIT 1', [id]);
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
        jobData.postedBy,
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
    await query('UPDATE `jobs` SET `status` = ? WHERE `id` = ?', [status, id]);
    return this.findById(id);
  }
};

module.exports = Job;

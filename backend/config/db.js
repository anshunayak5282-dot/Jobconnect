require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool = null;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const targetDatabase = process.env.DB_NAME || 'jobconnect_db';

const connectDB = async () => {
  try {
    // 1. Initial connection to MySQL server (without specific DB to allow creation)
    const initConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    console.log(`🔌 Connected to MySQL Server at ${dbConfig.host}:${dbConfig.port}`);

    // 2. Ensure Database exists
    await initConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${targetDatabase}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await initConnection.end();

    // 3. Create Connection Pool connected to target database
    pool = mysql.createPool({
      ...dbConfig,
      database: targetDatabase
    });

    // 4. Test Pool & Initialize Schema
    await initSchemaAndSeed();

    console.log(`✅ MySQL Database Connected: [${targetDatabase}]`);
    return pool;
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
    console.error(`👉 TIP: Make sure your MySQL Server (XAMPP / MySQL Service) is running on port ${dbConfig.port}.`);
    console.error(`👉 Run 'jobconnect_schema.sql' in MySQL Workbench to initialize the schema manually.`);
    // We do not call process.exit(1) immediately to allow server to display informative API health responses
  }
};

const initSchemaAndSeed = async () => {
  if (!pool) return;

  // Create Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(150) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`password\` VARCHAR(255) NOT NULL,
      \`role\` ENUM('admin', 'hr', 'user') NOT NULL DEFAULT 'user',
      \`status\` ENUM('Active', 'Suspended') NOT NULL DEFAULT 'Active',
      \`company_name\` VARCHAR(191) DEFAULT NULL,
      \`phone\` VARCHAR(50) DEFAULT NULL,
      \`location\` VARCHAR(150) DEFAULT NULL,
      \`title\` VARCHAR(150) DEFAULT 'Candidate',
      \`about\` TEXT DEFAULT NULL,
      \`resume_name\` VARCHAR(255) DEFAULT NULL,
      \`skills\` TEXT DEFAULT NULL,
      \`education\` LONGTEXT DEFAULT NULL,
      \`experience\` LONGTEXT DEFAULT NULL,
      \`projects\` LONGTEXT DEFAULT NULL,
      \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`idx_users_email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Ensure columns and default values exist
  try {
    await pool.query(`
      ALTER TABLE \`users\`
        ALTER \`phone\` SET DEFAULT NULL,
        ALTER \`location\` SET DEFAULT NULL,
        ALTER \`title\` SET DEFAULT 'Candidate',
        ALTER \`resume_name\` SET DEFAULT NULL;
    `);
  } catch (schemaAlterErr) {}

  try {
    await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`education\` LONGTEXT DEFAULT NULL;`);
  } catch (e) {}
  try {
    await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`experience\` LONGTEXT DEFAULT NULL;`);
  } catch (e) {}
  try {
    await pool.query(`ALTER TABLE \`users\` ADD COLUMN \`projects\` LONGTEXT DEFAULT NULL;`);
  } catch (e) {}

  try {
    await pool.query(`
      UPDATE \`users\`
      SET \`phone\` = NULL, \`location\` = NULL, \`title\` = 'Candidate', \`resume_name\` = NULL, \`about\` = NULL, \`skills\` = NULL
      WHERE \`email\` != 'ankit.dev@example.com' 
        AND \`resume_name\` = 'Ankit_Kumar_FullStack_Resume.pdf';
    `);
  } catch (cleanupErr) {}

  // Create Jobs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`jobs\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`title\` VARCHAR(200) NOT NULL,
      \`company_name\` VARCHAR(191) NOT NULL,
      \`posted_by\` INT NOT NULL,
      \`description\` TEXT NOT NULL,
      \`location\` VARCHAR(150) NOT NULL,
      \`salary_min\` INT NOT NULL DEFAULT 3,
      \`salary_max\` INT NOT NULL DEFAULT 6,
      \`experience\` VARCHAR(100) NOT NULL DEFAULT 'Fresher',
      \`job_type\` ENUM('Full Time', 'Part Time', 'Internship', 'Contract') NOT NULL DEFAULT 'Full Time',
      \`skills\` TEXT NOT NULL,
      \`deadline\` VARCHAR(100) DEFAULT '2026-11-30',
      \`status\` ENUM('Pending', 'Approved', 'Rejected', 'Closed') NOT NULL DEFAULT 'Pending',
      \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`idx_jobs_posted_by\` (\`posted_by\`),
      KEY \`idx_jobs_status\` (\`status\`),
      CONSTRAINT \`fk_jobs_posted_by\` FOREIGN KEY (\`posted_by\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create Applications table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`applications\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`job_id\` INT NOT NULL,
      \`applicant_id\` INT NOT NULL,
      \`resume_url\` VARCHAR(255) NOT NULL,
      \`cover_letter\` TEXT DEFAULT NULL,
      \`status\` ENUM('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected') NOT NULL DEFAULT 'Applied',
      \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`unique_job_applicant\` (\`job_id\`, \`applicant_id\`),
      CONSTRAINT \`fk_apps_job\` FOREIGN KEY (\`job_id\`) REFERENCES \`jobs\` (\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_apps_applicant\` FOREIGN KEY (\`applicant_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create Saved Jobs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`saved_jobs\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`user_id\` INT NOT NULL,
      \`job_id\` INT NOT NULL,
      \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`unique_user_saved_job\` (\`user_id\`, \`job_id\`),
      CONSTRAINT \`fk_saved_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_saved_job\` FOREIGN KEY (\`job_id\`) REFERENCES \`jobs\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Create Profile Requests table (HR Profile Moderation Queue)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`profile_requests\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`user_id\` INT NOT NULL,
      \`user_name\` VARCHAR(150) NOT NULL,
      \`user_email\` VARCHAR(191) NOT NULL,
      \`current_data\` LONGTEXT NOT NULL,
      \`proposed_data\` LONGTEXT NOT NULL,
      \`status\` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
      \`admin_notes\` TEXT DEFAULT NULL,
      \`reviewed_by\` INT DEFAULT NULL,
      \`reviewed_at\` TIMESTAMP NULL DEFAULT NULL,
      \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`idx_req_user_id\` (\`user_id\`),
      KEY \`idx_req_status\` (\`status\`),
      CONSTRAINT \`fk_req_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Ensure official demo accounts always exist with valid bcrypt password hashes
  try {
    const salt = await bcrypt.genSalt(10);
    const passCandidate = await bcrypt.hash('candidate123', salt);
    const passRecruiter = await bcrypt.hash('recruiter123', salt);
    const passAdmin = await bcrypt.hash('superadmin123', salt);

    const demoUsers = [
      {
        id: 1,
        name: 'Ankit Kumar',
        email: 'ankit.dev@example.com',
        plainPass: 'candidate123',
        hashPass: passCandidate,
        role: 'user',
        status: 'Active',
        company_name: null,
        phone: '+91 98765 43210',
        location: 'Ranchi, Jharkhand',
        title: 'Full Stack MERN Developer',
        about: 'Proactive Full-Stack Software Developer passionate about high-performance web applications with React, Node.js, Express, and MySQL.',
        skills: 'HTML, CSS, JavaScript, React, Node.js, Express, MySQL, Git, Tailwind CSS'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya.hr@abctech.com',
        plainPass: 'recruiter123',
        hashPass: passRecruiter,
        role: 'hr',
        status: 'Active',
        company_name: 'ABC Technologies',
        phone: '+91 98111 22334',
        location: 'Ranchi, Jharkhand',
        title: 'Lead Technical Recruiter',
        about: 'Head of Talent Acquisition at ABC Technologies overseeing technical hiring.',
        skills: 'Technical Sourcing, Candidate Screening, Engineering Pipeline'
      },
      {
        id: 3,
        name: 'Platform Admin',
        email: 'admin@jobconnect.io',
        plainPass: 'superadmin123',
        hashPass: passAdmin,
        role: 'admin',
        status: 'Active',
        company_name: 'JobConnect Platform Ops',
        phone: '+91 90000 00000',
        location: 'New Delhi',
        title: 'Super Administrator',
        about: 'System operations officer managing verification queues and platform moderation.',
        skills: 'System Security, DB Administration, RBAC'
      }
    ];

    for (const demo of demoUsers) {
      const [rows] = await pool.query('SELECT id, password FROM `users` WHERE `email` = ?', [demo.email]);
      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`status\`, \`company_name\`, \`phone\`, \`location\`, \`title\`, \`about\`, \`skills\`) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [demo.id, demo.name, demo.email, demo.hashPass, demo.role, demo.status, demo.company_name, demo.phone, demo.location, demo.title, demo.about, demo.skills]
        );
        console.log(`🌱 Seeded demo account in MySQL: ${demo.email}`);
      } else {
        // Validate if password matches
        let isMatch = false;
        try {
          isMatch = await bcrypt.compare(demo.plainPass, rows[0].password);
        } catch (e) {
          isMatch = false;
        }
        if (!isMatch) {
          await pool.query('UPDATE `users` SET `password` = ? WHERE `id` = ?', [demo.hashPass, rows[0].id]);
          console.log(`🔑 Repaired and verified valid password hash in MySQL for: ${demo.email}`);
        }
      }
    }

    // Check if jobs seed is needed
    const [existingJobs] = await pool.query('SELECT COUNT(*) AS count FROM `jobs`');
    if (existingJobs[0].count === 0) {
      await pool.query(`
        INSERT INTO \`jobs\` (\`id\`, \`title\`, \`company_name\`, \`posted_by\`, \`description\`, \`location\`, \`salary_min\`, \`salary_max\`, \`experience\`, \`job_type\`, \`skills\`, \`deadline\`, \`status\`) VALUES
        (1, 'Junior Web Developer', 'ABC Technologies', 2, 'We are seeking a motivated Junior Web Developer in Ranchi to create interactive web interfaces, implement responsive designs, and integrate backend REST APIs with React.', 'Ranchi', 3, 5, 'Fresher', 'Full Time', 'HTML, CSS, JavaScript, React', '2026-11-15', 'Approved'),
        (2, 'Full Stack MERN & MySQL Engineer', 'InnovateX Solutions', 2, 'Join our core product team building high-scale SaaS products. Deep knowledge of MySQL schemas, token-based authentication, and state management required.', 'Bengaluru', 8, 14, '1-3 Years', 'Full Time', 'React, Node.js, MySQL, Express, TypeScript', '2026-11-20', 'Approved'),
        (3, 'Frontend React Developer (Remote)', 'CloudScale India', 2, 'Work remotely on modern UI design systems. Craft pixel-perfect micro-interactions and integrate GraphQL and REST endpoints.', 'Remote', 6, 10, 'Fresher', 'Full Time', 'React, Tailwind CSS, JavaScript, Redux', '2026-11-25', 'Approved'),
        (4, 'Backend Node.js & Database Specialist', 'DataMatrix Corp', 2, 'Architect resilient microservices, design optimized relational database schemas with MySQL, and maintain secure JWT authentication layers.', 'Hyderabad', 12, 18, '3-5 Years', 'Full Time', 'Node.js, Express, MySQL, Redis, AWS', '2026-11-28', 'Approved'),
        (5, 'Senior Cloud Architect', 'ABC Technologies', 2, 'Lead cloud transformation initiatives, configure high availability MySQL clusters, and supervise DevOps CI/CD pipelines.', 'Pune', 18, 26, '3-5 Years', 'Full Time', 'AWS, Docker, Kubernetes, MySQL, CI/CD', '2026-12-05', 'Pending');
      `);

      await pool.query(`
        INSERT INTO \`applications\` (\`id\`, \`job_id\`, \`applicant_id\`, \`resume_url\`, \`cover_letter\`, \`status\`) VALUES
        (1, 1, 1, 'Ankit_Kumar_FullStack_Resume.pdf', 'I am excited to apply for Junior Web Developer at ABC Technologies. My background in React and full-stack development aligns well with your team objectives.', 'Under Review'),
        (2, 3, 1, 'Ankit_Kumar_FullStack_Resume.pdf', 'I have built multiple responsive web projects with Tailwind CSS and React. I am excited to work remotely with CloudScale India.', 'Applied');
      `);

      console.log('🌱 Seed data initialized successfully in MySQL.');
    }

    // Ensure all demo candidate applications exist in MySQL if not present
    try {
      const [ankitApps] = await pool.query(
        'SELECT id, job_id, applicant_id, status FROM `applications` WHERE `applicant_id` = 1'
      );
      const hasJob1 = ankitApps.some(a => Number(a.job_id) === 1);
      const hasJob3 = ankitApps.some(a => Number(a.job_id) === 3);

      if (!hasJob1) {
        await pool.query(
          `INSERT INTO \`applications\` (\`job_id\`, \`applicant_id\`, \`resume_url\`, \`cover_letter\`, \`status\`)
           VALUES (1, 1, 'Ankit_Kumar_FullStack_Resume.pdf', 'I am excited to apply for Junior Web Developer at ABC Technologies. My background in React and full-stack development aligns well with your team objectives.', 'Under Review')`
        );
        console.log('🌱 Verified and restored application for job 1 in MySQL.');
      }

      if (!hasJob3) {
        await pool.query(
          `INSERT INTO \`applications\` (\`job_id\`, \`applicant_id\`, \`resume_url\`, \`cover_letter\`, \`status\`)
           VALUES (3, 1, 'Ankit_Kumar_FullStack_Resume.pdf', 'I have built multiple responsive web projects with Tailwind CSS and React. I am excited to work remotely with CloudScale India.', 'Applied')`
        );
        console.log('🌱 Verified and restored application for job 3 in MySQL.');
      }
    } catch (appVerifyErr) {
      console.error('Applications verification error:', appVerifyErr.message);
    }
  } catch (seedErr) {
    console.error('Seed/Verification Error:', seedErr.message);
  }
};

const query = async (sql, params = []) => {
  if (!pool) {
    throw new Error('Database pool is not initialized. Please ensure MySQL server is running.');
  }
  return pool.query(sql, params);
};

module.exports = {
  connectDB,
  query,
  getPool: () => pool
};

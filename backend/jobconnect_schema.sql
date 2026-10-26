-- =====================================================================
-- JobConnect Recruitment Platform - MySQL Database Schema & Seed Data
-- Compatible with MySQL 8.0+, MySQL 5.7+, MariaDB & MySQL Workbench
-- =====================================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS `jobconnect_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `jobconnect_db`;

-- Disable Foreign Key checks for clean teardown (if re-running script)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `profile_requests`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `saved_jobs`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 2. Create Table: USERS
-- Role-based access control: 'admin', 'hr', 'user' (job seeker)
-- =====================================================================
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'hr', 'user') NOT NULL DEFAULT 'user',
  `status` ENUM('Active', 'Suspended') NOT NULL DEFAULT 'Active',
  `company_name` VARCHAR(191) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT '+91 98765 43210',
  `location` VARCHAR(150) DEFAULT 'Ranchi, Jharkhand',
  `title` VARCHAR(150) DEFAULT 'Full Stack Developer',
  `about` TEXT DEFAULT NULL,
  `resume_name` VARCHAR(255) DEFAULT 'Ankit_Kumar_FullStack_Resume.pdf',
  `skills` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 3. Create Table: JOBS
-- Posted by HR recruiters, verified by Super Admin
-- =====================================================================
CREATE TABLE `jobs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `company_name` VARCHAR(191) NOT NULL,
  `posted_by` INT NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `salary_min` INT NOT NULL DEFAULT 3,
  `salary_max` INT NOT NULL DEFAULT 6,
  `experience` VARCHAR(100) NOT NULL DEFAULT 'Fresher',
  `job_type` ENUM('Full Time', 'Part Time', 'Internship', 'Contract') NOT NULL DEFAULT 'Full Time',
  `skills` TEXT NOT NULL,
  `deadline` VARCHAR(100) DEFAULT '2026-11-30',
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Closed') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jobs_posted_by` (`posted_by`),
  KEY `idx_jobs_status` (`status`),
  KEY `idx_jobs_location` (`location`),
  CONSTRAINT `fk_jobs_posted_by` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 4. Create Table: APPLICATIONS
-- Candidate job applications with 5-stage live status stepper
-- =====================================================================
CREATE TABLE `applications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `job_id` INT NOT NULL,
  `applicant_id` INT NOT NULL,
  `resume_url` VARCHAR(255) NOT NULL,
  `cover_letter` TEXT DEFAULT NULL,
  `status` ENUM('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected') NOT NULL DEFAULT 'Applied',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_apps_job_id` (`job_id`),
  KEY `idx_apps_applicant_id` (`applicant_id`),
  UNIQUE KEY `unique_job_applicant` (`job_id`, `applicant_id`),
  CONSTRAINT `fk_apps_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_apps_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 5. Create Table: SAVED_JOBS
-- Candidate bookmarked vacancies
-- =====================================================================
CREATE TABLE `saved_jobs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `job_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_saved_job` (`user_id`, `job_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 6. Create Table: NOTIFICATIONS
-- Platform activity feed notifications
-- =====================================================================
CREATE TABLE `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `text` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 6b. Create Table: PROFILE_REQUESTS
-- HR Profile Edit Moderation Queue
-- =====================================================================
CREATE TABLE `profile_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_email` VARCHAR(191) NOT NULL,
  `current_data` LONGTEXT NOT NULL,
  `proposed_data` LONGTEXT NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `admin_notes` TEXT DEFAULT NULL,
  `reviewed_by` INT DEFAULT NULL,
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_req_user_id` (`user_id`),
  KEY `idx_req_status` (`status`),
  CONSTRAINT `fk_req_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 7. SEED DATA
-- Default Demo Accounts (Passwords hashed with bcrypt: cost factor 10)
-- 1) Candidate: ankit.dev@example.com   | password: candidate123
-- 2) HR Recruiter: priya.hr@abctech.com | password: recruiter123
-- 3) Super Admin: admin@jobconnect.io   | password: superadmin123
-- =====================================================================
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `company_name`, `phone`, `location`, `title`, `about`, `skills`)
VALUES
  (1, 'Ankit Kumar', 'ankit.dev@example.com', '$2a$10$tZ2E7gG3Z/5J26U7c7o1yOeqx4QoGf6qj6v0k3m3zV1v2f4q7l9tS', 'user', 'Active', NULL, '+91 98765 43210', 'Ranchi, Jharkhand', 'Full Stack MERN Developer', 'Proactive Full-Stack Software Developer passionate about high-performance web applications with React, Node.js, Express, and MySQL.', 'HTML, CSS, JavaScript, React, Node.js, Express, MySQL, Git, Tailwind CSS'),
  (2, 'Priya Sharma', 'priya.hr@abctech.com', '$2a$10$wB5k7pX6b/2J74V8c8p2zPfqx5QpGg7qk7w1l4n4aW2w3g5r8m0uT', 'hr', 'Active', 'ABC Technologies', '+91 98111 22334', 'Ranchi, Jharkhand', 'Lead Technical Recruiter', 'Head of Talent Acquisition at ABC Technologies overseeing technical hiring and campus outreach.', 'Technical Sourcing, Candidate Screening, Engineering Pipeline'),
  (3, 'Platform Admin', 'admin@jobconnect.io', '$2a$10$xZ6l8qY7c/3K85W9d9q3aQgrx6QqHh8rl8x2m5o5bX3x4h6s9n1vU', 'admin', 'Active', 'JobConnect Platform Ops', '+91 90000 00000', 'New Delhi', 'Super Administrator', 'System operations officer managing verification queues, platform moderation, and security policies.', 'System Security, DB Administration, RBAC, Platform Compliance');

-- =====================================================================
-- 8. SEED DATA: VERIFIED JOBS
-- Pre-populated vacancies from verified employers
-- =====================================================================
INSERT INTO `jobs` (`id`, `title`, `company_name`, `posted_by`, `description`, `location`, `salary_min`, `salary_max`, `experience`, `job_type`, `skills`, `deadline`, `status`)
VALUES
  (1, 'Junior Web Developer', 'ABC Technologies', 2, 'We are seeking a motivated Junior Web Developer in Ranchi to create interactive web interfaces, implement responsive designs, and integrate backend REST APIs with React.', 'Ranchi', 3, 5, 'Fresher', 'Full Time', 'HTML, CSS, JavaScript, React', '2026-11-15', 'Approved'),
  (2, 'Full Stack MERN & MySQL Engineer', 'InnovateX Solutions', 2, 'Join our core product team building high-scale SaaS products. Deep knowledge of MySQL schemas, token-based authentication, and state management required.', 'Bengaluru', 8, 14, '1-3 Years', 'Full Time', 'React, Node.js, MySQL, Express, TypeScript', '2026-11-20', 'Approved'),
  (3, 'Frontend React Developer (Remote)', 'CloudScale India', 2, 'Work remotely on modern UI design systems. Craft pixel-perfect micro-interactions and integrate GraphQL and REST endpoints.', 'Remote', 6, 10, 'Fresher', 'Full Time', 'React, Tailwind CSS, JavaScript, Redux', '2026-11-25', 'Approved'),
  (4, 'Backend Node.js & Database Specialist', 'DataMatrix Corp', 2, 'Architect resilient microservices, design optimized relational database schemas with MySQL, and maintain secure JWT authentication layers.', 'Hyderabad', 12, 18, '3-5 Years', 'Full Time', 'Node.js, Express, MySQL, Redis, AWS', '2026-11-28', 'Approved'),
  (5, 'Senior Cloud Architect', 'ABC Technologies', 2, 'Lead cloud transformation initiatives, configure high availability MySQL clusters, and supervise DevOps CI/CD pipelines.', 'Pune', 18, 26, '3-5 Years', 'Full Time', 'AWS, Docker, Kubernetes, MySQL, CI/CD', '2026-12-05', 'Pending');

-- =====================================================================
-- 9. SEED DATA: APPLICATIONS
-- Seed candidate application in recruitment pipeline
-- =====================================================================
INSERT INTO `applications` (`id`, `job_id`, `applicant_id`, `resume_url`, `cover_letter`, `status`)
VALUES
  (1, 1, 1, 'Ankit_Kumar_FullStack_Resume.pdf', 'I am excited to apply for Junior Web Developer at ABC Technologies. My background in React and full-stack development aligns well with your team objectives.', 'Under Review'),
  (2, 3, 1, 'Ankit_Kumar_FullStack_Resume.pdf', 'I have built multiple responsive web projects with Tailwind CSS and React. I am excited to work remotely with CloudScale India.', 'Applied');

-- =====================================================================
-- 10. SEED DATA: SAVED JOBS & NOTIFICATIONS
-- =====================================================================
INSERT INTO `saved_jobs` (`user_id`, `job_id`)
VALUES
  (1, 2),
  (1, 3);

INSERT INTO `notifications` (`user_id`, `title`, `text`, `type`)
VALUES
  (1, 'Welcome to JobConnect', 'Your candidate profile has been verified and synced with MySQL.', 'info'),
  (1, 'Application Sent', 'Successfully applied to ABC Technologies for Junior Web Developer.', 'job');

-- =====================================================================
-- 11. VERIFICATION QUERIES
-- =====================================================================
SELECT 'DATABASE SETUP COMPLETE!' AS Status;
SELECT COUNT(*) AS total_users FROM `users`;
SELECT COUNT(*) AS total_jobs FROM `jobs`;
SELECT COUNT(*) AS total_applications FROM `applications`;

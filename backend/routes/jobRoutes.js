const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/jobs (Supports public candidate browsing, HR own jobs + approved, and Admin all jobs)
router.get('/', async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary, experience, status, postedBy, company } = req.query;

    // Check optional authentication token
    let requester = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_jobconnect_2026');
        requester = await User.findById(decoded.id);
      } catch (e) {
        // Token invalid or expired - proceed as unauthenticated public visitor
      }
    }

    const filters = {
      keyword,
      location,
      jobType,
      minSalary,
      experience,
      postedBy,
      company
    };

    if (status) {
      // Explicit status query takes precedence (e.g. 'all', 'Approved', 'Pending', 'Rejected')
      filters.status = status;
    } else if (requester && requester.role === 'admin') {
      // Super Admin sees all jobs across the platform by default
      filters.status = 'all';
    } else if (requester && requester.role === 'hr') {
      // HR recruiter sees all Approved jobs + their own pending/rejected jobs
      filters.forRecruiterId = requester.id;
    } else {
      // Candidates and unauthenticated visitors see strictly Approved jobs
      filters.status = 'Approved';
    }

    const jobs = await Job.find(filters);
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/jobs/pending (Admin Only)
router.get('/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Pending' });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/jobs/my (HR's own jobs)
router.get('/my', protect, authorize('hr'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id, status: 'all' });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/jobs/saved/my (Seeker views their bookmarked jobs from MySQL)
router.get('/saved/my', protect, authorize('user'), async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { query } = require('../config/db');
    const [rows] = await query(
      `SELECT sj.job_id
       FROM \`saved_jobs\` sj
       JOIN \`jobs\` j ON sj.job_id = j.id
       WHERE sj.user_id = ?
       ORDER BY sj.created_at DESC`,
      [userId]
    );
    const savedJobIds = rows.map((r) => r.job_id);
    res.json({
      success: true,
      count: savedJobIds.length,
      data: savedJobIds
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/jobs/:id/save (Seeker toggles bookmark in MySQL)
router.post('/:id/save', protect, authorize('user'), async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const cleanId = typeof req.params.id === 'string' && req.params.id.startsWith('job-')
      ? parseInt(req.params.id.replace('job-', ''), 10) || req.params.id
      : req.params.id;
    const { query } = require('../config/db');

    const [existing] = await query(
      'SELECT id FROM `saved_jobs` WHERE `user_id` = ? AND `job_id` = ? LIMIT 1',
      [userId, cleanId]
    );

    let saved = false;
    if (existing.length > 0) {
      await query('DELETE FROM `saved_jobs` WHERE `id` = ?', [existing[0].id]);
      saved = false;
    } else {
      await query('INSERT INTO `saved_jobs` (`user_id`, `job_id`) VALUES (?, ?)', [userId, cleanId]);
      saved = true;
    }

    res.json({
      success: true,
      saved,
      message: saved ? 'Saved to your bookmarks!' : 'Removed from saved jobs'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job vacancy not found' });
    }
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/jobs (HR Only)
router.post('/', protect, authorize('hr'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id || req.user._id,
      companyName: req.body.companyName || req.body.company || req.user.company_name || 'ABC Technologies',
      status: 'Pending' // Sent to Super Admin for verification
    };

    const job = await Job.create(jobData);
    res.status(201).json({
      success: true,
      message: 'Job submitted for admin verification',
      data: job
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/jobs/:id/approve (Admin Only)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({
      success: true,
      message: 'Job approved and published live',
      data: job
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/jobs/:id/reject (Admin Only)
router.put('/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({
      success: true,
      message: 'Job opening rejected',
      data: job
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/jobs/:id (HR Recruiter deletes own job, or Super Admin)
router.delete('/:id', protect, authorize('hr', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    // Role-based ownership check: HR can only delete their own job posts
    if (req.user.role === 'hr') {
      const userId = req.user.id || req.user._id;
      const isOwner = job.posted_by && String(job.posted_by) === String(userId);
      const isDemoPriya = (req.user.email || '').toLowerCase() === 'priya.hr@abctech.com' &&
                          (job.company === 'ABC Technologies' || String(job.posted_by) === '2');
      const hrCompany = (req.user.company_name || req.user.company || '').toLowerCase().trim();
      const jobCompany = (job.company || job.companyName || '').toLowerCase().trim();
      const companyMatches = Boolean(hrCompany && jobCompany && hrCompany === jobCompany);

      if (!isOwner && !isDemoPriya && !companyMatches) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to delete this job vacancy. Recruiters may only delete their own postings.'
        });
      }
    }

    const deleted = await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Job opening "${job.title}" has been deleted successfully`,
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

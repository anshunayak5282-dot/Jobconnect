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

module.exports = router;

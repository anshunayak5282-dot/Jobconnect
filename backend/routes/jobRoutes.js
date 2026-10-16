const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/jobs (Public with search & filter)
router.get('/', async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary, experience, status } = req.query;

    const filters = {
      status: status || 'Approved', // Only show Approved jobs to candidates by default
      keyword,
      location,
      jobType,
      minSalary,
      experience
    };

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
      companyName: req.body.company || req.user.company_name || 'ABC Technologies',
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

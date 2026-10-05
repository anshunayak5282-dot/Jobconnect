const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/jobs (Public with search & filter)
router.get('/', async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary, experience } = req.query;
    let query = { status: 'Approved' }; // Only show approved jobs to public

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { companyName: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experience = experience;
    }

    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
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
      postedBy: req.user._id,
      status: 'Pending' // Requires admin verification
    };
    const job = await Job.create(jobData);
    res.status(201).json({ success: true, message: 'Job submitted for admin approval', data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/jobs/:id/approve (Admin Only)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    res.json({ success: true, message: 'Job approved and live', data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

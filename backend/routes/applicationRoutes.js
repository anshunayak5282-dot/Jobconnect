const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   POST /api/applications (Job seeker applies)
router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;
    
    // Check if already applied
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this vacancy' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
      coverLetter,
      status: 'Applied'
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/applications/my (Seeker views their applications)
router.get('/my', protect, authorize('user'), async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/applications/:id/status (HR updates application status)
router.put('/:id/status', protect, authorize('hr'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, message: `Status updated to ${status}`, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

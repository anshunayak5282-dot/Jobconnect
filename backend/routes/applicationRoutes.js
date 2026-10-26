const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Calculate candidate profile completeness (must be 100% to apply)
function calculateProfileCompleteness(user) {
  if (!user) return 0;
  let score = 0;
  if (user.name && String(user.name).trim()) score += 20;
  if (user.email && String(user.email).trim()) score += 20;
  if (user.phone && String(user.phone).trim()) score += 15;
  if (user.location && String(user.location).trim()) score += 15;
  if (user.title && String(user.title).trim()) score += 10;
  if (user.about && String(user.about).trim()) score += 10;
  const hasSkills = Array.isArray(user.skills)
    ? user.skills.length > 0
    : Boolean(user.skills && String(user.skills).trim());
  if (hasSkills) score += 10;
  return Math.min(score, 100);
}

// @route   POST /api/applications (Job seeker applies)
router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Backend validation guard: enforce 100% profile completion
    const completeness = calculateProfileCompleteness(req.user);
    if (completeness < 100) {
      return res.status(400).json({
        success: false,
        message: 'Complete your profile to 100% to apply for jobs.',
        profileCompleteness: completeness
      });
    }

    const applicantId = req.user.id || req.user._id;
    const cleanJobId = typeof jobId === 'string' ? parseInt(jobId.replace(/^[^\d]+/, ''), 10) || jobId : jobId;

    // Check if already applied
    const existing = await Application.findOne({ job: cleanJobId, applicant: applicantId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this vacancy'
      });
    }

    const application = await Application.create({
      job: cleanJobId,
      applicant: applicantId,
      resume: resume || req.user.resume_name || 'Candidate_Resume.pdf',
      coverLetter: coverLetter || '',
      status: 'Applied'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/applications/my (Seeker views their applications)
router.get('/my', protect, authorize('user'), async (req, res) => {
  try {
    const applicantId = req.user.id || req.user._id;

    // Self-healing check: Ensure candidate demo applications in MySQL are restored if missing
    if (Number(applicantId) === 1 || req.user.email === 'ankit.dev@example.com') {
      try {
        const { query } = require('../config/db');
        const [existing] = await query(
          'SELECT id, job_id FROM `applications` WHERE `applicant_id` = ?',
          [applicantId]
        );
        const hasJob3 = existing.some((e) => Number(e.job_id) === 3);
        if (!hasJob3) {
          await Application.create({
            job: 3,
            applicant: applicantId,
            resume: 'Ankit_Kumar_FullStack_Resume.pdf',
            coverLetter: 'I have built multiple responsive web projects with Tailwind CSS and React. I am excited to work remotely with CloudScale India.',
            status: 'Applied'
          });
        }
      } catch (checkErr) {
        console.error('Candidate demo application check error:', checkErr.message);
      }
    }

    const apps = await Application.find({ applicant: applicantId, applicantEmail: req.user.email });
    res.json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/applications (HR / Admin views applications)
router.get('/', protect, authorize('hr', 'admin'), async (req, res) => {
  try {
    const { jobId, status, company } = req.query;
    const filters = {};

    if (jobId && jobId !== 'all') filters.job = jobId;
    if (status && status !== 'all') filters.status = status;
    if (req.user.role === 'hr') {
      filters.companyName = req.user.company_name || req.user.company || company;
    } else if (company) {
      filters.companyName = company;
    }

    const apps = await Application.find(filters);
    res.json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/applications/:id/status (HR/Admin updates application status)
router.put('/:id/status', protect, authorize('hr', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (req.user.role === 'hr') {
      const hrCompany = (req.user.company_name || req.user.company || '').toLowerCase().trim();
      const appCompany = (app.job?.company || app.job?.companyName || '').toLowerCase().trim();
      const isOwner = app.job?.posted_by && String(app.job.posted_by) === String(req.user.id);
      const companyMatches =
        !hrCompany ||
        !appCompany ||
        appCompany === hrCompany ||
        appCompany.includes(hrCompany) ||
        hrCompany.includes(appCompany);

      if (!isOwner && !companyMatches) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to update applications for another company.'
        });
      }
    }

    const updatedApp = await Application.findByIdAndUpdate(req.params.id, { status });
    if (!updatedApp) {
      return res.status(500).json({ success: false, message: 'Failed to update application status in MySQL' });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updatedApp
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

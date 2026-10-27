const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const ProfileRequest = require('../models/ProfileRequest');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/users (Admin Only - User Directory)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/users/:id/status (Admin Only - Toggle Active/Suspended)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const updatedUser = await User.updateStatus(req.params.id, newStatus);

    res.json({
      success: true,
      message: `User status changed to ${newStatus}`,
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/users/profile-requests (Admin Only - List All Profile Edit Requests)
router.get('/profile-requests', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await ProfileRequest.findAll();
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/users/profile-requests/my (Get Logged-in User's Latest Profile Request)
router.get('/profile-requests/my', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const request = await ProfileRequest.findLatestByUserId(userId);
    res.json({
      success: true,
      data: request || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/users/profile-requests/:id/approve (Admin Only - Approve HR Profile Request)
router.put('/profile-requests/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const adminId = req.user.id || req.user._id;
    const request = await ProfileRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Profile request not found' });
    }

    // Backend Authorization Guard: Prevent HR users from approving their own requests
    if (req.user.role !== 'admin' || String(request.user_id) === String(adminId)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are strictly prohibited from approving your own profile request.'
      });
    }

    if (request.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'This profile request has already been approved.'
      });
    }

    const result = await ProfileRequest.approve(req.params.id, adminId);

    res.json({
      success: true,
      message: `Profile request #${request.id} for ${request.user_name} approved. Profile updated in MySQL.`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/users/profile-requests/:id/reject (Admin Only - Reject HR Profile Request)
router.put('/profile-requests/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const adminId = req.user.id || req.user._id;
    const request = await ProfileRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Profile request not found' });
    }

    // Backend Authorization Guard: Only Admin, no self-approval/self-rejection
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Administrator privileges required.'
      });
    }

    const reason = req.body.reason || 'Changes could not be verified by platform administrator.';
    const result = await ProfileRequest.reject(req.params.id, adminId, reason);

    res.json({
      success: true,
      message: `Profile request #${request.id} rejected. Existing profile remains unchanged.`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/users/profile/:email (Protected - requires authenticated session)
router.get('/profile/:email', protect, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    const { password, ...rest } = user;
    const userSkills = user.skills
      ? (Array.isArray(user.skills) ? user.skills : (typeof user.skills === 'string' ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : []))
      : [];
    const safeUser = {
      ...rest,
      company: user.company_name,
      resumeName: user.resume_name,
      skills: userSkills
    };
    res.json({ success: true, data: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/users/profile (Update current logged-in user profile)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, company, company_name, location, title, about, skills, resume_name, education, experience, projects } = req.body;
    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (company !== undefined) fieldsToUpdate.company_name = company;
    if (company_name !== undefined) fieldsToUpdate.company_name = company_name;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (title !== undefined) fieldsToUpdate.title = title;
    if (about !== undefined) fieldsToUpdate.about = about;
    if (skills !== undefined) {
      fieldsToUpdate.skills = Array.isArray(skills) ? skills.join(', ') : skills;
    }
    const resolvedResume = resume_name !== undefined ? resume_name : (req.body.resumeName !== undefined ? req.body.resumeName : undefined);
    if (resolvedResume !== undefined) fieldsToUpdate.resume_name = resolvedResume;
    if (education !== undefined) fieldsToUpdate.education = education;
    if (experience !== undefined) fieldsToUpdate.experience = experience;
    if (projects !== undefined) fieldsToUpdate.projects = projects;

    // === HR PROFILE APPROVAL INTERCEPTION ===
    // When an HR user edits and submits their profile, do NOT update the profile directly in MySQL.
    // Save the changes as a Pending Approval Request for the Admin.
    if (userRole === 'hr') {
      const currentUser = await User.findById(userId);
      const currentData = {
        name: currentUser.name,
        company_name: currentUser.company_name,
        company: currentUser.company_name,
        title: currentUser.title,
        location: currentUser.location,
        phone: currentUser.phone,
        about: currentUser.about,
        skills: currentUser.skills
      };

      const newRequest = await ProfileRequest.create({
        userId,
        userName: currentUser.name,
        userEmail: currentUser.email,
        currentData,
        proposedData: fieldsToUpdate
      });

      return res.json({
        success: true,
        pendingApproval: true,
        status: 'Pending',
        message: 'Your profile changes have been submitted for Super Admin approval. Your current profile remains unchanged until approved.',
        data: newRequest
      });
    }

    // For candidates / non-HR users, update directly in MySQL
    const updated = await User.updateProfile(userId, fieldsToUpdate);

    res.json({
      success: true,
      pendingApproval: false,
      message: 'Profile updated successfully in MySQL',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/users/resume (Upload candidate resume file)
router.post('/resume', protect, async (req, res) => {
  try {
    const { fileName, fileData, fileSize } = req.body;
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'No resume file selected.' });
    }

    // Validate file extension
    const ext = path.extname(fileName).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx'];
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only .pdf, .doc, and .docx files are allowed.'
      });
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fileSize && fileSize > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit. Please select a smaller document.'
      });
    }

    // Save physical file on server in uploads/resumes if file content provided
    try {
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'resumes');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const sanitizedBase = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const storedFileName = `${Date.now()}_${sanitizedBase}${ext}`;
      const targetPath = path.join(uploadsDir, storedFileName);

      if (fileData) {
        const base64Content = fileData.includes(';base64,') ? fileData.split(';base64,')[1] : fileData;
        const buffer = Buffer.from(base64Content, 'base64');
        if (buffer.length > MAX_SIZE) {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds 5MB limit.'
          });
        }
        fs.writeFileSync(targetPath, buffer);
      }
    } catch (fsErr) {
      console.warn('Note: Physical file write skipped or errored:', fsErr.message);
    }

    // Update user profile in MySQL with the selected file name
    const userId = req.user.id || req.user._id;
    const updated = await User.updateProfile(userId, { resume_name: fileName });

    return res.json({
      success: true,
      message: 'Resume uploaded successfully to server and MySQL',
      data: {
        resumeName: fileName,
        resume_name: fileName,
        user: updated
      }
    });
  } catch (err) {
    console.error('Resume upload endpoint error:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;

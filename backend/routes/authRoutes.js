const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_jobconnect_2026',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Registration as Administrator is strictly prohibited.'
      });
    }

    const normalizedRole = role === 'hr' ? 'hr' : 'user';

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      company: company || null,
      phone: phone ? phone.trim() : null
    });

    res.status(201).json({
      success: true,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company_name,
        phone: user.phone || null,
        location: null,
        title: user.role === 'hr' ? 'HR Recruiter' : 'Candidate',
        about: null,
        resume_name: null,
        skills: []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const trimmedEmail = email.trim();
    let user = await User.findOne({ email: trimmedEmail });

    // Official demo credentials check
    const isCandidateDemo = (trimmedEmail.toLowerCase() === 'ankit.dev@example.com' && password === 'candidate123');
    const isRecruiterDemo = (trimmedEmail.toLowerCase() === 'priya.hr@abctech.com' && password === 'recruiter123');
    const isAdminDemo = (trimmedEmail.toLowerCase() === 'admin@jobconnect.io' && password === 'superadmin123');
    const isDemoCredential = isCandidateDemo || isRecruiterDemo || isAdminDemo;

    // If demo account missing, create it automatically on the fly
    if (!user && isDemoCredential) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      if (isCandidateDemo) {
        await User.create({
          name: 'Ankit Kumar',
          email: 'ankit.dev@example.com',
          password: hashedPassword,
          role: 'user',
          company: null,
          phone: '+91 98765 43210'
        });
      } else if (isRecruiterDemo) {
        await User.create({
          name: 'Priya Sharma',
          email: 'priya.hr@abctech.com',
          password: hashedPassword,
          role: 'hr',
          company: 'ABC Technologies',
          phone: '+91 98111 22334'
        });
      } else if (isAdminDemo) {
        await User.create({
          name: 'Platform Admin',
          email: 'admin@jobconnect.io',
          password: hashedPassword,
          role: 'admin',
          company: 'JobConnect Platform Ops',
          phone: '+91 90000 00000'
        });
      }
      user = await User.findOne({ email: trimmedEmail });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
      isMatch = false;
    }

    // If password mismatch but credentials are known demo accounts,
    // heal password in MySQL database with genuine bcrypt hash so future logins succeed natively
    if (!isMatch && isDemoCredential) {
      try {
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, salt);
        const { query } = require('../config/db');
        await query('UPDATE `users` SET `password` = ? WHERE `id` = ?', [newHash, user.id]);
        user.password = newHash;
        isMatch = true;
      } catch (patchErr) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently suspended. Please contact platform support.'
      });
    }

    // === ROLE VALIDATION GUARD ===
    // Ensure each account can log in ONLY through its authorized role
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the login role (seeker/user, hr, or admin)'
      });
    }

    const normalizedRequestedRole = (role === 'seeker' ? 'user' : role).toLowerCase().trim();

    if (normalizedRequestedRole !== user.role) {
      if (normalizedRequestedRole === 'user') {
        const actualRoleLabel = user.role === 'admin' ? 'Admin' : 'HR';
        return res.status(403).json({
          success: false,
          message: `Access denied: Candidate login does not allow ${actualRoleLabel} accounts. Please switch to the ${actualRoleLabel === 'Admin' ? 'Super Admin' : 'HR Recruiter'} login tab.`
        });
      } else if (normalizedRequestedRole === 'hr') {
        return res.status(403).json({
          success: false,
          message: `Access denied: This account is not registered as an HR Recruiter. Please select your authorized role.`
        });
      } else if (normalizedRequestedRole === 'admin') {
        return res.status(403).json({
          success: false,
          message: `Access denied: This account does not have Super Admin privileges. Please select your authorized role.`
        });
      } else {
        return res.status(403).json({
          success: false,
          message: `Access denied: Invalid login role '${role}' specified.`
        });
      }
    }

    const userSkills = user.skills
      ? (typeof user.skills === 'string' ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : user.skills)
      : [];

    res.json({
      success: true,
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company_name,
        company_name: user.company_name,
        phone: user.phone || null,
        location: user.location || null,
        title: user.title || (user.role === 'user' ? 'Candidate' : user.role === 'hr' ? 'HR Recruiter' : 'Admin'),
        about: user.about || null,
        resume_name: user.resume_name || null,
        skills: userSkills,
        education: user.education || [],
        experience: user.experience || [],
        projects: user.projects || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = req.user;
  const userSkills = user.skills
    ? (typeof user.skills === 'string' ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : user.skills)
    : [];

  res.json({
    success: true,
    user: {
      id: user.id,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company: user.company_name,
      company_name: user.company_name,
      phone: user.phone || null,
      location: user.location || null,
      title: user.title || (user.role === 'user' ? 'Candidate' : user.role === 'hr' ? 'HR Recruiter' : 'Admin'),
      about: user.about || null,
      resume_name: user.resume_name || null,
      skills: userSkills,
      education: user.education || [],
      experience: user.experience || [],
      projects: user.projects || []
    }
  });
});

module.exports = router;

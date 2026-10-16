const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_jobconnect_2026');
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (user.status === 'Suspended') {
        return res.status(403).json({ success: false, message: 'Your account is currently suspended. Access denied.' });
      }

      // Anti-role spoofing check: Verify token role matches real MySQL record
      if (decoded.role && decoded.role !== user.role) {
        return res.status(403).json({ success: false, message: 'Security alert: Token role does not match authenticated database role.' });
      }

      req.user = {
        ...user,
        _id: user.id
      };

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no bearer token provided' });
  }
};

module.exports = { protect };

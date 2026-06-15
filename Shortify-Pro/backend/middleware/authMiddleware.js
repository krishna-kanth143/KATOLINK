import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '401 Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn(`[AUTH] Unauthorized access attempt (User not found for ID: ${decoded.id})`);
      return res.status(401).json({ success: false, message: '401 Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[AUTH_ERROR] Token verification failed:', error.message);
    return res.status(401).json({ success: false, message: '401 Unauthorized' });
  }
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
};

// flow is requwets come and then jwt verification and then allpw or deny 


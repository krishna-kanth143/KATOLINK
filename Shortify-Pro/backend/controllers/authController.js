import User from '../models/User.js';
import Url from '../models/Url.js';
import generateToken from '../utils/generateToken.js';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const apiKey = `kl_${uuidv4().replace(/-/g, '')}`;
    const user = await User.create({ name, email, password, apiKey });

    console.log(`[AUTH] New user registered: ${email}`);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(`[AUTH_ERROR] Registration failure for ${req.body.email}:`, error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn(`[AUTH] Login attempt failed (Invalid password): ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log(`[AUTH] User logged in: ${email}`);

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(`[AUTH_ERROR] Login failure for ${req.body.email}:`, error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Profile synchronization failed' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Purge associated data
    await Promise.all([
      Url.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.json({ success: true, message: 'Account and associated assets decommissioned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Decommissioning cycle failed' });
  }
};

export const regenerateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.apiKey = `kl_${uuidv4().replace(/-/g, '')}`;
    user.apiKeyCreated = Date.now();
    await user.save();
    
    res.json({ success: true, apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to regenerate API key' });
  }
};

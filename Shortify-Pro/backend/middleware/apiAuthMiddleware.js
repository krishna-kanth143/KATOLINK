import User from '../models/User.js';
// this file is used to protect the api 

export const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ success: false, message: 'API key is required' });
  }

  try {
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid API key' });
    }

    // Update usage telemetry
    user.apiKeyLastUsed = Date.now();
    user.apiUsageCount += 1;
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error during API auth' });
  }
};

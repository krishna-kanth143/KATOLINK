import mongoose from 'mongoose';
import User from '../models/User.js';
import Url from '../models/Url.js';

export const getAdminDashboard = async (_req, res) => {
  try {
    const [totalUsers, totalUrls, clicksAgg, activeUsers, recentRegistrations] = await Promise.all([
      User.countDocuments(),
      Url.countDocuments(),
      Url.aggregate([{ $group: { _id: null, clicks: { $sum: '$clickCount' } } }]),
      Url.aggregate([
        {
          $group: {
            _id: '$userId',
            lastCreatedAt: { $max: '$createdAt' }
          }
        },
        {
          $match: {
            lastCreatedAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        { $count: 'count' }
      ]),
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(10)
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalUrls,
        totalClicks: clicksAgg[0]?.clicks || 0,
        activeUsers: activeUsers[0]?.count || 0,
        recentRegistrations
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load admin dashboard' });
  }
};

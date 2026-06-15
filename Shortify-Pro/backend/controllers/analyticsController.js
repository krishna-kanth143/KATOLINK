import mongoose from 'mongoose';
import Url from '../models/Url.js';
import Click from '../models/Click.js';

// in this we can  calculatte the counts 

const getMetricsInternal = async (userId) => {
  try {
    const uid = new mongoose.Types.ObjectId(userId);
    const [
      totalUrls,
      activeUrls,
      expiredUrls,
      disabledUrls,
      totals
    ] = await Promise.all([
      Url.countDocuments({ userId: uid }),
      Url.countDocuments({ userId: uid, status: 'active' }),
      Url.countDocuments({ userId: uid, status: 'expired' }),
      Url.countDocuments({ userId: uid, status: 'disabled' }),
      Url.aggregate([
        { $match: { userId: uid } },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: '$clickCount' },
            totalQrScans: { $sum: '$qrScanCount' }
          }
        }
      ])
    ]);

    return {
      totalLinks: totalUrls,
      totalUrls, // keep for compatibility
      activeLinks: activeUrls,
      activeUrls, // keep for compatibility
      expiredLinks: expiredUrls,
      disabledLinks: disabledUrls,
      totalClicks: totals[0]?.totalClicks || 0,
      qrGenerated: totals[0]?.totalQrScans || 0
    };
  } catch (err) {
    console.error('[METRICS_INTERNAL_ERROR]', err);
    throw err;
  }
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [
      totalUrls,
      totals,
      activeUrls,
      expiredUrls,
      disabledUrls,
      topUrls,
      recentUrls,
      dailyClicks,
      deviceAnalytics
    ] = await Promise.all([
      Url.countDocuments({ userId }),
      Url.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: '$clickCount' },
            totalQrScans: { $sum: '$qrScanCount' }
          }
        }
      ]),
      Url.countDocuments({ userId, status: 'active' }),
      Url.countDocuments({ userId, status: 'expired' }),
      Url.countDocuments({ userId, status: 'disabled' }),
      Url.find({ userId })
        .select('shortCode originalUrl clickCount qrScanCount status createdAt')
        .sort({ clickCount: -1 })
        .limit(5),
      Url.find({ userId })
        .select('shortCode originalUrl clickCount qrScanCount status createdAt')
        .sort({ createdAt: -1 })
        .limit(8),
      Click.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        { $limit: 30 }
      ]),
      Click.aggregate([
        { $match: { userId } },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const mobileClicks = deviceAnalytics.find(d => d._id === 'Mobile')?.count || 0;
    const totalClicksCount = totals[0]?.totalClicks || 0;
    const mobilePurity = totalClicksCount > 0 ? ((mobileClicks / totalClicksCount) * 100).toFixed(1) + '%' : '0%';

    // Fix: clickTrend was undefined. Map dailyClicks to the expected format.
    const clickTrend = dailyClicks.map((row) => ({
      _id: `${row._id.year}-${String(row._id.month).padStart(2, '0')}-${String(row._id.day).padStart(2, '0')}`,
      clicks: row.clicks
    }));

    return res.json({
      success: true,
      data: {
        stats: {
          totalLinks: totalUrls,
          totalUrls, // keep for compatibility
          totalClicks: totalClicksCount,
          activeUrls,
          expiredUrls,
          disabledUrls,
          qrScans: totals[0]?.totalQrScans || 0,
          mobilePurity
        },
        charts: {
          clickTrend,
          deviceAnalytics,
          topUrls,
          recentUrls
        }
      }
    });
  } catch (error) {
    console.error('[DASHBOARD_ANALYTICS_ERROR]', error);
    return res.status(500).json({ success: false, message: 'Database service unavailable' });
  }
};

export const getSingleUrlAnalytics = async (req, res) => {
  try {
    const urlDoc = await Url.findOne({ _id: req.params.id, userId: req.user._id });
    if (!urlDoc) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    const [history, dailyClicks, deviceAnalytics, countryAnalytics, referrerAnalytics] = await Promise.all([
      Click.find({ urlId: urlDoc._id }).sort({ timestamp: -1 }).limit(200),
      Click.aggregate([
        { $match: { urlId: urlDoc._id } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Click.aggregate([
        { $match: { urlId: urlDoc._id } },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Click.aggregate([
        { $match: { urlId: urlDoc._id } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Click.aggregate([
        { $match: { urlId: urlDoc._id } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return res.json({
      success: true,
      data: {
        url: {
          _id: urlDoc._id,
          originalUrl: urlDoc.originalUrl,
          shortCode: urlDoc.shortCode,
          shortUrl: `${process.env.BASE_URL}/${urlDoc.shortCode}`,
          clickCount: urlDoc.clickCount,
          qrScanCount: urlDoc.qrScanCount,
          status: urlDoc.status,
          expiryDate: urlDoc.expiryDate
        },
        clickHistory: history,
        dailyClicks: dailyClicks.map((row) => ({
          date: `${row._id.year}-${String(row._id.month).padStart(2, '0')}-${String(row._id.day).padStart(2, '0')}`,
          clicks: row.clicks
        })),
        deviceAnalytics,
        countryAnalytics,
        referrerAnalytics
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load URL analytics' });
  }
};
export const getQrAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [totals, dailyScans, weeklyScans, monthlyScans] = await Promise.all([
      Url.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalQrScans: { $sum: '$qrScanCount' } } }
      ]),
      Click.aggregate([
        { $match: { userId, source: 'qr' } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        { $limit: 30 }
      ]),
      Click.aggregate([
        { $match: { userId, source: 'qr' } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              week: { $week: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } }
      ]),
      Click.aggregate([
        { $match: { userId, source: 'qr' } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    return res.json({
      success: true,
      data: {
        totalQrScans: totals[0]?.totalQrScans || 0,
        daily: dailyScans.map(r => ({
          date: `${r._id.year}-${String(r._id.month).padStart(2, '0')}-${String(r._id.day).padStart(2, '0')}`,
          count: r.count
        })),
        weekly: weeklyScans.map(r => ({
          label: `Week ${r._id.week}, ${r._id.year}`,
          count: r.count
        })),
        monthly: monthlyScans.map(r => ({
          label: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`,
          count: r.count
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load QR analytics' });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await getMetricsInternal(req.user._id);
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database unavailable' });
  }
};

export const getRecentLinksList = async (req, res) => {
  try {
    const recentLinks = await Url.find({ userId: req.user._id })
      .select('shortCode originalUrl clickCount status createdAt')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json({ success: true, recentLinks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'API unavailable' });
  }
};

export const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const [metrics, dailyClicks] = await Promise.all([
      getMetricsInternal(userId),
      Click.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        { $limit: 30 }
      ])
    ]);

    const clickTrend = dailyClicks.map((row) => ({
      date: `${row._id.year}-${String(row._id.month).padStart(2, '0')}-${String(row._id.day).padStart(2, '0')}`,
      clicks: row.clicks
    }));

    res.json({ success: true, metrics, clickTrend });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Telemetry system offline' });
  }
};

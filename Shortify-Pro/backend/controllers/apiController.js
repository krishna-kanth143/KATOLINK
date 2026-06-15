import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

export const shortenUrlV1 = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'Original URL is required' });
    }

    const shortCode = nanoid(7);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    const newUrl = await Url.create({
      originalUrl: url,
      shortCode,
      userId: req.user._id,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      shortUrl: shortUrl,
      data: {
        shortCode: newUrl.shortCode,
        originalUrl: newUrl.originalUrl,
        createdAt: newUrl.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'API shortening failure' });
  }
};

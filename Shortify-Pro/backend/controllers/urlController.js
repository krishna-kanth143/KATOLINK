import { nanoid } from 'nanoid';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';
import Url from '../models/Url.js';
import Click from '../models/Click.js';
import { generateQrCode } from '../services/qrService.js';
import { getIO } from '../services/socketService.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { isPrivateIp } from '../utils/ipValidator.js';

const getExpiresAtFromPreset = (preset, customDate) => {
  const now = new Date();
  if (preset === '1d') return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  if (preset === '7d') return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (preset === '30d') return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (preset === '90d') return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  if (preset === 'custom' && customDate) return new Date(customDate);
  return null;
};

const respondWithMessage = (req, res, statusCode, message, pagePath) => {
  const frontendUrl = process.env.FRONTEND_URL;
  const acceptsHtml = req.headers.accept?.includes('text/html');

  if (frontendUrl && acceptsHtml && pagePath) {
    return res.redirect(`${frontendUrl}${pagePath}`);
  }

  return res.status(statusCode).json({ success: false, message });
};
//this for a crud operation

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiryPreset, customExpiryDate, password } = req.body;

    let finalUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'http://' + finalUrl;
    }

    const shortCode = customAlias?.trim() || nanoid(7);
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Short code/custom alias already exists' });
    }

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCodeUrl = await generateQrCode(shortUrl);
    const expiresAt = getExpiresAtFromPreset(expiryPreset, customExpiryDate);

    if (expiresAt && expiresAt <= new Date()) {
       return res.status(400).json({ success: false, message: 'Expiration date must be in the future' });
    }

    const url = await Url.create({
      originalUrl: finalUrl,
      shortCode,
      customAlias: customAlias || '',
      userId: req.user._id,
      qrCodeUrl,
      expiresAt,
      password: password || ''
    });

    console.log(`[URL] Created short link: ${shortCode} for user ${req.user._id}`);
    return res.status(201).json({ success: true, data: { ...url.toObject(), shortUrl } });
  } catch (error) {
    console.error('[URL_ERROR] Creation failure:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating URL' });
  }
};


export const getMyUrls = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = (req.query.search || '').trim();
    const status = req.query.status || 'all';
    const sort = req.query.sort === 'oldest' ? 1 : -1;

    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active' || status === 'expired') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [urls, total] = await Promise.all([
      Url.find(query).sort({ createdAt: sort }).skip(skip).limit(limit),
      Url.countDocuments(query)
    ]);

    const now = new Date();
    const normalized = await Promise.all(
      urls.map(async (urlDoc) => {
        // Keep status in sync for expired links.
        if (urlDoc.expiresAt && urlDoc.expiresAt < now && urlDoc.status === 'active') {
          urlDoc.status = 'expired';
          await urlDoc.save();
        }

        return {
          ...urlDoc.toObject(),
          shortUrl: `${process.env.BASE_URL}/${urlDoc.shortCode}`
        };
      })
    );

    return res.json({
      success: true,
      data: normalized,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching URLs' });
  }
};

export const updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Url.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while updating URL' });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Url.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    return res.json({ success: true, message: 'URL deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while deleting URL' });
  }
};
// this used for redirect to original url using a short url
export const redirectShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const source = req.query.source === 'qr' ? 'qr' : 'direct';
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return respondWithMessage(req, res, 404, 'Short URL not found', '/link-not-found');
    }

    if (urlDoc.expiresAt && new Date(urlDoc.expiresAt) < new Date()) {
      urlDoc.status = 'expired';
      await urlDoc.save();
      return respondWithMessage(req, res, 410, 'URL has expired', '/link-expired');
    }

    if (urlDoc.status === 'expired') {
      return respondWithMessage(req, res, 410, 'URL has expired', '/link-expired');
    }

    if (urlDoc.status === 'disabled') {
      return respondWithMessage(req, res, 403, 'URL is disabled', '/link-expired');
    }

    const parser = new UAParser(req.headers['user-agent'] || '');
    const deviceTypeRaw = parser.getDevice().type;
    const deviceType = deviceTypeRaw
      ? deviceTypeRaw.charAt(0).toUpperCase() + deviceTypeRaw.slice(1)
      : 'Desktop';
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';

    const rawIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString();
    const ipAddress = rawIp.split(',')[0].trim();

    let country = 'Unknown';
    let city = 'Unknown';
    const cleanedIp = ipAddress.replace('::ffff:', '');
    if (cleanedIp && cleanedIp !== '127.0.0.1' && cleanedIp !== '::1') {
      const geo = geoip.lookup(cleanedIp);
      if (geo) {
        country = geo.country || 'Unknown';
        city = geo.city || 'Unknown';
      }
    }

    urlDoc.clickCount += 1;
    if (source === 'qr') {
      urlDoc.qrScanCount += 1;
    }
    await urlDoc.save();

    const recentClick = await Click.create({
      urlId: urlDoc._id,
      userId: urlDoc.userId,
      timestamp: new Date(),
      deviceType,
      browser,
      os,
      ipAddress: cleanedIp || 'Unknown',
      country,
      city,
      source,
      referrer: req.headers.referrer || req.headers.referer || 'Direct'
    });

    const io = getIO();
    if (io) {
      io.to(urlDoc.userId.toString()).emit('click_update', {
        urlId: urlDoc._id,
        recentClick
      });
      io.emit('active_visitors', { count: Math.max(1, io.engine.clientsCount) });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.log(`[TRAFFIC] Redirecting ${shortCode} -> ${urlDoc.originalUrl} (${source})`);
    return res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error('[TRAFFIC_ERROR] Redirection failure:', error);
    return res.status(500).json({ success: false, message: 'Server error during redirect' });
  }
};

export const bulkCreateUrls = async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ success: false, message: 'Invalid bulk payload' });
    }

    const results = [];
    for (const item of urls) {
      const shortCode = item.customAlias?.trim() || nanoid(7);
      const existing = await Url.findOne({ shortCode });
      
      if (!existing) {
        const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
        const qrCodeUrl = await generateQrCode(shortUrl);
        const url = await Url.create({
          originalUrl: item.originalUrl,
          shortCode,
          customAlias: item.customAlias || '',
          userId: req.user._id,
          qrCodeUrl,
          status: 'active'
        });
        results.push({ ...url.toObject(), shortUrl });
      }
    }

    return res.status(201).json({ success: true, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Bulk processing failure' });
  }
};

export const getUrlPreview = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    let domain = 'Unknown';
    try {
      domain = new URL(urlDoc.originalUrl).hostname;
    } catch (e) {
      domain = urlDoc.originalUrl;
    }

    let metadata = {
      title: 'Unknown Title',
      description: 'No description available',
      favicon: '',
      domain
    };

    try {
      const destUrl = new URL(urlDoc.originalUrl);
      if (await isPrivateIp(destUrl.hostname)) {
        return res.status(403).json({ success: false, message: 'Access to internal infrastructure is forbidden' });
      }

      const response = await axios.get(urlDoc.originalUrl, { 
        timeout: 3000, 
        headers: { 'User-Agent': 'KatoLink-Preview/1.0' }
      });
      const $ = cheerio.load(response.data);
      
      metadata.title = $('title').text() || $('meta[property="og:title"]').attr('content') || metadata.title;
      metadata.description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || metadata.description;
      
      const icon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
      if (icon) {
        if (icon.startsWith('http')) {
          metadata.favicon = icon;
        } else {
          const origin = new URL(urlDoc.originalUrl).origin;
          metadata.favicon = `${origin}${icon.startsWith('/') ? '' : '/'}${icon}`;
        }
      }
    } catch (fetchError) {
      console.warn('Metadata fetch failed:', fetchError.message);
    }

    return res.json({
      success: true,
      data: {
        originalUrl: urlDoc.originalUrl,
        shortCode: urlDoc.shortCode,
        metadata,
        safetyScore: urlDoc.safetyScore || 100,
        expiresAt: urlDoc.expiresAt,
        status: urlDoc.status
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate preview' });
  }
};

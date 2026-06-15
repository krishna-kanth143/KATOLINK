import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Url from '../models/Url.js';
import Click from '../models/Click.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({ email: 'test@katolink.com' });
    const user = await User.create({
      name: 'Test Pilot',
      email: 'test@katolink.com',
      password: 'password123',
      role: 'user'
    });

    await Url.deleteMany({ userId: user._id });
    await Click.deleteMany({ userId: user._id });

    // Create 3 links
    const links = await Url.insertMany([
      {
        originalUrl: 'https://google.com',
        shortCode: 'google',
        userId: user._id,
        clickCount: 15,
        status: 'active'
      },
      {
        originalUrl: 'https://github.com',
        shortCode: 'github',
        userId: user._id,
        clickCount: 5,
        status: 'expired',
        expiresAt: new Date(Date.now() - 86400000)
      },
      {
        originalUrl: 'https://twitter.com',
        shortCode: 'twitter',
        userId: user._id,
        clickCount: 0,
        status: 'disabled'
      }
    ]);

    // Create analytics for the last 7 days
    const clickRecords = [];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      clickRecords.push({
        urlId: links[0]._id,
        userId: user._id,
        timestamp: date,
        deviceType: devices[Math.floor(Math.random() * devices.length)],
        country: 'United States',
        source: 'direct'
      });
    }

    await Click.insertMany(clickRecords);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();

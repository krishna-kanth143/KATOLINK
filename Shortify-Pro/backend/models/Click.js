import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    deviceType: {
      type: String,
      default: 'Desktop'
    },
    browser: {
      type: String,
      default: 'Unknown'
    },
    os: {
      type: String,
      default: 'Unknown'
    },
    ipAddress: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: 'Unknown'
    },
    city: {
      type: String,
      default: 'Unknown'
    },
    source: {
      type: String,
      enum: ['direct', 'qr'],
      default: 'direct'
    },
    referrer: {
      type: String,
      default: 'Direct'
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model('Click', clickSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customAlias: {
      type: String,
      default: '',
      sparse: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    qrCodeUrl: {
      type: String,
      default: ''
    },
    clickCount: {
      type: Number,
      default: 0
    },
    qrScanCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'disabled'],
      default: 'active'
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true
    },
    password: {
      type: String,
      default: ''
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    previewEnabled: {
      type: Boolean,
      default: false
    },
    safetyScore: {
      type: Number,
      default: 100
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ userId: 1, status: 1 });
urlSchema.index({ userId: 1, expiresAt: 1 });

urlSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

urlSchema.methods.matchLinkPassword = async function (enteredPassword) {
  if (!this.password) return true;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Url', urlSchema);

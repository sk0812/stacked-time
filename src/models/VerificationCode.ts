import mongoose from 'mongoose';
import crypto from 'crypto';

const VerificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  newEmail: {
    type: String,
    required: false, // Make it optional for backward compatibility
  },
  code: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document will be automatically deleted after 10 minutes
  },
});

// Create a compound index to ensure only one active code per email
VerificationCodeSchema.index({ email: 1, token: 1 });

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.VerificationCode) {
  delete mongoose.models.VerificationCode;
}

export default mongoose.model('VerificationCode', VerificationCodeSchema);
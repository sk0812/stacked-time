import mongoose from 'mongoose';

const TimerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['running', 'paused', 'finished'],
    default: 'paused',
  },
  time: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  categoryId: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Timer) {
  delete mongoose.models.Timer;
}

const TimerModel = mongoose.model('Timer', TimerSchema);
export default TimerModel; 
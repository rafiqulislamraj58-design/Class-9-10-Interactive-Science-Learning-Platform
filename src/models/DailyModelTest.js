import mongoose from 'mongoose';

const dailyModelTestSchema = new mongoose.Schema(
  {
    dateString: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    totalQuestions: {
      type: Number,
      default: 25,
    },
    subjectDistribution: {
      physics: { type: Number, default: 0 },
      chemistry: { type: Number, default: 0 },
      biology: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const DailyModelTest = mongoose.model('DailyModelTest', dailyModelTestSchema);
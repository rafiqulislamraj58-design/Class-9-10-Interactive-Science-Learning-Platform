import mongoose from 'mongoose';

const topicPerformanceSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    topicTitle: { type: String, default: '' },
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    isWeak: { type: Boolean, default: false },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    attemptId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    anonymousDeviceId: {
      type: String,
      default: 'guest-device',
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    mode: {
      type: String,
      enum: ['quick', 'full', 'custom'],
      default: 'quick',
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    unanswered: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0, // Percentage (0 - 100)
    },
    timeTaken: {
      type: Number,
      default: 0, // In seconds
    },
    status: {
      type: String,
      enum: ['started', 'submitted'],
      default: 'started',
    },
    topicPerformance: {
      type: [topicPerformanceSchema],
      default: [],
    },
    detailedResults: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// SRS Section 11.11 অনুযায়ী Index
quizAttemptSchema.index({ anonymousDeviceId: 1, submittedAt: -1 });

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
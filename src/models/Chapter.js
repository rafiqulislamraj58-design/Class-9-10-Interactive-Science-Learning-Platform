import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleEn: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    estimatedMinutes: {
      type: Number,
      default: 30,
    },
    order: {
      type: Number,
      required: true,
    },
    topicCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// SRS Section 11.11 অনুযায়ী Compound Indexes
chapterSchema.index({ subjectId: 1, order: 1 });
chapterSchema.index({ subjectId: 1, slug: 1 }, { unique: true });

export const Chapter = mongoose.model('Chapter', chapterSchema);
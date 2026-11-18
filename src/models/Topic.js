import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    topicId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      default: '',
      trim: true,
    },
    summary: {
      type: String,
      default: '',
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    formulaIds: {
      type: [String],
      default: [],
    },
    animationIds: {
      type: [String],
      default: [],
    },
    modelIds: {
      type: [String],
      default: [],
    },
    labIds: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      required: true,
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
topicSchema.index({ chapterId: 1, order: 1 });
topicSchema.index({ chapterId: 1, slug: 1 }, { unique: true });

export const Topic = mongoose.model('Topic', topicSchema);
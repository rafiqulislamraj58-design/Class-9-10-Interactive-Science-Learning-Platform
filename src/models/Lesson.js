import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'text',
        'heading',
        'paragraph',
        'formula',
        'image',
        'diagram',
        'animation',
        'simulation',
        'model3d',
        'lab',
        'example',
        'note',
        'table',
        'graph',
        'quiz',
      ],
    },
    content: { type: String, default: '' },
    title: { type: String, default: '' },
    formulaId: { type: String, default: '' },
    animationId: { type: String, default: '' },
    modelId: { type: String, default: '' },
    labId: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    caption: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
    order: { type: Number, default: 1 },
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    blocks: {
      type: [blockSchema],
      default: [],
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'unpublished', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// SRS Section 11.11 অনুযায়ী Compound Index
lessonSchema.index({ chapterId: 1, topicId: 1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);
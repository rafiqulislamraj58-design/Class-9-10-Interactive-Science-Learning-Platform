import mongoose from 'mongoose';

const contentVersionSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      required: true,
      enum: ['subject', 'chapter', 'topic', 'lesson', 'formula', 'animation', 'model3d', 'lab', 'question'],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'unpublished', 'archived'],
      default: 'published',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    changeNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const ContentVersion = mongoose.model('ContentVersion', contentVersionSchema);
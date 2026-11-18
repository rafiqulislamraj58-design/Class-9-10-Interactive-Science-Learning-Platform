import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      enum: ['physics', 'chemistry', 'biology'],
    },
    nameBn: {
      type: String,
      required: true,
      trim: true,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    classLevels: {
      type: [Number],
      default: [9, 10],
    },
    chapterCount: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#2563eb',
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

subjectSchema.index({ order: 1 });

export const Subject = mongoose.model('Subject', subjectSchema);
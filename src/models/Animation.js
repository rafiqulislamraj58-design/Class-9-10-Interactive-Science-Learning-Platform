import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    durationMs: { type: Number, default: 2000 },
    params: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const animationSchema = new mongoose.Schema(
  {
    animationId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'PROCESS_ANIMATION',
        'SCIENTIFIC_DIAGRAM_ANIMATION',
        'MOTION_ANIMATION',
        'MOLECULAR_ANIMATION',
        'REACTION_ANIMATION',
        'BIOLOGICAL_PROCESS_ANIMATION',
        'GRAPH_ANIMATION',
      ],
    },
    engine: {
      type: String,
      enum: ['canvas', 'svg'],
      default: 'canvas',
    },
    config: {
      autoplay: { type: Boolean, default: false },
      loop: { type: Boolean, default: false },
      speed: { type: Number, default: 1 },
      showLabels: { type: Boolean, default: true },
      defaultParams: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    steps: {
      type: [stepSchema],
      default: [],
    },
    explanationBn: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Animation = mongoose.model('Animation', animationSchema);
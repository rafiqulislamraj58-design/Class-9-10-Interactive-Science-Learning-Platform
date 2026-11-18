import mongoose from 'mongoose';

const partSchema = new mongoose.Schema(
  {
    partId: { type: String, required: true },
    nameBn: { type: String, required: true },
    nameEn: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
    meshName: { type: String, default: '' },
  },
  { _id: false }
);

const model3DSchema = new mongoose.Schema(
  {
    modelId: {
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
    format: {
      type: String,
      enum: ['glb', 'gltf'],
      default: 'glb',
    },
    modelUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    config: {
      rotate: { type: Boolean, default: true },
      zoom: { type: Boolean, default: true },
      pan: { type: Boolean, default: true },
      showLabels: { type: Boolean, default: true },
      explodedView: { type: Boolean, default: false },
      sectionView: { type: Boolean, default: false },
    },
    parts: {
      type: [partSchema],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Model3D = mongoose.model('Model3D', model3DSchema);
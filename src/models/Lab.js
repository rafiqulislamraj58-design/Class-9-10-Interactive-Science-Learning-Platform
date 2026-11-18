import mongoose from 'mongoose';

const labSchema = new mongoose.Schema(
  {
    labId: {
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
        'PARAMETER_SIMULATOR',
        'LIVE_GRAPH',
        'FORMULA_CALCULATOR',
        'THREE_D_MODEL',
        'PROCESS_ANIMATION',
        'VIRTUAL_INSTRUMENT',
        'DRAG_DROP',
        'MATCHING_GAME',
        'VIRTUAL_EXPERIMENT',
        'CASE_STUDY',
        'MOLECULE_BUILDER',
        'CIRCUIT_BUILDER',
        'DIAGRAM_EXPLORER',
      ],
    },
    engine: {
      type: String,
      enum: ['canvas', 'svg', 'three', 'custom'],
      default: 'canvas',
    },
    instructions: {
      type: [String],
      default: [],
    },
    requiredMaterials: {
      type: [String],
      default: [],
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    conclusionBn: {
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

export const Lab = mongoose.model('Lab', labSchema);
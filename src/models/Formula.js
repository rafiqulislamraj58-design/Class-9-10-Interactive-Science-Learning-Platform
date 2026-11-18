import mongoose from 'mongoose';

const variableSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
    unit: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const formulaSchema = new mongoose.Schema(
  {
    formulaId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    expression: {
      type: String,
      required: true,
      trim: true,
    },
    variables: {
      type: [variableSchema],
      default: [],
    },
    calculationKey: {
      type: String,
      required: true,
      trim: true,
    },
    example: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
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

export const Formula = mongoose.model('Formula', formulaSchema);
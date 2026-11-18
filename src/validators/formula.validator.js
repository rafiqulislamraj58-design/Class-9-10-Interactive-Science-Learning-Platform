import { z } from 'zod';

const variableValidator = z.object({
  symbol: z.string().min(1, 'Variable symbol is required (e.g., u, v, t)'),
  meaning: z.string().min(1, 'Variable meaning in Bengali is required'),
  unit: z.string().optional().default(''),
});

export const createFormulaSchema = z.object({
  formulaId: z.string().min(2, 'Unique formulaId is required (e.g., acceleration-formula)'),
  subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Subject ObjectId'),
  topicId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Topic ObjectId'),
  name: z.string().min(2, 'Formula name is required'),
  expression: z.string().min(1, 'LaTeX expression is required'),
  variables: z.array(variableValidator).min(1, 'At least one variable is required'),
  calculationKey: z.string().min(1, 'Calculation function key is required'),
  example: z.string().optional().default(''),
  explanation: z.string().optional().default(''),
  isPublished: z.boolean().optional().default(true),
});

export const updateFormulaSchema = createFormulaSchema.partial();
import { z } from 'zod';

// 1. Animation Schema
export const createAnimationSchema = z.object({
  animationId: z.string().min(2, 'Unique animationId is required'),
  title: z.string().min(2, 'Title is required'),
  type: z.enum([
    'PROCESS_ANIMATION',
    'SCIENTIFIC_DIAGRAM_ANIMATION',
    'MOTION_ANIMATION',
    'MOLECULAR_ANIMATION',
    'REACTION_ANIMATION',
    'BIOLOGICAL_PROCESS_ANIMATION',
    'GRAPH_ANIMATION',
  ]),
  engine: z.enum(['canvas', 'svg']).optional().default('canvas'),
  config: z
    .object({
      autoplay: z.boolean().optional().default(false),
      loop: z.boolean().optional().default(false),
      speed: z.number().positive().optional().default(1),
      showLabels: z.boolean().optional().default(true),
      defaultParams: z.record(z.any()).optional().default({}),
    })
    .optional()
    .default({}),
  steps: z
    .array(
      z.object({
        stepNumber: z.number().int().positive(),
        title: z.string().min(1),
        description: z.string().optional().default(''),
        durationMs: z.number().int().positive().optional().default(2000),
        params: z.record(z.any()).optional().default({}),
      })
    )
    .optional()
    .default([]),
  explanationBn: z.string().optional().default(''),
  isPublished: z.boolean().optional().default(true),
});

export const updateAnimationSchema = createAnimationSchema.partial();

// 2. 3D Model Schema
export const createModel3DSchema = z.object({
  modelId: z.string().min(2, 'Unique modelId is required'),
  title: z.string().min(2, 'Title is required'),
  format: z.enum(['glb', 'gltf']).optional().default('glb'),
  modelUrl: z.string().min(1, 'modelUrl is required'),
  thumbnailUrl: z.string().optional().default(''),
  config: z
    .object({
      rotate: z.boolean().optional().default(true),
      zoom: z.boolean().optional().default(true),
      pan: z.boolean().optional().default(true),
      showLabels: z.boolean().optional().default(true),
      explodedView: z.boolean().optional().default(false),
      sectionView: z.boolean().optional().default(false),
    })
    .optional()
    .default({}),
  parts: z
    .array(
      z.object({
        partId: z.string().min(1),
        nameBn: z.string().min(1),
        nameEn: z.string().optional().default(''),
        descriptionBn: z.string().optional().default(''),
        meshName: z.string().optional().default(''),
      })
    )
    .optional()
    .default([]),
  isPublished: z.boolean().optional().default(true),
});

export const updateModel3DSchema = createModel3DSchema.partial();

// 3. Virtual Lab Schema
export const createLabSchema = z.object({
  labId: z.string().min(2, 'Unique labId is required'),
  title: z.string().min(2, 'Title is required'),
  type: z.enum([
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
  ]),
  engine: z.enum(['canvas', 'svg', 'three', 'custom']).optional().default('canvas'),
  instructions: z.array(z.string()).optional().default([]),
  requiredMaterials: z.array(z.string()).optional().default([]),
  config: z.record(z.any()).optional().default({}),
  conclusionBn: z.string().optional().default(''),
  isPublished: z.boolean().optional().default(true),
});

export const updateLabSchema = createLabSchema.partial();
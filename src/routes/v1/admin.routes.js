import { Router } from 'express';
import * as adminController from '../../controllers/admin.controller.js';
import { uploadAsset } from '../../middlewares/upload.middleware.js';
import * as subjectController from '../../controllers/subject.controller.js';
import * as chapterController from '../../controllers/chapter.controller.js';
import * as topicController from '../../controllers/topic.controller.js';
import * as lessonController from '../../controllers/lesson.controller.js';
import * as formulaController from '../../controllers/formula.controller.js';
import * as animationController from '../../controllers/animation.controller.js';
import * as modelController from '../../controllers/model.controller.js';
import * as labController from '../../controllers/lab.controller.js';
import * as quizController from '../../controllers/quiz.controller.js';
import { adminAuth } from '../../middlewares/adminAuth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ALL_ADMIN_ROLES, ROLES } from '../../constants/roles.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  adminLoginSchema,
  publishContentSchema,
} from '../../validators/admin.validator.js';
import {
  createSubjectSchema,
  updateSubjectSchema,
} from '../../validators/subject.validator.js';
import {
  createChapterSchema,
  updateChapterSchema,
} from '../../validators/chapter.validator.js';
import {
  createTopicSchema,
  updateTopicSchema,
} from '../../validators/topic.validator.js';
import {
  createLessonSchema,
  updateLessonSchema,
} from '../../validators/lesson.validator.js';
import {
  createFormulaSchema,
  updateFormulaSchema,
} from '../../validators/formula.validator.js';
import {
  createAnimationSchema,
  updateAnimationSchema,
  createModel3DSchema,
  updateModel3DSchema,
  createLabSchema,
  updateLabSchema,
} from '../../types/schemas.js';
import {
  bulkCreateQuestionSchema,
  updateQuestionSchema,
} from '../../validators/question.validator.js';

const router = Router();

// --- PUBLIC ADMIN AUTH ROUTES (SRS Section 12.7) ---
router.post('/auth/login', validate(adminLoginSchema), adminController.loginAdmin);
router.post('/auth/logout', adminController.logoutAdmin);
router.post('/auth/refresh', adminController.refreshAdminToken);

// --- PROTECTED ADMIN ROUTES (Requires JWT Auth) ---
router.use(adminAuth);

router.get('/auth/me', adminController.getAdminProfile);
router.get('/dashboard', adminController.getDashboardOverview);
router.patch(
  '/content/:id/publish',
  requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(publishContentSchema),
  adminController.publishContent
);
// Bulk Seeder & Asset Upload Routes (SRS Section 12.8 & 12.9)
router.post('/seed/bulk', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), adminController.bulkSeedContent);
router.post('/assets', requireRole(...ALL_ADMIN_ROLES), uploadAsset.single('file'), adminController.uploadAssetFile);

// Admin Subject Routes
router.post('/subjects', requireRole(...ALL_ADMIN_ROLES), validate(createSubjectSchema), subjectController.createSubject);
router.put('/subjects/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateSubjectSchema), subjectController.updateSubject);
router.delete('/subjects/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), subjectController.deleteSubject);

// Admin Chapter Routes
router.post('/chapters', requireRole(...ALL_ADMIN_ROLES), validate(createChapterSchema), chapterController.createChapter);
router.put('/chapters/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateChapterSchema), chapterController.updateChapter);
router.delete('/chapters/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), chapterController.deleteChapter);

// Admin Topic Routes
router.post('/topics', requireRole(...ALL_ADMIN_ROLES), validate(createTopicSchema), topicController.createTopic);
router.put('/topics/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateTopicSchema), topicController.updateTopic);
router.delete('/topics/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), topicController.deleteTopic);

// Admin Lesson Routes
router.post('/lessons', requireRole(...ALL_ADMIN_ROLES), validate(createLessonSchema), lessonController.createLesson);
router.put('/lessons/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateLessonSchema), lessonController.updateLesson);

// Admin Formula Routes
router.post('/formulas', requireRole(...ALL_ADMIN_ROLES), validate(createFormulaSchema), formulaController.createFormula);
router.put('/formulas/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateFormulaSchema), formulaController.updateFormula);

// Admin Interactive Content Routes
router.post('/animations', requireRole(...ALL_ADMIN_ROLES), validate(createAnimationSchema), animationController.createAnimation);
router.put('/animations/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateAnimationSchema), animationController.updateAnimation);

router.post('/models', requireRole(...ALL_ADMIN_ROLES), validate(createModel3DSchema), modelController.createModel3D);
router.put('/models/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateModel3DSchema), modelController.updateModel3D);

router.post('/labs', requireRole(...ALL_ADMIN_ROLES), validate(createLabSchema), labController.createLab);
router.put('/labs/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateLabSchema), labController.updateLab);

// Admin MCQ Routes
router.post('/mcq/bulk', requireRole(...ALL_ADMIN_ROLES), validate(bulkCreateQuestionSchema), quizController.createBulkMcq);
router.put('/mcq/:id', requireRole(...ALL_ADMIN_ROLES), validate(updateQuestionSchema), quizController.updateMcq);

export default router;
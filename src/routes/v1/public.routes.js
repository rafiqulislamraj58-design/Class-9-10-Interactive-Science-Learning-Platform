import { Router } from 'express';
import * as subjectController from '../../controllers/subject.controller.js';
import * as chapterController from '../../controllers/chapter.controller.js';
import * as topicController from '../../controllers/topic.controller.js';
import * as lessonController from '../../controllers/lesson.controller.js';
import * as formulaController from '../../controllers/formula.controller.js';
import * as animationController from '../../controllers/animation.controller.js';
import * as modelController from '../../controllers/model.controller.js';
import * as labController from '../../controllers/lab.controller.js';

const router = Router();

// Subject Routes
router.get('/subjects', subjectController.getSubjects);
router.get('/subjects/:id', subjectController.getSubjectDetails);

// Chapter Routes
router.get('/chapters', chapterController.getChapters);
router.get('/chapters/:slug', chapterController.getChapterDetails);
router.get('/chapters/:slug/topics', topicController.getChapterTopics);

// Topic & Lesson Routes
router.get('/topics/:id', topicController.getTopicDetails);
router.get('/topics/:id/lessons', lessonController.getTopicLessons);

// Interactive & Formula Routes
router.get('/formulas/:id', formulaController.getFormulaDetails);
router.get('/animations/:id', animationController.getAnimationDetails);
router.get('/models/:id', modelController.getModel3DDetails);
router.get('/labs/:id', labController.getLabDetails);

// Global Search Route
router.get('/search', labController.searchContent);

export default router;
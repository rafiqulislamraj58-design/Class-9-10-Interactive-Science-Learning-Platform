import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Topic } from '../models/Topic.js';
import { Lesson } from '../models/Lesson.js';
import { Formula } from '../models/Formula.js';
import { Animation } from '../models/Animation.js';
import { Model3D } from '../models/Model3D.js';
import { Lab } from '../models/Lab.js';
import { Question } from '../models/Question.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { DailyModelTest } from '../models/DailyModelTest.js';
import { generateSlug } from '../utils/generateSlug.js';

export const runBulkSeed = async (payload = {}) => {
  // যদি শুরু থেকে ক্লিন ডাটাবেসে সিড করতে চান (clearExisting: true)
  if (payload.clearExisting === true) {
    await Promise.all([
      Subject.deleteMany({}),
      Chapter.deleteMany({}),
      Topic.deleteMany({}),
      Lesson.deleteMany({}),
      Formula.deleteMany({}),
      Animation.deleteMany({}),
      Model3D.deleteMany({}),
      Lab.deleteMany({}),
      Question.deleteMany({}),
      QuizAttempt.deleteMany({}),
      DailyModelTest.deleteMany({}),
    ]);
  }

  const summary = {
    subjects: { upserted: 0, errors: [] },
    chapters: { upserted: 0, errors: [] },
    topics: { upserted: 0, errors: [] },
    formulas: { upserted: 0, errors: [] },
    animations: { upserted: 0, errors: [] },
    models: { upserted: 0, errors: [] },
    labs: { upserted: 0, errors: [] },
    lessons: { upserted: 0, errors: [] },
    questions: { upserted: 0, errors: [] },
  };

  // 1. Seed Subjects
  if (Array.isArray(payload.subjects)) {
    for (const item of payload.subjects) {
      try {
        await Subject.findOneAndUpdate(
          { name: item.name.toLowerCase() },
          { $set: item },
          { upsert: true, new: true, runValidators: true }
        );
        summary.subjects.upserted++;
      } catch (err) {
        summary.subjects.errors.push({ item: item.name, message: err.message });
      }
    }
  }

  // 2. Seed Chapters (Supports subjectName or subjectId)
  if (Array.isArray(payload.chapters)) {
    for (const item of payload.chapters) {
      try {
        let subjectId = item.subjectId;
        if (!subjectId && item.subjectName) {
          const sub = await Subject.findOne({ name: item.subjectName.toLowerCase() }).lean();
          if (!sub) throw new Error(`Parent subject '${item.subjectName}' not found`);
          subjectId = sub._id;
        }
        const slug = item.slug ? generateSlug(item.slug) : generateSlug(item.titleEn);

        await Chapter.findOneAndUpdate(
          { subjectId, slug },
          { $set: { ...item, subjectId, slug } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.chapters.upserted++;
      } catch (err) {
        summary.chapters.errors.push({ item: item.titleEn || item.title, message: err.message });
      }
    }
  }

  // 3. Seed Topics (Supports chapterSlug or chapterId)
  if (Array.isArray(payload.topics)) {
    for (const item of payload.topics) {
      try {
        let chapter = null;
        if (item.chapterId) {
          chapter = await Chapter.findById(item.chapterId).lean();
        } else if (item.chapterSlug) {
          chapter = await Chapter.findOne({ slug: item.chapterSlug.toLowerCase() }).lean();
        }
        if (!chapter) throw new Error(`Parent chapter '${item.chapterSlug}' not found`);

        const slug = item.slug ? generateSlug(payloadSlugOrTitle(item)) : generateSlug(item.titleEn);
        const topicId = item.topicId ? generateSlug(item.topicId) : `${chapter.slug}-${slug}`;

        await Topic.findOneAndUpdate(
          { topicId },
          { $set: { ...item, chapterId: chapter._id, slug, topicId } },
          { upsert: true, new: true, runValidators: true }
        );

        const count = await Topic.countDocuments({ chapterId: chapter._id, isPublished: true });
        await Chapter.findByIdAndUpdate(chapter._id, { topicCount: count });

        summary.topics.upserted++;
      } catch (err) {
        summary.topics.errors.push({ item: item.title, message: err.message });
      }
    }
  }

  // 4. Seed Formulas (Supports subjectName & topicKey/topicId)
  if (Array.isArray(payload.formulas)) {
    for (const item of payload.formulas) {
      try {
        let subjectId = item.subjectId;
        if (!subjectId && item.subjectName) {
          const sub = await Subject.findOne({ name: item.subjectName.toLowerCase() }).lean();
          if (sub) subjectId = sub._id;
        }

        let topicId = item.topicId;
        if (topicId && !/^[0-9a-fA-F]{24}$/.test(topicId)) {
          const top = await Topic.findOne({ topicId: topicId.toLowerCase() }).lean();
          if (top) topicId = top._id;
        } else if (!topicId && item.topicKey) {
          const top = await Topic.findOne({ topicId: item.topicKey.toLowerCase() }).lean();
          if (top) topicId = top._id;
        }

        const formulaId = generateSlug(item.formulaId);
        await Formula.findOneAndUpdate(
          { formulaId },
          { $set: { ...item, formulaId, subjectId, topicId } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.formulas.upserted++;
      } catch (err) {
        summary.formulas.errors.push({ item: item.formulaId, message: err.message });
      }
    }
  }

  // 5. Seed Animations
  if (Array.isArray(payload.animations)) {
    for (const item of payload.animations) {
      try {
        const animationId = generateSlug(item.animationId);
        await Animation.findOneAndUpdate(
          { animationId },
          { $set: { ...item, animationId } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.animations.upserted++;
      } catch (err) {
        summary.animations.errors.push({ item: item.animationId, message: err.message });
      }
    }
  }

  // 6. Seed 3D Models
  if (Array.isArray(payload.models)) {
    for (const item of payload.models) {
      try {
        const modelId = generateSlug(item.modelId);
        await Model3D.findOneAndUpdate(
          { modelId },
          { $set: { ...item, modelId } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.models.upserted++;
      } catch (err) {
        summary.models.errors.push({ item: item.modelId, message: err.message });
      }
    }
  }

  // 7. Seed Virtual Labs
  if (Array.isArray(payload.labs)) {
    for (const item of payload.labs) {
      try {
        const labId = generateSlug(item.labId);
        await Lab.findOneAndUpdate(
          { labId },
          { $set: { ...item, labId } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.labs.upserted++;
      } catch (err) {
        summary.labs.errors.push({ item: item.labId, message: err.message });
      }
    }
  }

  // 8. Seed Lessons (Supports chapterSlug & topicKey)
  if (Array.isArray(payload.lessons)) {
    for (const item of payload.lessons) {
      try {
        let chapterId = item.chapterId;
        if (!chapterId && item.chapterSlug) {
          const ch = await Chapter.findOne({ slug: item.chapterSlug.toLowerCase() }).lean();
          if (ch) chapterId = ch._id;
        }

        let topicId = item.topicId;
        if (topicId && !/^[0-9a-fA-F]{24}$/.test(topicId)) {
          const top = await Topic.findOne({ topicId: topicId.toLowerCase() }).lean();
          if (top) topicId = top._id;
        } else if (!topicId && item.topicKey) {
          const top = await Topic.findOne({ topicId: item.topicKey.toLowerCase() }).lean();
          if (top) topicId = top._id;
        }

        await Lesson.findOneAndUpdate(
          { chapterId, topicId, title: item.title },
          { $set: { ...item, chapterId, topicId } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.lessons.upserted++;
      } catch (err) {
        summary.lessons.errors.push({ item: item.title, message: err.message });
      }
    }
  }

  // 9. Seed Questions (Supports subjectName, chapterSlug & topicKey)
  if (Array.isArray(payload.questions)) {
    for (const item of payload.questions) {
      try {
        let subjectId = item.subjectId;
        if (!subjectId && item.subjectName) {
          const sub = await Subject.findOne({ name: item.subjectName.toLowerCase() }).lean();
          if (sub) subjectId = sub._id;
        }

        let chapterId = item.chapterId;
        if (!chapterId && item.chapterSlug) {
          const ch = await Chapter.findOne({ slug: item.chapterSlug.toLowerCase() }).lean();
          if (ch) chapterId = ch._id;
        }

        let topicId = item.topicId;
        if (topicId && !/^[0-9a-fA-F]{24}$/.test(topicId)) {
          const top = await Topic.findOne({ topicId: topicId.toLowerCase() }).lean();
          if (top) topicId = top._id;
        } else if (!topicId && item.topicKey) {
          const top = await Topic.findOne({ topicId: item.topicKey.toLowerCase() }).lean();
          if (top) topicId = top._id;
        }

        await Question.findOneAndUpdate(
          { chapterId, question: item.question.trim() },
          { $set: { ...item, subjectId, chapterId, topicId } },
          { upsert: true, new: true, runValidators: true }
        );
        summary.questions.upserted++;
      } catch (err) {
        summary.questions.errors.push({ item: item.question, message: err.message });
      }
    }
  }

  return summary;
};

function payloadSlugOrTitle(item) {
  return item.slug || item.titleEn;
}
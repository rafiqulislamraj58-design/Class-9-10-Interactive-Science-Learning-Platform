import crypto from 'crypto';
import mongoose from 'mongoose';
import { Question } from '../models/Question.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Chapter } from '../models/Chapter.js';
import { Topic } from '../models/Topic.js';
import { Subject } from '../models/Subject.js';

// --- ADMIN: Create & Update Questions ---
export const createBulkQuestions = async (questionsArray) => {
  const inserted = await Question.insertMany(questionsArray);
  return {
    insertedCount: inserted.length,
    questions: inserted,
  };
};

export const updateQuestionById = async (id, payload) => {
  const question = await Question.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!question) {
    const error = new Error('Question not found');
    error.statusCode = 404;
    throw error;
  }
  return question;
};

// --- PUBLIC: Get Chapter Questions (Without Answer!) ---
export const getPublicQuestionsByChapter = async (chapterIdentifier, filters = {}) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(chapterIdentifier);
  const chapter = await Chapter.findOne(
    isObjectId ? { _id: chapterIdentifier } : { slug: chapterIdentifier.toLowerCase() }
  ).lean();

  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  const query = { chapterId: chapter._id, isPublished: true };
  if (filters.topicId) query.topicId = filters.topicId;
  if (filters.difficulty) query.difficulty = filters.difficulty;

  // SRS Section 8.3: Never expose correctIndex or explanation in Question Delivery!
  return await Question.find(query)
    .select('-correctIndex -explanation -__v')
    .populate('topicId', 'title titleEn topicId slug')
    .lean();
};

// --- PUBLIC: Start Quiz Attempt ---
export const startQuizAttempt = async ({
  chapterId,
  mode = 'quick',
  limit = 10,
  topicId,
  difficulty,
  anonymousDeviceId = 'guest-device',
}) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(chapterId);
  const chapter = await Chapter.findOne(
    isObjectId ? { _id: chapterId } : { slug: chapterId.toLowerCase() }
  ).lean();

  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  const matchQuery = {
    chapterId: new mongoose.Types.ObjectId(chapter._id),
    isPublished: true,
  };

  if (topicId) matchQuery.topicId = new mongoose.Types.ObjectId(topicId);
  if (difficulty) matchQuery.difficulty = difficulty;

  let questions = [];

  if (mode === 'full') {
    questions = await Question.find(matchQuery)
      .select('-correctIndex -explanation -__v')
      .lean();
  } else {
    const sampleSize = mode === 'quick' ? 10 : Number(limit) || 10;
    questions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: sampleSize } },
      {
        $project: {
          correctIndex: 0,
          explanation: 0,
          __v: 0,
        },
      },
    ]);
  }

  if (!questions.length) {
    const error = new Error('No published questions found for this chapter/filter');
    error.statusCode = 404;
    throw error;
  }

  const attemptId = `qz_${crypto.randomBytes(8).toString('hex')}`;

  await QuizAttempt.create({
    attemptId,
    anonymousDeviceId,
    chapterId: chapter._id,
    mode,
    questionIds: questions.map((q) => q._id),
    totalQuestions: questions.length,
    status: 'started',
  });

  return {
    attemptId,
    mode,
    chapter: {
      _id: chapter._id,
      title: chapter.title,
      slug: chapter.slug,
    },
    totalQuestions: questions.length,
    questions,
  };
};

// --- PUBLIC: Submit Quiz & Evaluate ---
export const submitQuizAttempt = async ({
  attemptId,
  anonymousDeviceId,
  timeTaken = 0,
  answers = [],
}) => {
  const attempt = await QuizAttempt.findOne({ attemptId });

  if (!attempt) {
    const error = new Error('Quiz attempt not found');
    error.statusCode = 404;
    throw error;
  }

  // SRS Section 8.5: Prevent duplicate submission
  if (attempt.status === 'submitted') {
    const error = new Error('This quiz attempt has already been submitted');
    error.statusCode = 400;
    throw error;
  }

  const dbQuestions = await Question.find({ _id: { $in: attempt.questionIds } })
    .populate('topicId', 'title titleEn topicId slug')
    .lean();

  const answerMap = new Map();
  answers.forEach((ans) => {
    answerMap.set(ans.questionId.toString(), ans.selectedIndex);
  });

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unanswered = 0;

  const topicStatsMap = new Map();
  const detailedResults = [];

  for (const q of dbQuestions) {
    const qIdStr = q._id.toString();
    const selectedIndex = answerMap.has(qIdStr) ? answerMap.get(qIdStr) : null;
    const isUnanswered = selectedIndex === null || selectedIndex === undefined;
    const isCorrect = !isUnanswered && selectedIndex === q.correctIndex;

    if (isUnanswered) {
      unanswered++;
    } else if (isCorrect) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }

    // Topic-wise performance tracking (SRS Section 9.3)
    const tIdStr = q.topicId?._id ? q.topicId._id.toString() : q.topicId.toString();
    const tTitle = q.topicId?.title || 'General';

    if (!topicStatsMap.has(tIdStr)) {
      topicStatsMap.set(tIdStr, {
        topicId: q.topicId?._id || q.topicId,
        topicTitle: tTitle,
        total: 0,
        correct: 0,
        wrong: 0,
      });
    }

    const tStat = topicStatsMap.get(tIdStr);
    tStat.total += 1;
    if (isCorrect) tStat.correct += 1;
    else tStat.wrong += 1;

    detailedResults.push({
      questionId: q._id,
      question: q.question,
      options: q.options,
      selectedIndex: isUnanswered ? null : selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
      topic: q.topicId
        ? { _id: q.topicId._id, title: q.topicId.title, slug: q.topicId.slug }
        : null,
    });
  }

  const totalQuestions = dbQuestions.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const topicPerformance = Array.from(topicStatsMap.values()).map((stat) => {
    const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    return {
      ...stat,
      accuracy,
      isWeak: accuracy < 60, // Mark weak if accuracy is below 60%
    };
  });

  const weakTopics = topicPerformance.filter((t) => t.isWeak);

  attempt.correctAnswers = correctAnswers;
  attempt.wrongAnswers = wrongAnswers;
  attempt.unanswered = unanswered;
  attempt.score = score;
  attempt.timeTaken = timeTaken;
  attempt.status = 'submitted';
  attempt.topicPerformance = topicPerformance;
  attempt.detailedResults = detailedResults;
  attempt.submittedAt = new Date();
  if (anonymousDeviceId) attempt.anonymousDeviceId = anonymousDeviceId;

  await attempt.save();

  return {
    attemptId: attempt.attemptId,
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unanswered,
    timeTaken,
    weakTopics,
    topicPerformance,
    results: detailedResults,
    submittedAt: attempt.submittedAt,
  };
};

// --- PUBLIC: Get Quiz Result by attemptId ---
export const getQuizResultByAttemptId = async (attemptId) => {
  const attempt = await QuizAttempt.findOne({ attemptId })
    .populate('chapterId', 'title titleEn slug chapterNumber')
    .lean();

  if (!attempt) {
    const error = new Error('Quiz result not found');
    error.statusCode = 404;
    throw error;
  }

  if (attempt.status !== 'submitted') {
    const error = new Error('Quiz attempt has not been submitted yet');
    error.statusCode = 400;
    throw error;
  }

  return {
    attemptId: attempt.attemptId,
    chapter: attempt.chapterId,
    mode: attempt.mode,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    wrongAnswers: attempt.wrongAnswers,
    unanswered: attempt.unanswered,
    timeTaken: attempt.timeTaken,
    weakTopics: attempt.topicPerformance.filter((t) => t.isWeak),
    topicPerformance: attempt.topicPerformance,
    results: attempt.detailedResults,
    submittedAt: attempt.submittedAt,
  };
};
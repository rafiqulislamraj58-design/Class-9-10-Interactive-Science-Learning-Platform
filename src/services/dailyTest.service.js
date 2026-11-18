import { DailyModelTest } from '../models/DailyModelTest.js';
import { Subject } from '../models/Subject.js';
import { Question } from '../models/Question.js';

// Helper: Get current date string (YYYY-MM-DD) in Asia/Dhaka timezone
export const getDhakaDateString = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Generate Daily Test (Idempotent & Duplicate-safe)
export const generateDailyTestForDate = async (targetDateStr = getDhakaDateString()) => {
  const existing = await DailyModelTest.findOne({ dateString: targetDateStr }).lean();
  if (existing) {
    return existing;
  }

  // SRS Section 10.1 Target Distribution
  const targetCounts = {
    physics: 9,
    chemistry: 8,
    biology: 8,
  };

  const subjects = await Subject.find({
    name: { $in: ['physics', 'chemistry', 'biology'] },
  }).lean();

  const subjectMap = {};
  subjects.forEach((s) => {
    subjectMap[s.name] = s._id;
  });

  const selectedIds = [];
  const actualDistribution = { physics: 0, chemistry: 0, biology: 0 };

  for (const [subName, limit] of Object.entries(targetCounts)) {
    const subId = subjectMap[subName];
    if (!subId) continue;

    const sampled = await Question.aggregate([
      { $match: { subjectId: subId, isPublished: true } },
      { $sample: { size: limit } },
      { $project: { _id: 1 } },
    ]);

    sampled.forEach((q) => selectedIds.push(q._id));
    actualDistribution[subName] = sampled.length;
  }

  // Fallback: if any published questions exist in DB
  if (selectedIds.length === 0) {
    const fallbackQuestions = await Question.find({ isPublished: true }).limit(25).select('_id').lean();
    fallbackQuestions.forEach((q) => selectedIds.push(q._id));
  }

  if (selectedIds.length === 0) {
    const error = new Error('No published questions available to generate Daily Model Test');
    error.statusCode = 404;
    throw error;
  }

  // Upsert with $setOnInsert to prevent race-condition duplicates
  const dailyTest = await DailyModelTest.findOneAndUpdate(
    { dateString: targetDateStr },
    {
      $setOnInsert: {
        dateString: targetDateStr,
        title: `ডেইলি মডেল টেস্ট (${targetDateStr})`,
        questionIds: selectedIds,
        totalQuestions: selectedIds.length,
        subjectDistribution: actualDistribution,
        status: 'active',
      },
    },
    { upsert: true, new: true }
  ).lean();

  return dailyTest;
};

// GET /api/v1/daily-test (Today's test with auto-recovery if cron missed)
export const getTodayDailyTest = async () => {
  const todayStr = getDhakaDateString();
  let test = await DailyModelTest.findOne({ dateString: todayStr }).lean();

  if (!test) {
    test = await generateDailyTestForDate(todayStr);
  }

  return test;
};

// GET /api/v1/daily-test/:date
export const getDailyTestByDate = async (dateString) => {
  const test = await DailyModelTest.findOne({ dateString }).lean();
  if (!test) {
    const error = new Error(`No Daily Model Test found for date: ${dateString}`);
    error.statusCode = 404;
    throw error;
  }
  return test;
};

// POST /api/v1/daily-test/start (Delivers questions without correctIndex)
export const startDailyTest = async (dateString = getDhakaDateString()) => {
  const test = await getTodayDailyTest();
  const targetTest = dateString === test.dateString ? test : await getDailyTestByDate(dateString);

  const questions = await Question.find({ _id: { $in: targetTest.questionIds } })
    .select('-correctIndex -explanation -__v')
    .populate('subjectId', 'name nameBn nameEn')
    .populate('chapterId', 'title slug')
    .populate('topicId', 'title slug')
    .lean();

  return {
    dateString: targetTest.dateString,
    title: targetTest.title,
    totalQuestions: questions.length,
    subjectDistribution: targetTest.subjectDistribution,
    questions,
  };
};

// POST /api/v1/daily-test/submit (Evaluates answers & returns explanations)
export const submitDailyTest = async ({
  dateString = getDhakaDateString(),
  timeTaken = 0,
  answers = [],
}) => {
  const test = await DailyModelTest.findOne({ dateString }).lean();
  if (!test) {
    const error = new Error(`Daily Model Test not found for date: ${dateString}`);
    error.statusCode = 404;
    throw error;
  }

  const dbQuestions = await Question.find({ _id: { $in: test.questionIds } })
    .populate('subjectId', 'name nameBn')
    .populate('topicId', 'title slug')
    .lean();

  const answerMap = new Map();
  answers.forEach((ans) => {
    answerMap.set(ans.questionId.toString(), ans.selectedIndex);
  });

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unanswered = 0;
  const results = [];

  for (const q of dbQuestions) {
    const qIdStr = q._id.toString();
    const selectedIndex = answerMap.has(qIdStr) ? answerMap.get(qIdStr) : null;
    const isUnanswered = selectedIndex === null || selectedIndex === undefined;
    const isCorrect = !isUnanswered && selectedIndex === q.correctIndex;

    if (isUnanswered) unanswered++;
    else if (isCorrect) correctAnswers++;
    else wrongAnswers++;

    results.push({
      questionId: q._id,
      question: q.question,
      options: q.options,
      selectedIndex: isUnanswered ? null : selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
      subject: q.subjectId,
      topic: q.topicId,
    });
  }

  const totalQuestions = dbQuestions.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    dateString: test.dateString,
    title: test.title,
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unanswered,
    timeTaken,
    results,
    submittedAt: new Date(),
  };
};
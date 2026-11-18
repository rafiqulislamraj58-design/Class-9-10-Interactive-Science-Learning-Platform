import * as dailyTestService from '../services/dailyTest.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getTodayTest = asyncHandler(async (req, res) => {
  const data = await dailyTestService.getTodayDailyTest();
  return sendSuccess(res, {
    message: "Today's Daily Model Test metadata fetched successfully",
    data,
  });
});

export const getTestByDate = asyncHandler(async (req, res) => {
  const data = await dailyTestService.getDailyTestByDate(req.params.date);
  return sendSuccess(res, {
    message: 'Daily Model Test fetched successfully',
    data,
  });
});

export const startDailyTest = asyncHandler(async (req, res) => {
  const data = await dailyTestService.startDailyTest(req.body?.dateString);
  return sendSuccess(res, {
    message: 'Daily Model Test started (answers hidden)',
    data,
  });
});

export const submitDailyTest = asyncHandler(async (req, res) => {
  const data = await dailyTestService.submitDailyTest(req.body);
  return sendSuccess(res, {
    message: 'Daily Model Test evaluated successfully',
    data,
  });
});
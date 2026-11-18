import * as formulaService from '../services/formula.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createFormula = asyncHandler(async (req, res) => {
  const data = await formulaService.createFormula(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Formula created successfully',
    data,
  });
});

export const getFormulaDetails = asyncHandler(async (req, res) => {
  const data = await formulaService.getFormulaByIdOrKey(req.params.id);
  return sendSuccess(res, {
    message: 'Formula details fetched successfully',
    data,
  });
});

export const updateFormula = asyncHandler(async (req, res) => {
  const data = await formulaService.updateFormulaById(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'Formula updated successfully',
    data,
  });
});
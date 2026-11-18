import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  // Zod Validation Error (Supports both Zod v3 and v4)
  if (err instanceof ZodError || err.name === 'ZodError') {
    const rawErrors = err.issues || err.errors || [];
    const formattedErrors = rawErrors.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
      message: e.message,
    }));
    return sendError(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, {
      statusCode: 409,
      message: `Duplicate value for field: ${field}`,
      errors: [{ field, message: `${field} already exists` }],
    });
  }

  // Custom / Standard Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, {
    statusCode,
    message,
    errors: err.errors || [],
  });
};
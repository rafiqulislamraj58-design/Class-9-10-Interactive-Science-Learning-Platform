import { sendError } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return sendError(res, {
        statusCode: 403,
        message: 'Forbidden: You do not have permission to perform this action.',
      });
    }
    next();
  };
};
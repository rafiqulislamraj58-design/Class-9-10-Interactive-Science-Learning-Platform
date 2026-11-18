import { verifyAccessToken } from '../utils/token.js';
import { Admin } from '../models/Admin.js';
import { sendError } from '../utils/apiResponse.js';

export const adminAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, {
        statusCode: 401,
        message: 'Authentication required. Please log in as Admin.',
      });
    }

    const decoded = verifyAccessToken(token);
    const admin = await Admin.findById(decoded.id).lean();

    if (!admin || !admin.isActive) {
      return sendError(res, {
        statusCode: 401,
        message: 'Invalid or deactivated admin account.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return sendError(res, {
      statusCode: 401,
      message: 'Invalid or expired access token.',
    });
  }
};
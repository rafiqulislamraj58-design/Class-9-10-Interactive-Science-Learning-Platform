import { Admin } from '../models/Admin.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { ContentVersion } from '../models/ContentVersion.js';
import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Topic } from '../models/Topic.js';
import { Lesson } from '../models/Lesson.js';
import { Formula } from '../models/Formula.js';
import { Animation } from '../models/Animation.js';
import { Model3D } from '../models/Model3D.js';
import { Lab } from '../models/Lab.js';
import { Question } from '../models/Question.js';
import * as seederService from '../services/seeder.service.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
};

// POST /api/v1/admin/auth/login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin || !admin.isActive) {
    return sendError(res, { statusCode: 401, message: 'Invalid email or password' });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return sendError(res, { statusCode: 401, message: 'Invalid email or password' });
  }

  const tokenPayload = { id: admin._id, email: admin.email, role: admin.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await RefreshToken.create({
    adminId: admin._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  admin.lastLoginAt = new Date();
  await admin.save();

  await ActivityLog.create({
    adminId: admin._id,
    action: 'LOGIN',
    resourceType: 'auth',
    details: 'Admin logged in successfully',
  });

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return sendSuccess(res, {
    message: 'Admin login successful',
    data: {
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

// POST /api/v1/admin/auth/logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (refreshToken) {
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return sendSuccess(res, { message: 'Logged out successfully' });
});

// GET /api/v1/admin/auth/me
export const getAdminProfile = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    message: 'Admin profile fetched successfully',
    data: req.admin,
  });
});

// POST /api/v1/admin/auth/refresh
export const refreshAdminToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingToken) {
    return sendError(res, { statusCode: 401, message: 'Refresh token is required' });
  }

  const storedToken = await RefreshToken.findOne({ token: incomingToken, isRevoked: false });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    return sendError(res, { statusCode: 401, message: 'Invalid or expired refresh token' });
  }

  const decoded = verifyRefreshToken(incomingToken);
  const admin = await Admin.findById(decoded.id).lean();
  if (!admin || !admin.isActive) {
    return sendError(res, { statusCode: 401, message: 'Admin account not found or inactive' });
  }

  // Rotate Refresh Token (SRS Section 13.1)
  storedToken.isRevoked = true;
  await storedToken.save();

  const tokenPayload = { id: admin._id, email: admin.email, role: admin.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  await RefreshToken.create({
    adminId: admin._id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
  res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return sendSuccess(res, {
    message: 'Token refreshed successfully',
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  });
});

// GET /api/v1/admin/dashboard (SRS Section 13.2)
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [
    totalSubjects,
    totalChapters,
    totalTopics,
    totalLessons,
    totalFormulas,
    totalAnimations,
    totalModels,
    totalLabs,
    totalMcqs,
    draftLessons,
    publishedLessons,
    recentActivities,
  ] = await Promise.all([
    Subject.countDocuments(),
    Chapter.countDocuments(),
    Topic.countDocuments(),
    Lesson.countDocuments(),
    Formula.countDocuments(),
    Animation.countDocuments(),
    Model3D.countDocuments(),
    Lab.countDocuments(),
    Question.countDocuments(),
    Lesson.countDocuments({ status: 'draft' }),
    Lesson.countDocuments({ status: 'published' }),
    ActivityLog.find().populate('adminId', 'name email role').sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return sendSuccess(res, {
    message: 'Dashboard overview fetched successfully',
    data: {
      totalSubjects,
      totalChapters,
      totalTopics,
      totalLessons,
      totalFormulas,
      totalAnimations,
      totalModels,
      totalLabs,
      totalMcqs,
      draftContent: draftLessons,
      publishedContent: publishedLessons,
      recentActivities,
    },
  });
});

// PATCH /api/v1/admin/content/:id/publish (SRS Section 12.8 & 13.4)
export const publishContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resourceType, isPublished, status } = req.body;

  const modelMap = {
    subject: Subject,
    chapter: Chapter,
    topic: Topic,
    lesson: Lesson,
    formula: Formula,
    animation: Animation,
    model3d: Model3D,
    lab: Lab,
    question: Question,
  };

  const TargetModel = modelMap[resourceType];
  const updatePayload =
    resourceType === 'lesson' ? { status } : { isPublished };

  const updatedDoc = await TargetModel.findByIdAndUpdate(id, updatePayload, {
    new: true,
  }).lean();

  if (!updatedDoc) {
    return sendError(res, { statusCode: 404, message: `${resourceType} not found` });
  }

  await ContentVersion.create({
    resourceType,
    resourceId: updatedDoc._id,
    version: updatedDoc.version || 1,
    status: status || (isPublished ? 'published' : 'unpublished'),
    updatedBy: req.admin._id,
    changeNote: `Status updated by ${req.admin.email}`,
  });

  await ActivityLog.create({
    adminId: req.admin._id,
    action: 'PUBLISH_STATUS_CHANGE',
    resourceType,
    resourceId: id,
    details: `Changed publication status to ${status || isPublished}`,
  });

  return sendSuccess(res, {
    message: `${resourceType} publication status updated successfully`,
    data: updatedDoc,
  });
});
export const bulkSeedContent = asyncHandler(async (req, res) => {
  const summary = await seederService.runBulkSeed(req.body);

  await ActivityLog.create({
    adminId: req.admin._id,
    action: 'BULK_SEED',
    resourceType: 'curriculum',
    details: 'Executed bulk curriculum seeder',
  });

  return sendSuccess(res, {
    message: 'Bulk seed operation completed',
    data: summary,
  });
});

// POST /api/v1/admin/assets (SRS Section 12.8)
export const uploadAssetFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, { statusCode: 400, message: 'No asset file provided' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  await ActivityLog.create({
    adminId: req.admin._id,
    action: 'UPLOAD_ASSET',
    resourceType: 'asset',
    resourceId: req.file.filename,
    details: `Uploaded file ${req.file.originalname} (${req.file.size} bytes)`,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Asset uploaded successfully',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
    },
  });
});
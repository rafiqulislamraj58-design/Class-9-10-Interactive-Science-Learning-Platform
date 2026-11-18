import { Router } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  return sendSuccess(res, {
    message: 'API is healthy',
    data: {
      apiStatus: 'online',
      databaseStatus: dbStatus,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
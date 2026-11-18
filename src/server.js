import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import { initDailyTestCron } from './jobs/dailyTest.job.js';

const startServer = async () => {
  await connectDB();

  // Initialize Scheduled Jobs
  initDailyTestCron();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
    logger.info(`🩺 Health check available at http://localhost:${env.PORT}/api/v1/health`);
  });
};

startServer();
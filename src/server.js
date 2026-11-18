import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import { initDailyTestCron } from './jobs/dailyTest.job.js';
import { Admin } from './models/Admin.js';
import { ROLES } from './constants/roles.js';

const ensureSuperAdminExists = async () => {
  try {
    const email = process.env.ADMIN_EMAIL ;
    const password = process.env.ADMIN_PASSWORD ;

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Super Admin',
        email,
        password,
        role: ROLES.SUPER_ADMIN,
      });
      logger.info(`👑 Auto-created Super Admin account: ${email}`);
    }
  } catch (error) {
    logger.error(`❌ Failed to auto-create Super Admin: ${error.message}`);
  }
};

const startServer = async () => {
  await connectDB();
  await ensureSuperAdminExists();

  // Initialize Scheduled Jobs
  initDailyTestCron();
  app.get('/', (req, res) => res.json({ message: 'NCTB Science Platform API is running!' }));

  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`🩺 Health check available at /api/v1/health`);
  });
};

startServer();
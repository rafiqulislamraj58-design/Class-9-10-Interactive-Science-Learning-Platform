import cron from 'node-cron';
import { generateDailyTestForDate, getDhakaDateString } from '../services/dailyTest.service.js';
import { logger } from '../config/logger.js';

export const initDailyTestCron = () => {
  // Runs every day at 00:00 (Midnight) Bangladesh Standard Time
  cron.schedule(
    '0 0 * * *',
    async () => {
      const todayStr = getDhakaDateString();
      logger.info(`⏰ Running Daily Model Test Generator for ${todayStr}...`);
      try {
        await generateDailyTestForDate(todayStr);
        logger.info(`✅ Daily Model Test generated for ${todayStr}`);
      } catch (error) {
        logger.error(`❌ Daily Test Cron Error: ${error.message}`);
      }
    },
    {
      timezone: 'Asia/Dhaka',
    }
  );

  logger.info('📅 Daily Model Test Cron Scheduler initialized (Timezone: Asia/Dhaka)');
};
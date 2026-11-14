import cron from 'node-cron';
import { runScheduledPosts } from './facebookPostService.js';

/**
 * Khởi động cron job tự động đăng bài Facebook
 * Chạy mỗi 5 phút để check và đăng các bài đã đến giờ
 */
export const startFacebookScheduler = () => {
  // Chạy mỗi 5 phút: '*/5 * * * *'
  cron.schedule('*/5 * * * *', async () => {
    try {
      await runScheduledPosts();
    } catch (err) {
      console.error('[CronService] Lỗi không mong muốn trong FB scheduler:', err.message);
    }
  });

  console.log('[CronService] ✅ Facebook Auto-Scheduler đã khởi động (mỗi 5 phút)');
};

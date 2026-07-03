import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import scraperService from './services/scraperService.js';

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║     🔮 TuVi API Server             ║
  ║     Port: ${PORT}                      ║
  ║     Env: ${(process.env.NODE_ENV || 'development').padEnd(24)}║
  ╚══════════════════════════════════════╝
  `);

  // Start background crawl job after server starts (only in non-test env)
  if (process.env.NODE_ENV !== 'test') {
    // Run once on startup (after 5 seconds to not block startup time)
    setTimeout(async () => {
      try {
        console.log('⏰ [Background Job] Bắt đầu tự động cào bài viết diễn đàn & Facebook...');
        const res = await scraperService.runCrawl();
        console.log(`⏰ [Background Job] Hoàn tất cào bài viết! Đã lưu mới: ${res.savedToDb}`);
      } catch (err) {
        console.error('⏰ [Background Job] Lỗi chạy tự động cào bài viết:', err.message);
      }
    }, 5000);

    // Run periodically every 30 minutes
    const CRAWL_INTERVAL = 30 * 60 * 1000; // 30 mins
    setInterval(async () => {
      try {
        console.log('⏰ [Background Job] Đang cào định kỳ bài viết...');
        const res = await scraperService.runCrawl();
        console.log(`⏰ [Background Job] Hoàn tất cào bài viết! Đã lưu mới: ${res.savedToDb}`);
      } catch (err) {
        console.error('⏰ [Background Job] Lỗi chạy định kỳ cào bài viết:', err.message);
      }
    }, CRAWL_INTERVAL);
  }
});

import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

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
});

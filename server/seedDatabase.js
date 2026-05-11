import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import TuViDatabase from './models/TuViDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await TuViDatabase.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu TuViDatabase cũ.');

    // Read JSON file
    const jsonPath = path.join(__dirname, 'tuvi_database.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    // Chuẩn hóa dữ liệu nếu cần (ví dụ: đổi luận_giải thành luan_giai để khớp model)
    if (data.con_giap) {
      data.con_giap = data.con_giap.map(item => {
        if (item.su_nghiep && item.su_nghiep.luận_giải) {
          item.su_nghiep.luan_giai = item.su_nghiep.luận_giải;
          delete item.su_nghiep.luận_giải;
        }
        if (item.tinh_cam && item.tinh_cam.luận_giải) {
          item.tinh_cam.luan_giai = item.tinh_cam.luận_giải;
          delete item.tinh_cam.luận_giải;
        }
        if (item.van_han_theo_thang) {
          item.van_han_theo_thang = item.van_han_theo_thang.map(th => {
            if (th.luận) {
              th.luan = th.luận;
              delete th.luận;
            }
            return th;
          });
        }
        return item;
      });
    }

    // Insert data
    await TuViDatabase.create(data);
    console.log('✅  Đã nhập dữ liệu TuViDatabase mới thành công!');

    process.exit(0);
  } catch (error) {
    console.error('❌  Lỗi khi nhập dữ liệu:', error.message);
    process.exit(1);
  }
};

seedDatabase();

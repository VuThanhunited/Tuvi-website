import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding...');

    const adminEmail = 'admin@tuvi.vn';
    const adminPassword = 'admin123456';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists.');
      // Cập nhật role cho chắc chắn
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin role confirmed for:', adminEmail);
    } else {
      await User.create({
        hoTen: 'Quản trị viên',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '0900000000',
        gioiTinh: 'nam'
      });
      console.log('🚀 Admin user created successfully!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

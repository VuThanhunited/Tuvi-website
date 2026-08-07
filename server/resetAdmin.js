import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected...');

    const adminEmail = 'admin@tuvi.vn';
    const newPassword = 'admin123456';

    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      // Tạo mới nếu chưa có
      admin = await User.create({
        hoTen: 'Quản trị viên',
        email: adminEmail,
        password: newPassword,
        role: 'admin',
        phone: '0900000000',
        gioiTinh: 'nam',
        isActive: true,
      });
      console.log('🚀 Admin user CREATED successfully!');
    } else {
      // Force reset password và role
      admin.password = newPassword; // sẽ được hash bởi pre-save hook
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save(); // triggers pre-save → bcrypt hash
      console.log('🔑 Admin password RESET successfully!');
    }

    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', newPassword);
    console.log('👑 Role: admin');
    console.log('✅ Active: true');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdmin();

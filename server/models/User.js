import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Họ tên tối đa 100 ký tự'],
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
    select: false, // Don't return password by default
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'master'],
    default: 'user',
  },
  credits: {
    type: Number,
    default: 3, // 3 free chatbot credits for new users
  },
  totalCreditsUsed: {
    type: Number,
    default: 0,
  },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium', 'unlimited'], default: 'free' },
    expiresAt: { type: Date, default: null },
  },
  ngaySinh: {
    type: String,
  },
  gioiTinh: {
    type: String,
    enum: ['nam', 'nu'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// ── Indexes ──
// Note: email index created automatically by unique:true above
userSchema.index({ role: 1 }); // For filtering by role
userSchema.index({ createdAt: -1 }); // For sorting new users

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;

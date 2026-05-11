import mongoose from 'mongoose';

const cungResultSchema = new mongoose.Schema({
  name: String,
  icon: String,
  rating: { type: Number, min: 1, max: 5 },
  label: String,
  labelColor: String,
  interpretation: String,
}, { _id: false });

const tuViResultSchema = new mongoose.Schema({
  // Owner
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  // Personal Info
  hoTen: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
  },
  gioiTinh: {
    type: String,
    enum: ['nam', 'nu'],
    required: [true, 'Giới tính là bắt buộc'],
  },
  ngaySinh: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
  },
  thangSinh: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  namSinh: {
    type: Number,
    required: true,
    min: 1920,
    max: 2030,
  },
  gioSinh: {
    type: String,
    required: [true, 'Giờ sinh là bắt buộc'],
  },
  isLunar: {
    type: Boolean,
    default: false,
  },
  namXem: {
    type: Number,
  },
  thangXem: {
    type: Number,
  },

  // Calculated Results
  canChi: String,
  thienCan: String,
  diaChi: String,
  conGiap: {
    name: String,
    emoji: String,
    index: Number,
  },
  napAm: String,
  nguHanh: String,
  nguHanhColor: String,
  cuc: {
    name: String,
    value: Number,
  },
  gioChiName: String,

  // 12 Cung Results
  cungResults: [cungResultSchema],

  // Advice
  advice: [String],

  // Overall Rating
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
  },

  // Metadata
  viewCount: {
    type: Number,
    default: 1,
  },
  // Detailed Analysis from Database
  detailedAnalysis: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// ── Indexes ──
tuViResultSchema.index({ userId: 1, createdAt: -1 }); // For user history
tuViResultSchema.index({ hoTen: 'text' }); // For text search
tuViResultSchema.index({ namSinh: 1, thangSinh: 1, ngaySinh: 1 }); // For birth date queries
tuViResultSchema.index({ createdAt: -1 }); // For sorting by date

const TuViResult = mongoose.model('TuViResult', tuViResultSchema);

export default TuViResult;

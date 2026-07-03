import mongoose from 'mongoose';

// Schema cho mỗi sao (chính hoặc phụ)
const saoSchema = new mongoose.Schema({
  ten: String,        // Tên sao
  trangThai: String,  // M/V/Đ/B/H
  mau: String,        // 'do' | 'xam' | 'ham'
  loai: String,       // 'chinh' | 'phu' | 'sat' | 'loc' | 'hoa-loc' | 'hoa-ky' | ...
  amDuong: String,    // '+' | '-'
}, { _id: false });

// Schema cho Hóa tinh
const hoaTinhSchema = new mongoose.Schema({
  ten: String,  // 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ'
  cung: String, // Tên cung chứa sao này
  loai: String, // 'hoa-loc' | 'hoa-quyen' | 'hoa-khoa' | 'hoa-ky'
}, { _id: false });

// Schema cho từng cung trong lá số
const cungResultSchema = new mongoose.Schema({
  gridIdx: Number,      // Vị trí trong lưới 4x4 (0-11)
  name: String,         // Tên cung (Mệnh, Phụ Mẫu, ...)
  icon: String,
  daiHan: Number,       // Đại hạn (tuổi)
  thangHan: Number,     // Tháng tiểu hạn
  canChi: String,       // VD: "M.Dần"
  hanhDisplay: String,  // VD: "+Mộc"
  hanhColor: String,    // Màu hex của ngũ hành
  hanhDC: String,       // Tên ngũ hành: Kim/Mộc/Thủy/Hỏa/Thổ
  isMenh: Boolean,
  isMinh: Boolean,      // Cung Thân
  saoChinhList: [saoSchema],  // Sao chính trong cung
  saoPhuList: [saoSchema],    // Sao phụ trong cung
  hoaTinhList: [hoaTinhSchema], // Hóa tinh (của năm sinh)
  namXemHoaTinh: [hoaTinhSchema], // Hóa tinh của năm xem
  rating: Number,
  label: String,
  labelColor: String,
  interpretation: String,
  dvLabel: { type: String, default: '' },
  lnLabel: { type: String, default: '' },
}, { _id: false });

// Schema chính của lá số
const tuViResultSchema = new mongoose.Schema({
  // Owner
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },

  // Thông tin cá nhân
  hoTen: { type: String, required: true, trim: true },
  gioiTinh: { type: String, enum: ['nam', 'nu'], required: true },
  ngaySinh: { type: Number, required: true, min: 1, max: 31 },
  thangSinh: { type: Number, required: true, min: 1, max: 12 },
  namSinh: { type: Number, required: true, min: 1920, max: 2030 },
  gioSinh: { type: String, required: true },
  isLunar: { type: Boolean, default: false },
  namXem: Number,
  thangXem: Number,
  lunarDay: Number,
  lunarMonth: Number,
  menhCucRelation: String,

  // Can Chi & Nạp Âm
  canChi: String,
  thienCan: String,
  diaChi: String,
  tcIdx: Number,
  dcIdx: Number,
  conGiap: { name: String, emoji: String, index: Number },
  napAm: String,
  nguHanh: String,
  nguHanhColor: String,
  cuc: { name: String, value: Number },
  gioChiName: String,
  gioHour: String,

  // Thông tin tổng hợp
  amDuong: String,           // 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ'
  namXemCanChi: String,      // VD: "Bính Ngọ (2026)"
  tuoi: Number,              // Tuổi trong năm xem
  chuMenh: String,           // Sao chủ mệnh
  chuThan: String,           // Sao chủ thân
  laiNhanCung: String,       // Lai nhân cung
  canXuong: String,          // VD: "4 lượng 9 chỉ"
  tenCungThan: String,       // Tên cung Thân
  cungMenhDCIdx: Number,     // Index địa chi của cung Mệnh
  cungMenhGridIdx: Number,   // Grid index của cung Mệnh

  // 12 Cung
  cungResults: [cungResultSchema],

  // Advice & Rating
  advice: [String],
  overallRating: { type: Number, min: 1, max: 5 },

  // Metadata
  viewCount: { type: Number, default: 1 },

  // Phân tích chi tiết từ Database
  detailedAnalysis: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
});

// ── Indexes ──
tuViResultSchema.index({ userId: 1, createdAt: -1 });
tuViResultSchema.index({ hoTen: 'text' });
tuViResultSchema.index({ namSinh: 1, thangSinh: 1, ngaySinh: 1 });
tuViResultSchema.index({ createdAt: -1 });

const TuViResult = mongoose.model('TuViResult', tuViResultSchema);
export default TuViResult;

import mongoose from 'mongoose';

const conGiapSchema = new mongoose.Schema({
  id: Number,
  ten: String,
  chi: String,
  sao_chinh: String,
  sao_phu: [String],
  ngay_bat_dau: String,
  ngay_ket_thuc: String,
  sac_thai: {
    nam: String,
    nu: String
  },
  tinh_cach: String,
  diem_manh: [String],
  diem_yeu: [String],
  su_nghiep: {
    phu_hop: [String],
    luan_giai: String
  },
  tinh_cam: {
    dac_diem: String,
    luan_giai: String
  },
  suc_khoe: String,
  tai_loc: String,
  nam_tot: [Number],
  thang_tot: [Number],
  so_may_man: [Number],
  mau_may_man: [String],
  van_han_nam_2026: {
    tong_quan: String,
    tien_tai: String,
    tinh_cam: String,
    su_nghiep: String,
    suc_khoe: String,
    phuong_huong: String
  },
  van_han_theo_thang: [
    {
      thang: Number,
      luan: String,
      tien_tai: String,
      su_nghiep: String,
      tinh_cam: String
    }
  ]
});

const saoChinhSchema = new mongoose.Schema({
  ten: String,
  am_duong: String,
  mo_ta: String,
  dac_diem: String,
  anh_huong: String
});

const tuViDatabaseSchema = new mongoose.Schema({
  metadata: {
    name: String,
    description: String,
    version: String,
    updated: String,
    language: String
  },
  con_giap: [conGiapSchema],
  sao_chinh_chi_tiet: {
    type: Map,
    of: saoChinhSchema
  },
  van_han_hang_nam: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const TuViDatabase = mongoose.model('TuViDatabase', tuViDatabaseSchema);
export default TuViDatabase;

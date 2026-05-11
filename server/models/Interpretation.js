import mongoose from 'mongoose';

const interpretationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Vui lòng chọn loại luận giải'],
    enum: ['sao_cung', 'cung', 'sao', 'cach_cuc', 'tu_hoa', 'dai_han', 'tieu_han', 'khac'],
    description: 'Loại luận giải (ví dụ: Sao đóng tại cung, Ý nghĩa cung cơ bản, Cách cục...)'
  },
  sao: {
    type: String,
    trim: true,
    default: '',
    description: 'Tên sao (nếu là luận giải sao)'
  },
  cung: {
    type: String,
    trim: true,
    default: '',
    description: 'Tên cung (ví dụ: Mệnh, Phụ Mẫu...)'
  },
  trangThai: {
    type: String,
    enum: ['M', 'V', 'Đ', 'B', 'H', ''],
    default: '',
    description: 'Trạng thái sao (Miếu, Vượng, Đắc, Bình, Hãm)'
  },
  tenCachCuc: {
    type: String,
    trim: true,
    default: '',
    description: 'Tên cách cục (nếu type là cach_cuc)'
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung luận giải'],
  },
  source: {
    type: String,
    trim: true,
    default: '',
    description: 'Nguồn sách/tác giả (ví dụ: Trung Châu tử vi đẩu số)'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create compound indexes for faster engine lookup later
interpretationSchema.index({ type: 1, sao: 1, cung: 1 });
interpretationSchema.index({ type: 1, tenCachCuc: 1 });

const Interpretation = mongoose.model('Interpretation', interpretationSchema);
export default Interpretation;

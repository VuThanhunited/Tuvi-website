import mongoose from 'mongoose';

/**
 * Model: ScheduledPost
 * Lưu các bài viết được lên lịch để tự động đăng lên Facebook Page
 */
const scheduledPostSchema = new mongoose.Schema({
  // Nội dung bài đăng
  content: {
    type: String,
    required: [true, 'Nội dung bài viết không được để trống'],
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },

  // Thời gian đăng
  scheduledAt: {
    type: Date,
    required: [true, 'Vui lòng chọn thời gian đăng'],
    index: true,
  },

  // Trạng thái
  status: {
    type: String,
    enum: ['pending', 'posted', 'failed', 'cancelled'],
    default: 'pending',
    index: true,
  },

  // Kết quả sau khi đăng
  fbPostId: {
    type: String,
    default: '',
  },
  fbPostUrl: {
    type: String,
    default: '',
  },
  postedAt: {
    type: Date,
  },
  error: {
    type: String,
    default: '',
  },

  // Nguồn nội dung
  sourceType: {
    type: String,
    enum: ['custom', 'interpretation', 'article', 'tuvi_result'],
    default: 'custom',
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  // Người tạo
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index cho cron job query
scheduledPostSchema.index({ status: 1, scheduledAt: 1 });
scheduledPostSchema.index({ createdAt: -1 });

const ScheduledPost = mongoose.model('ScheduledPost', scheduledPostSchema);
export default ScheduledPost;

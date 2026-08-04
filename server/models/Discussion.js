import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  avatar: { type: String, default: '' },
  content: { type: String, required: true },
  time: { type: String, default: 'Vừa xong' },
  createdAt: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Nội dung bài viết là bắt buộc'],
  },
  author: {
    type: String,
    default: 'Thành viên ẩn danh',
    trim: true,
  },
  avatar: {
    type: String,
    default: 'TV',
  },
  time: {
    type: String,
    default: 'Vừa xong',
  },
  source: {
    type: String,
    enum: ['tuvivietnam.vn', 'lyso.vn', 'facebook', 'user', 'khac'],
    default: 'user',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  originalUrl: {
    type: String,
    default: '',
  },
  facebookPostId: {
    type: String,
    default: '',
    index: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
}, {
  timestamps: true,
});

discussionSchema.index({ source: 1, createdAt: -1 });
discussionSchema.index({ title: 'text', content: 'text' });

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;

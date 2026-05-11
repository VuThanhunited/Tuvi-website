import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: [true, 'Nội dung là bắt buộc'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['tu-vi', 'phong-thuy', 'xem-ngay', 'xem-tuoi', 'van-khan', 'kien-thuc', 'khac'],
    default: 'kien-thuc',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Auto-generate slug from title
articleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Note: slug index created automatically by unique:true above
articleSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
articleSchema.index({ author: 1 }); // For fetching user's articles
articleSchema.index({ title: 'text', content: 'text' });

const Article = mongoose.model('Article', articleSchema);

export default Article;

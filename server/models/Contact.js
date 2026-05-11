import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  hoTen: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Nội dung là bắt buộc'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new',
  },
  adminNote: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

contactSchema.index({ status: 1, createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

import mongoose from 'mongoose';

const masterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  profileDescription: { type: String, default: '' }, // Rich text / HTML
  avatar: { type: String, default: '' },
  trustScore: { type: Number, default: 80 }, // Điểm tín nhiệm (0-100)
  rank: { type: String, enum: ['Hạng A', 'Hạng B', 'Hạng C', 'Kim Cương', 'Vàng', 'Bạc'], default: 'Hạng B' },
  expertise: [{ type: String }],
  status: { 
    type: String, 
    enum: ['CRAWLED_PENDING', 'PUBLISHED', 'ARCHIVED'], 
    default: 'PUBLISHED' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ── Indexes ──
masterProfileSchema.index({ status: 1, isActive: 1 }); // For filtering public masters
masterProfileSchema.index({ userId: 1 }); // For user's profile
masterProfileSchema.index({ trustScore: -1 }); // For ranking

export default mongoose.model('MasterProfile', masterProfileSchema);

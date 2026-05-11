import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  tuViResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TuViResult',
  },
  type: {
    type: String,
    enum: ['article', 'tuvi'],
    required: true,
  },
  title: String,
  thumbnail: String,
  category: String,
}, {
  timestamps: true,
});

// Compound index to prevent duplicates
favoriteSchema.index({ userId: 1, articleId: 1, type: 1 }, { unique: true, sparse: true });
// For quick retrieval
favoriteSchema.index({ userId: 1, createdAt: -1 });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;

import Favorite from '../models/Favorite.js';
import Article from '../models/Article.js';
import TuViResult from '../models/TuViResult.js';

/**
 * @desc    Get user's favorite items
 * @route   GET /api/favorites
 * @access  Private
 */
export const getFavorites = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ userId: req.user._id })
        .populate('articleId', 'title slug thumbnail category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Favorite.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách yêu thích thành công',
      data: {
        favorites,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add to favorites
 * @route   POST /api/favorites
 * @access  Private
 */
export const addFavorite = async (req, res, next) => {
  try {
    const { articleId, type = 'article' } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'Article ID là bắt buộc',
      });
    }

    if (!['article', 'tuvi'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type phải là article hoặc tuvi',
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.user._id,
      articleId,
      type,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Đã thêm vào yêu thích rồi',
      });
    }

    // Get article/tuvi info for storing metadata
    let title, thumbnail, category;

    if (type === 'article') {
      const article = await Article.findById(articleId).select('title thumbnail category');
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Bài viết không tồn tại',
        });
      }
      title = article.title;
      thumbnail = article.thumbnail;
      category = article.category;
    } else if (type === 'tuvi') {
      const tuvi = await TuViResult.findById(articleId).select('hoTen');
      if (!tuvi) {
        return res.status(404).json({
          success: false,
          message: 'Kết quả Tử Vi không tồn tại',
        });
      }
      title = tuvi.hoTen;
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      articleId,
      type,
      title,
      thumbnail,
      category,
    });

    res.status(201).json({
      success: true,
      message: 'Thêm vào yêu thích thành công',
      data: { favorite },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove from favorites
 * @route   DELETE /api/favorites/:id
 * @access  Private
 */
export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Yêu thích không tồn tại',
      });
    }

    // Check ownership
    if (favorite.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa',
      });
    }

    await Favorite.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa khỏi yêu thích thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if item is favorited
 * @route   GET /api/favorites/check/:articleId
 * @access  Private
 */
export const checkFavorite = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { type = 'article' } = req.query;

    const favorite = await Favorite.findOne({
      userId: req.user._id,
      articleId,
      type,
    });

    res.status(200).json({
      success: true,
      data: {
        isFavorited: !!favorite,
        favoriteId: favorite?._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get favorites count
 * @route   GET /api/favorites/count
 * @access  Private
 */
export const getFavoritesCount = async (req, res, next) => {
  try {
    const count = await Favorite.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

import Article from '../models/Article.js';

/** @desc Lấy danh sách bài viết @route GET /api/articles @access Public */
export const getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const filter = { isPublished: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [articles, total] = await Promise.all([
      Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        .select('title slug excerpt thumbnail category viewCount createdAt')
        .populate('author', 'hoTen'),
      Article.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true, data: articles,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
};

/** @desc Lấy bài viết theo slug @route GET /api/articles/:slug @access Public */
export const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'hoTen avatar');
    if (!article) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    article.viewCount += 1;
    await article.save();
    res.status(200).json({ success: true, data: article });
  } catch (error) { next(error); }
};

/** @desc Tạo bài viết (Admin) @route POST /api/articles @access Private/Admin */
export const createArticle = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo bài viết thành công!', data: article });
  } catch (error) { next(error); }
};

/** @desc Cập nhật bài viết (Admin) @route PUT /api/articles/:id @access Private/Admin */
export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    res.status(200).json({ success: true, data: article });
  } catch (error) { next(error); }
};

/** @desc Xóa bài viết (Admin) @route DELETE /api/articles/:id @access Private/Admin */
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    res.status(200).json({ success: true, message: 'Đã xóa bài viết.' });
  } catch (error) { next(error); }
};

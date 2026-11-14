import Interpretation from '../models/Interpretation.js';
import Article from '../models/Article.js';
import Discussion from '../models/Discussion.js';
import TuViDatabase from '../models/TuViDatabase.js';

/**
 * @route GET /api/admin/content-picker/interpretations
 * Tìm kiếm luận giải theo sao, cung, loại
 */
export const pickInterpretations = async (req, res, next) => {
  try {
    const { search = '', sao = '', cung = '', type = '', limit = 12 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (sao) filter.sao = { $regex: sao, $options: 'i' };
    if (cung) filter.cung = { $regex: cung, $options: 'i' };
    if (search) {
      filter.$or = [
        { sao: { $regex: search, $options: 'i' } },
        { cung: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tenCachCuc: { $regex: search, $options: 'i' } },
      ];
    }

    const data = await Interpretation.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * @route GET /api/admin/content-picker/articles
 * Lấy bài viết đã publish
 */
export const pickArticles = async (req, res, next) => {
  try {
    const { search = '', category = '', limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const data = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('title excerpt category tags thumbnail slug createdAt')
      .lean();

    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * @route GET /api/admin/content-picker/con-giap
 * Lấy dữ liệu con giáp + vận hạn từ TuViDatabase
 */
export const pickConGiap = async (req, res, next) => {
  try {
    const { chi = '', month = '' } = req.query;

    const db = await TuViDatabase.findOne().lean();
    if (!db || !db.con_giap?.length) {
      return res.json({ success: true, data: [] });
    }

    let list = db.con_giap;
    if (chi) {
      list = list.filter(c => c.chi?.toLowerCase().includes(chi.toLowerCase()) || c.ten?.toLowerCase().includes(chi.toLowerCase()));
    }

    // Lấy vận hạn theo tháng nếu có
    const monthNum = parseInt(month) || new Date().getMonth() + 1;
    const data = list.map(c => ({
      _id: c._id || c.id,
      ten: c.ten,
      chi: c.chi,
      tinh_cach: c.tinh_cach,
      van_han_nam_2026: c.van_han_nam_2026,
      van_han_thang_hien_tai: c.van_han_theo_thang?.find(v => v.thang === monthNum) || null,
      so_may_man: c.so_may_man,
      mau_may_man: c.mau_may_man,
    }));

    res.json({ success: true, data, currentMonth: monthNum });
  } catch (error) { next(error); }
};

/**
 * @route GET /api/admin/content-picker/discussions
 * Lấy thảo luận cộng đồng
 */
export const pickDiscussions = async (req, res, next) => {
  try {
    const { search = '', limit = 12 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const data = await Discussion.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('title content author imageUrl createdAt likesCount commentsCount')
      .lean();

    res.json({ success: true, data });
  } catch (error) { next(error); }
};

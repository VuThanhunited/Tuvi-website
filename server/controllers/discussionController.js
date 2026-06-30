import Discussion from '../models/Discussion.js';

// @desc    Lấy tất cả thảo luận/bài viết cộng đồng
// @route   GET /api/discussions
// @access  Public
export const getDiscussions = async (req, res, next) => {
  try {
    const { source, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (source) query.source = source;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Discussion.countDocuments(query);
    const discussions = await Discussion.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: discussions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: discussions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo thảo luận mới
// @route   POST /api/discussions
// @access  Public (or Private if logged in, but let's make it easy to write posts)
export const createDiscussion = async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề và nội dung bài viết.' });
    }

    const discussion = await Discussion.create({
      title,
      content,
      author: author || 'Thành viên ẩn danh',
      avatar: (author || 'TV').substring(0, 2).toUpperCase(),
      source: 'user'
    });

    res.status(201).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Thêm bình luận vào bài thảo luận
// @route   POST /api/discussions/:id/comments
// @access  Public
export const addComment = async (req, res, next) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên và nội dung bình luận.' });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết này.' });
    }

    const comment = {
      author,
      content,
      avatar: author.substring(0, 2).toUpperCase(),
      time: 'Vừa xong'
    };

    discussion.comments.push(comment);
    discussion.commentsCount = discussion.comments.length;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tăng lượt thích bài viết
// @route   POST /api/discussions/:id/like
// @access  Public
export const likeDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết này.' });
    }

    discussion.likesCount += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      likesCount: discussion.likesCount
    });
  } catch (error) {
    next(error);
  }
};

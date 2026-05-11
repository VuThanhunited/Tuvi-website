import Interpretation from '../models/Interpretation.js';

// @desc    Lấy tất cả luận giải (có lọc)
// @route   GET /api/interpretations
// @access  Private/Admin
export const getInterpretations = async (req, res, next) => {
  try {
    const { type, sao, cung, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (sao) query.sao = { $regex: sao, $options: 'i' };
    if (cung) query.cung = { $regex: cung, $options: 'i' };
    
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { tenCachCuc: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Interpretation.countDocuments(query);
    const interpretations = await Interpretation.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: interpretations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: interpretations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo luận giải mới
// @route   POST /api/interpretations
// @access  Private/Admin
export const createInterpretation = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const interpretation = await Interpretation.create(req.body);

    res.status(201).json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy chi tiết luận giải
// @route   GET /api/interpretations/:id
// @access  Private/Admin
export const getInterpretationById = async (req, res, next) => {
  try {
    const interpretation = await Interpretation.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!interpretation) {
      res.status(404);
      throw new Error('Không tìm thấy luận giải này');
    }

    res.status(200).json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật luận giải
// @route   PUT /api/interpretations/:id
// @access  Private/Admin
export const updateInterpretation = async (req, res, next) => {
  try {
    let interpretation = await Interpretation.findById(req.params.id);

    if (!interpretation) {
      res.status(404);
      throw new Error('Không tìm thấy luận giải này');
    }

    interpretation = await Interpretation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa luận giải
// @route   DELETE /api/interpretations/:id
// @access  Private/Admin
export const deleteInterpretation = async (req, res, next) => {
  try {
    const interpretation = await Interpretation.findById(req.params.id);

    if (!interpretation) {
      res.status(404);
      throw new Error('Không tìm thấy luận giải này');
    }

    await interpretation.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

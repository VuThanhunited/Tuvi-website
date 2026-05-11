import MasterProfile from '../models/MasterProfile.js';

/**
 * @desc    Lấy danh sách chuyên gia công khai (PUBLISHED)
 * @route   GET /api/masters
 * @access  Public
 */
export const getPublicMasters = async (req, res, next) => {
  try {
    const masters = await MasterProfile.find({ 
      status: 'PUBLISHED',
      isActive: true 
    }).sort({ trustScore: -1 }); // Ưu tiên điểm cao
    
    res.status(200).json({
      success: true,
      data: masters
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết chuyên gia
 * @route   GET /api/masters/:id
 * @access  Public
 */
export const getPublicMasterDetail = async (req, res, next) => {
  try {
    const master = await MasterProfile.findOne({ 
      _id: req.params.id,
      status: 'PUBLISHED',
      isActive: true 
    });
    
    if (!master) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chuyên gia.' });
    }

    res.status(200).json({
      success: true,
      data: master
    });
  } catch (error) {
    next(error);
  }
};

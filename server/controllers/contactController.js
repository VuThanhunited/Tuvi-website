import Contact from '../models/Contact.js';

/**
 * @desc    Gửi liên hệ
 * @route   POST /api/contact
 * @access  Public
 */
export const createContact = async (req, res, next) => {
  try {
    const { hoTen, email, phone, subject, message } = req.body;
    if (!hoTen || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    const contact = await Contact.create({ hoTen, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Gửi liên hệ thành công!', data: contact });
  } catch (error) { next(error); }
};

/**
 * @desc    Lấy danh sách liên hệ (Admin)
 * @route   GET /api/contact
 * @access  Private/Admin
 */
export const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true, data: contacts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
};

/**
 * @desc    Cập nhật trạng thái liên hệ (Admin)
 * @route   PUT /api/contact/:id
 * @access  Private/Admin
 */
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, adminNote: req.body.adminNote },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    res.status(200).json({ success: true, data: contact });
  } catch (error) { next(error); }
};

/**
 * @desc    Xóa liên hệ (Admin)
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    res.status(200).json({ success: true, message: 'Đã xóa.' });
  } catch (error) { next(error); }
};

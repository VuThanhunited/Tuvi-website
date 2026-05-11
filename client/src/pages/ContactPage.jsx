import { useState } from 'react';
import { useToast } from '../components/Toast/Toast.jsx';
import api from '../services/api.js';
import './StaticPages.css';

export default function ContactPage() {
  const [form, setForm] = useState({
    hoTen: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { success, error: showError } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.hoTen.trim()) {
      newErrors.hoTen = 'Họ tên là bắt buộc';
    } else if (form.hoTen.trim().length < 2) {
      newErrors.hoTen = 'Họ tên phải ít nhất 2 ký tự';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (form.phone && !/^[0-9+\-\s()]+$/.test(form.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Nội dung là bắt buộc';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Nội dung phải ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Vui lòng kiểm tra lại các trường');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/contact', form);
      success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.');
      setForm({ hoTen: '', email: '', phone: '', message: '' });
      setErrors({});
    } catch (err) {
      showError(err.message || 'Gửi liên hệ thất bại. Vui lòng thử lại.');
      console.error('Contact submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>📧 Liên Hệ</h1>
          <p>Bạn có câu hỏi hoặc góp ý? Hãy liên hệ với chúng tôi</p>
        </div>

        <div className="contact-grid">
          <div className="content-card">
            <h2>📝 Gửi Tin Nhắn</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Họ Tên *</label>
                <input
                  type="text"
                  name="hoTen"
                  className={`form-input ${errors.hoTen ? 'is-invalid' : ''}`}
                  placeholder="Nhập họ tên"
                  value={form.hoTen}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.hoTen && <span className="form-error">{errors.hoTen}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Số Điện Thoại</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Nhập số điện thoại (tùy chọn)"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Nội dung *</label>
                <textarea
                  name="message"
                  className={`form-input ${errors.message ? 'is-invalid' : ''}`}
                  rows="5"
                  placeholder="Nhập nội dung..."
                  value={form.message}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ resize: 'vertical' }}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? '⏳ Đang gửi...' : '📤 Gửi Liên Hệ'}
              </button>
            </form>
          </div>

          <div>
            <div className="content-card">
              <h2>📍 Thông Tin Liên Hệ</h2>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <span className="contact-info-icon">📧</span>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <div className="contact-info-value">info@tuvi.vn</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">📞</span>
                  <div>
                    <div className="contact-info-label">Điện thoại</div>
                    <div className="contact-info-value">0817.505.493</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">📍</span>
                  <div>
                    <div className="contact-info-label">Địa chỉ</div>
                    <div className="contact-info-value">Hà Nội, Việt Nam</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">🕐</span>
                  <div>
                    <div className="contact-info-label">Giờ làm việc</div>
                    <div className="contact-info-value">T2-T7: 8:00 - 18:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .form-error {
          display: block;
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }

        .form-input.is-invalid {
          border-color: #dc3545;
          background-color: #fff5f5;
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

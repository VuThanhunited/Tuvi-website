import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TuViForm.css';

const GIO_SINH = [
  { value: '', label: 'Chọn giờ sinh' },
  { value: '23-1', label: 'Giờ Tý (23:00 - 01:00)' },
  { value: '1-3', label: 'Giờ Sửu (01:00 - 03:00)' },
  { value: '3-5', label: 'Giờ Dần (03:00 - 05:00)' },
  { value: '5-7', label: 'Giờ Mão (05:00 - 07:00)' },
  { value: '7-9', label: 'Giờ Thìn (07:00 - 09:00)' },
  { value: '9-11', label: 'Giờ Tỵ (09:00 - 11:00)' },
  { value: '11-13', label: 'Giờ Ngọ (11:00 - 13:00)' },
  { value: '13-15', label: 'Giờ Mùi (13:00 - 15:00)' },
  { value: '15-17', label: 'Giờ Thân (15:00 - 17:00)' },
  { value: '17-19', label: 'Giờ Dậu (17:00 - 19:00)' },
  { value: '19-21', label: 'Giờ Tuất (19:00 - 21:00)' },
  { value: '21-23', label: 'Giờ Hợi (21:00 - 23:00)' },
];

export default function TuViForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLunar, setIsLunar] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '', gioiTinh: 'nam', ngaySinh: '', thangSinh: '', namSinh: '', gioSinh: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/ket-qua', { state: { ...formData, isLunar } });
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({ hoTen: '', gioiTinh: 'nam', ngaySinh: '', thangSinh: '', namSinh: '', gioSinh: '' });
    setIsLunar(false);
  };

  if (loading) {
    return (
      <section className="tuvi-form-section" id="tuvi-form">
        <div className="container">
          <div className="tuvi-form-card">
            <div className="tuvi-form-loading">
              <div className="spinner" />
              <p>Đang tính toán tử vi của bạn...</p>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Phân tích 12 cung, an sao, luận giải chi tiết
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tuvi-form-section" id="tuvi-form">
      <div className="container">
        <div className="tuvi-form-card">
          <div className="tuvi-form-header">
            <div className="tuvi-form-icon">☯</div>
            <h2 className="tuvi-form-title">Tính Tử Vi Trọn Đời</h2>
            <p className="tuvi-form-desc">Nhập thông tin ngày giờ sinh để xem tử vi chi tiết 12 cung mệnh</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tuvi-form-grid">
              <div className="form-group full-width">
                <label className="form-label" htmlFor="hoTen">Họ và Tên</label>
                <input type="text" id="hoTen" name="hoTen" className="form-input" placeholder="Nhập họ và tên của bạn" value={formData.hoTen} onChange={handleChange} required />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Giới tính</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input type="radio" id="nam" name="gioiTinh" value="nam" checked={formData.gioiTinh === 'nam'} onChange={handleChange} />
                    <label htmlFor="nam">👨 Nam</label>
                  </div>
                  <div className="radio-option">
                    <input type="radio" id="nu" name="gioiTinh" value="nu" checked={formData.gioiTinh === 'nu'} onChange={handleChange} />
                    <label htmlFor="nu">👩 Nữ</label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ngaySinh">Ngày sinh</label>
                <input type="number" id="ngaySinh" name="ngaySinh" className="form-input" placeholder="VD: 15" min="1" max="31" value={formData.ngaySinh} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="thangSinh">Tháng sinh</label>
                <input type="number" id="thangSinh" name="thangSinh" className="form-input" placeholder="VD: 3" min="1" max="12" value={formData.thangSinh} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="namSinh">Năm sinh</label>
                <input type="number" id="namSinh" name="namSinh" className="form-input" placeholder="VD: 1990" min="1920" max="2025" value={formData.namSinh} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gioSinh">Giờ sinh</label>
                <select id="gioSinh" name="gioSinh" className="form-select" value={formData.gioSinh} onChange={handleChange} required>
                  {GIO_SINH.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>

              <div className="form-group full-width">
                <div className="calendar-toggle">
                  <label className="toggle-label">
                    <input type="checkbox" checked={isLunar} onChange={(e) => setIsLunar(e.target.checked)} />
                    <span className="toggle-switch" />
                    <span>{isLunar ? '🌙 Tính theo Âm lịch' : '☀️ Tính theo Dương lịch'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="tuvi-form-actions">
              <button type="submit" className="btn btn-primary btn-lg" id="submit-tuvi">✨ Tính Tử Vi</button>
              <button type="button" className="btn btn-reset" onClick={handleReset} id="reset-tuvi">✕ Xóa</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

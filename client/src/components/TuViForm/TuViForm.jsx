import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './TuViForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

const THANG_OPTIONS = [
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
];

const NGAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const currentYear = new Date().getFullYear();

export default function TuViForm() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLunar, setIsLunar] = useState(false);
  
  const [formData, setFormData] = useState({
    hoTen: '',
    gioiTinh: 'nam',
    ngaySinh: '1',
    thangSinh: '1',
    namSinh: '1990',
  });

  const [timezone, setTimezone] = useState('GMT+7');
  const [birthHour, setBirthHour] = useState('12');
  const [birthMin, setBirthMin] = useState('0');
  const [namXem, setNamXem] = useState(String(new Date().getFullYear()));
  const [thangXem, setThangXem] = useState(String(new Date().getMonth() + 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      // Convert birthHour to GMT+7 matching ranges (Tý, Sửu...)
      const h = parseInt(birthHour);
      let gioSinhVal = '12-14'; // Default
      if ((h >= 23 && h <= 24) || (h >= 0 && h < 1)) gioSinhVal = '23-1';
      else if (h >= 1 && h < 3) gioSinhVal = '1-3';
      else if (h >= 3 && h < 5) gioSinhVal = '3-5';
      else if (h >= 5 && h < 7) gioSinhVal = '5-7';
      else if (h >= 7 && h < 9) gioSinhVal = '7-9';
      else if (h >= 9 && h < 11) gioSinhVal = '9-11';
      else if (h >= 11 && h < 13) gioSinhVal = '11-13';
      else if (h >= 13 && h < 15) gioSinhVal = '13-15';
      else if (h >= 15 && h < 17) gioSinhVal = '15-17';
      else if (h >= 17 && h < 19) gioSinhVal = '17-19';
      else if (h >= 19 && h < 21) gioSinhVal = '19-21';
      else if (h >= 21 && h < 23) gioSinhVal = '21-23';

      const res = await fetch(`${API_URL}/tuvi/calculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          gioSinh: gioSinhVal,
          isLunar,
          namXem,
          thangXem,
          birthHour,
          birthMin,
          timezone,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      navigate('/ket-qua', { state: data.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="scroll-wrapper-container">
        <img className="scroll-edge-left" src="/images/page-edge.png" alt="Scroll Handle Left" />
        <img className="scroll-edge-right" src="/images/page-edge.png" alt="Scroll Handle Right" />
        <div className="scroll-paper-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="tuvi-form-loading" style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ color: '#8b1c1c', fontWeight: 'bold', marginTop: '15px' }}>Đang lập lá số tử vi...</p>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>Phân tích 12 cung, an sao, luận giải chi tiết</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-wrapper-container">
      {/* Left rod */}
      <img className="scroll-edge-left" src="/images/page-edge.png" alt="Scroll Handle Left" />

      {/* Right rod */}
      <img className="scroll-edge-right" src="/images/page-edge.png" alt="Scroll Handle Right" />

      {/* Scroll Paper */}
      <div className="scroll-paper-body">
        {/* Red Capsule Header */}
        <div className="scroll-title-capsule">
          <span className="scroll-title-text">Lập lá số Tử Vi</span>
        </div>

        <form onSubmit={handleSubmit} className="scroll-form-inner">
          {error && (
            <div style={{
              background: '#ffeaea', color: '#c0392b',
              padding: '0.75rem 1rem', borderRadius: '6px',
              marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center',
              border: '1px solid #ebccd1'
            }}>
              {error}
            </div>
          )}

          {/* Họ Tên */}
          <div className="scroll-form-row">
            <label className="scroll-form-label" htmlFor="hoTen-home">Họ Tên</label>
            <input
              type="text"
              id="hoTen-home"
              name="hoTen"
              className="scroll-form-input"
              placeholder="Nhập họ tên"
              value={formData.hoTen}
              onChange={handleChange}
              required
            />
          </div>

          {/* Ngày sinh */}
          <div className="scroll-form-row">
            <label className="scroll-form-label">Ngày sinh</label>
            <div className="scroll-form-date-group">
              <select
                name="ngaySinh"
                className="scroll-form-select"
                value={formData.ngaySinh}
                onChange={handleChange}
                required
              >
                {NGAY_OPTIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <select
                name="thangSinh"
                className="scroll-form-select"
                value={formData.thangSinh}
                onChange={handleChange}
                required
              >
                {THANG_OPTIONS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <input
                type="number"
                name="namSinh"
                className="scroll-form-input scroll-input--year"
                placeholder="1990"
                min="1900"
                max={currentYear}
                value={formData.namSinh}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Lịch dương / Lịch âm */}
          <div className="scroll-form-row">
            <label className="scroll-form-label"></label>
            <div className="scroll-form-radio-group">
              <label className={`scroll-radio-label ${!isLunar ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="calendarTypeHome"
                  checked={!isLunar}
                  onChange={() => setIsLunar(false)}
                />
                <span className="scroll-radio-dot" />
                Lịch dương
              </label>
              <label className={`scroll-radio-label ${isLunar ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="calendarTypeHome"
                  checked={isLunar}
                  onChange={() => setIsLunar(true)}
                />
                <span className="scroll-radio-dot" />
                Lịch âm
              </label>
            </div>
          </div>

          {/* Giờ sinh */}
          <div className="scroll-form-row">
            <label className="scroll-form-label">Giờ sinh</label>
            <div className="scroll-form-date-group">
              <select
                className="scroll-form-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="GMT+7">GMT +7</option>
                <option value="GMT+8">GMT +8</option>
                <option value="GMT+9">GMT +9</option>
              </select>
              <select
                className="scroll-form-select"
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={String(h)}>{h} Giờ</option>
                ))}
              </select>
              <select
                className="scroll-form-select"
                value={birthMin}
                onChange={(e) => setBirthMin(e.target.value)}
              >
                {Array.from({ length: 60 }, (_, m) => (
                  <option key={m} value={String(m)}>{m} Phút</option>
                ))}
              </select>
            </div>
          </div>

          {/* Giới tính */}
          <div className="scroll-form-row">
            <label className="scroll-form-label">Giới tính</label>
            <div className="scroll-form-radio-group">
              <label className={`scroll-radio-label ${formData.gioiTinh === 'nam' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="gioiTinhHome"
                  value="nam"
                  checked={formData.gioiTinh === 'nam'}
                  onChange={handleChange}
                />
                <span className="scroll-radio-dot" />
                Nam
              </label>
              <label className={`scroll-radio-label ${formData.gioiTinh === 'nu' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="gioiTinhHome"
                  value="nu"
                  checked={formData.gioiTinh === 'nu'}
                  onChange={handleChange}
                />
                <span className="scroll-radio-dot" />
                Nữ
              </label>
            </div>
          </div>

          {/* Năm xem / Tháng xem */}
          <div className="scroll-form-row">
            <label className="scroll-form-label">Năm xem</label>
            <div className="scroll-form-date-group scroll-form-date-group--half">
              <input
                type="number"
                className="scroll-form-input"
                min="2020"
                max="2035"
                value={namXem}
                onChange={(e) => setNamXem(e.target.value)}
              />
              <div className="scroll-inline-label">Tháng xem</div>
              <select
                className="scroll-form-select"
                value={thangXem}
                onChange={(e) => setThangXem(e.target.value)}
              >
                {THANG_OPTIONS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="scroll-submit-row">
            <button type="submit" className="scroll-submit-btn">
              Lập lá số
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

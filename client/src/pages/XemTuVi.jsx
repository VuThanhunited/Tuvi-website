import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import TuViResult from './TuViResult.jsx';
import './XemTuVi.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

const THANG_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Tháng ${i + 1}`,
}));

const NGAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: `Ngày ${i + 1}`,
}));

const currentYear = new Date().getFullYear();

function LotusIcon() {
  return (
    <svg className="xemtuvi-lotus-svg" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 3C15.5 8 14.5 13 18 19C21.5 13 20.5 8 18 3Z" stroke="#f5d27b" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 19C12 16 9.5 11.5 10.5 6.5C13.5 9.5 16 13.5 18 19Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 19C24 16 26.5 11.5 25.5 6.5C22.5 9.5 20 13.5 18 19Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 20C10.5 20 6 16.5 4.5 11.5C9.5 13 13.5 15.5 18 20Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 20C25.5 20 30 16.5 31.5 11.5C26.5 13 22.5 15.5 18 20Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 22.5C13 21 23 21 28 22.5" stroke="#f5d27b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function XemTuVi() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const formSectionRef = useRef(null);
  const nameInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLunar, setIsLunar] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: '',
    gioiTinh: 'nam',
    ngaySinh: '1',
    thangSinh: '1',
    namSinh: '1990',
    gioSinh: '11-13',
  });
  const [birthHour, setBirthHour] = useState('12');
  const [birthMin, setBirthMin] = useState('30');
  const [timezone, setTimezone] = useState('GMT+7');
  const [namXem, setNamXem] = useState(String(currentYear));
  const [thangXem, setThangXem] = useState('5');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => nameInputRef.current?.focus(), 350);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const h = parseInt(birthHour, 10);
      let gioSinhVal = '11-13';
      if (h >= 23 || h < 1) gioSinhVal = '23-1';
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
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      try {
        localStorage.setItem('last_tuvi_result', JSON.stringify(data.data));
      } catch {
        // ignore storage quota
      }

      setCalculatedResult(data.data);
      navigate('/ket-qua', { state: data.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xemtuvi-page">
      <div className="xemtuvi-form-section" ref={formSectionRef}>
        <section className="qtv-form-card">
          <div className="qtv-form-card-header">
            <div className="qtv-form-card-title-group">
              <LotusIcon />
              <h2>Lập lá số Tử Vi</h2>
            </div>
            <span className="qtv-form-badge-free">Miễn phí</span>
          </div>

          <div className="qtv-form-card-body">
            {loading ? (
              <div className="xemtuvi-loading">
                <div className="spinner" />
                <p>Đang tính toán lá số tử vi...</p>
                <span>Phân tích 12 cung, an sao, luận giải chi tiết</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="qtv-form-inner">
                {error && (
                  <div className="xemtuvi-error-alert">
                    {error}
                  </div>
                )}

                <div className="qtv-form-row">
                  <label className="qtv-form-label" htmlFor="hoTen-xem">Họ Tên</label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="hoTen-xem"
                    name="hoTen"
                    className="qtv-form-input"
                    placeholder="Nhập họ tên đương số"
                    value={formData.hoTen}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="qtv-form-row">
                  <label className="qtv-form-label">Ngày sinh</label>
                  <div className="qtv-form-date-group">
                    <select
                      name="ngaySinh"
                      className="qtv-form-select"
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
                      className="qtv-form-select"
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
                      className="qtv-form-input qtv-input--year"
                      placeholder="1990"
                      min="1900"
                      max={currentYear}
                      value={formData.namSinh}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="qtv-form-row">
                  <label className="qtv-form-label">Loại lịch</label>
                  <div className="qtv-form-radio-group">
                    <label className={`qtv-radio-label ${!isLunar ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="calendarType"
                        checked={!isLunar}
                        onChange={() => setIsLunar(false)}
                      />
                      <span>Lịch dương</span>
                    </label>
                    <label className={`qtv-radio-label ${isLunar ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="calendarType"
                        checked={isLunar}
                        onChange={() => setIsLunar(true)}
                      />
                      <span>Lịch âm</span>
                    </label>
                  </div>
                </div>

                <div className="qtv-form-row">
                  <label className="qtv-form-label">Giờ sinh</label>
                  <div className="qtv-form-date-group">
                    <select
                      className="qtv-form-select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="GMT+7">GMT +7</option>
                      <option value="GMT+8">GMT +8</option>
                      <option value="GMT+9">GMT +9</option>
                    </select>
                    <select
                      className="qtv-form-select"
                      value={birthHour}
                      onChange={(e) => setBirthHour(e.target.value)}
                    >
                      {Array.from({ length: 24 }, (_, h) => (
                        <option key={h} value={String(h)}>{h} Giờ</option>
                      ))}
                    </select>
                    <select
                      className="qtv-form-select"
                      value={birthMin}
                      onChange={(e) => setBirthMin(e.target.value)}
                    >
                      {Array.from({ length: 60 }, (_, m) => (
                        <option key={m} value={String(m)}>{m} Phút</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="qtv-form-row">
                  <label className="qtv-form-label">Giới tính</label>
                  <div className="qtv-form-radio-group">
                    <label className={`qtv-radio-label ${formData.gioiTinh === 'nam' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="gioiTinh"
                        value="nam"
                        checked={formData.gioiTinh === 'nam'}
                        onChange={handleChange}
                      />
                      <span>Nam</span>
                    </label>
                    <label className={`qtv-radio-label ${formData.gioiTinh === 'nu' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="gioiTinh"
                        value="nu"
                        checked={formData.gioiTinh === 'nu'}
                        onChange={handleChange}
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>

                <div className="qtv-form-row">
                  <label className="qtv-form-label">Năm xem</label>
                  <div className="qtv-form-date-group">
                    <input
                      type="number"
                      className="qtv-form-input"
                      min="2020"
                      max="2035"
                      value={namXem}
                      onChange={(e) => setNamXem(e.target.value)}
                    />
                    <div className="qtv-inline-label">Tháng xem (Âm lịch)</div>
                    <select
                      className="qtv-form-select"
                      value={thangXem}
                      onChange={(e) => setThangXem(e.target.value)}
                    >
                      {THANG_OPTIONS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="qtv-submit-row">
                  <button type="submit" className="qtv-submit-btn">
                    Lập lá số Tử Vi
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* Hiển thị trực tiếp giao diện Kết quả lá số Tử Vi ngay bên dưới */}
      <TuViResult embedded externalResult={calculatedResult} onRequestNew={handleScrollToForm} />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './XemTuVi.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

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

export default function XemTuVi() {
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
    gioSinh: '11-13',
  });
  const [birthHour, setBirthHour] = useState('12');
  const [birthMin, setBirthMin] = useState('30');
  const [timezone, setTimezone] = useState('GMT+7');
  const [namXem, setNamXem] = useState('2026');
  const [thangXem, setThangXem] = useState('5');

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

      // Map hour to double-hour interval (gioSinh)
      const h = parseInt(birthHour);
      let gioSinhVal = '11-13'; // default for 12
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

      // Navigate to result page with saved data (has _id from MongoDB)
      navigate('/ket-qua', { state: data.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xemtuvi-page">
      {/* Breadcrumb */}
      <div className="xemtuvi-breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/xem-tu-vi" className="breadcrumb-link">Xem tử vi</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Lập lá số tử vi</span>
        </div>
      </div>

      <div className="container">
        <div className="xemtuvi-layout">
          {/* ====== MAIN CONTENT ====== */}
          <div className="xemtuvi-main">
            {/* Scroll Wrapper Container */}
            <div className="scroll-wrapper-container">
              {/* Left rod */}
              <div className="scroll-rod rod-left">
                <div className="rod-cap cap-top"></div>
                <div className="rod-shaft"></div>
                <div className="rod-cap cap-bottom"></div>
              </div>

              {/* Scroll Paper */}
              <div className="scroll-paper-body">
                {/* Red Capsule Header */}
                <div className="scroll-title-capsule">
                  <div className="capsule-left-decor"></div>
                  <span className="scroll-title-text">Lập lá số Tử Vi</span>
                  <div className="capsule-right-decor"></div>
                </div>

                {loading ? (
                  <div className="xemtuvi-loading">
                    <div className="spinner" />
                    <p>Đang tính toán lá số tử vi...</p>
                    <span>Phân tích 12 cung, an sao, luận giải chi tiết</span>
                  </div>
                ) : (
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
                      <label className="scroll-form-label" htmlFor="hoTen-xem">Họ Tên</label>
                      <input
                        type="text"
                        id="hoTen-xem"
                        name="hoTen"
                        className="scroll-form-input"
                        placeholder="Vũ Đình Thành"
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
                          placeholder="1911"
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
                            name="calendarType"
                            checked={!isLunar}
                            onChange={() => setIsLunar(false)}
                          />
                          <span className="scroll-radio-dot" />
                          Lịch dương
                        </label>
                        <label className={`scroll-radio-label ${isLunar ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="calendarType"
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
                            name="gioiTinh"
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
                            name="gioiTinh"
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
                        <div className="scroll-inline-label">Tháng xem (Âm lịch)</div>
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
                )}
              </div>

              {/* Right rod */}
              <div className="scroll-rod rod-right">
                <div className="rod-cap cap-top"></div>
                <div className="rod-shaft"></div>
                <div className="rod-cap cap-bottom"></div>
              </div>
            </div>

            {/* Promo Banner Card */}
            <div className="promo-banner-card" style={{
              background: '#ffffff',
              border: '1px solid #d4c2a5',
              borderRadius: '6px',
              padding: '12px 18px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="promo-banner-content" style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1' }}>
                <div className="promo-banner-badge" style={{
                  background: 'linear-gradient(135deg, #a62b2b, #8b1c1c)',
                  color: '#ffda75',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: '1px solid #ffda75'
                }}>AI</div>
                <div className="promo-banner-text">
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#8b1c1c', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'inherit' }}>Xem Nhân Tướng Học</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#666', fontWeight: '600' }}>SIÊU HAY BẰNG AI - XEM NGAY</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <a href="/horoscope" className="promo-banner-btn" style={{
                  background: '#8c731f',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'inline-block'
                }}>XEM NGAY</a>
              </div>
            </div>

            {/* Introduction Section */}
            <div className="xemtuvi-intro">
              <h2 className="intro-title">Giới Thiệu Về Tử Vi</h2>

              <div className="intro-content">
                <p>
                  <strong>Tử Vi</strong>, hay <strong>Tử Vi Đẩu Số</strong>, là một bộ môn huyền học được dùng với các công năng chính như: luận đoán về tính cách, hoàn cảnh, dự đoán về các "vận hạn" trong cuộc đời của một người đồng thời nghiên cứu tương tác của một người với các sự kiện, nhân sự... Chung quy với mục đích chính là để biết vận mệnh con người.
                </p>

                <h3>Lấy lá số tử vi để làm gì ?</h3>
                <p>
                  Lập lá số tử vi có bình giải chi tiết sẽ giúp cho quý bạn mệnh biết về tương lai, vận hạn theo các năm. Khi lấy lá số tử vi theo giờ sinh và ngày tháng năm sinh thì quý bạn cần khám phá phần luận giải lá số để nắm bắt vận mệnh của chính mình. Lá số tử vi mang yếu tố tham khảo giúp quý bạn mệnh tránh việc không nên, tăng cường việc tốt từ đó có một cuộc sống suôn sẻ và nhiều may mắn.
                </p>

                <h3>Lá số tử vi thể hiện điều gì ?</h3>
                <ul>
                  <li>Trên mỗi lá số tử vi sẽ thể hiện các phương diện cuộc sống của quý bạn mệnh theo từng năm tuổi cụ thể như: <strong>công danh, sự nghiệp, gia đạo, tình duyên, tiền tài, sức khỏe, anh chị em, quan hệ xã hội...</strong></li>
                  <li>Để tra cứu và lập lá số tử vi trực tuyến miễn phí quý bạn cần cung cấp đầy đủ và chính xác nhất về <strong>họ tên, giờ sinh, ngày sinh, tháng sinh, năm sinh và giới tính.</strong></li>
                  <li>Ngoài ra: cách xem lá số tử vi có thể thay đổi theo các năm. Vì vậy để luận đoán và có cái nhìn chính xác nhất về tương lai và vận mệnh của mình trong năm {currentYear}, quý bạn nên lấy lá số tử vi {currentYear} và cách lập lá số tử vi để tham khảo chi tiết tử vi năm {currentYear} của mình, cũng như phân tích và khám phá lá số tử vi của các năm khác.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ====== SIDEBAR ====== */}
          <aside className="xemtuvi-sidebar">
            <div className="sidebar-decor-header">
              Danh mục
            </div>
            
            <div className="sidebar-main-menu">
              {/* Xem Tử Vi Block */}
              <div className="sidebar-menu-section">
                <div className="menu-section-header">
                  <span>☯ Xem tử vi</span>
                  <span className="arrow-icon">▼</span>
                </div>
                <ul className="menu-section-list">
                  <li><Link to="/xem-tu-vi">Tử vi 2026</Link></li>
                  <li><Link to="/xem-tu-vi">Tử vi hàng ngày</Link></li>
                  <li><Link to="/xem-tu-vi">Tử vi theo năm</Link></li>
                  <li><Link to="/xem-tu-vi">Tử vi trọn đời</Link></li>
                  <li><Link to="/xem-tu-vi">Tử vi 12 con giáp</Link></li>
                  <li><Link to="/xem-tu-vi" className="sidebar-menu-hot">Lập lá số tử vi <span className="hot-badge-text">Hot!</span></Link></li>
                  <li><Link to="/xem-tu-vi">Lập lá số tứ trụ</Link></li>
                  <li><Link to="/xem-tu-vi">Cân xương tính số</Link></li>
                  <li><Link to="/xem-tu-vi">Thống kê cân xương</Link></li>
                </ul>
              </div>

              {/* Lịch Vạn Niên Block */}
              <div className="sidebar-menu-section">
                <div className="menu-section-header">
                  <span>📅 Lịch vạn niên</span>
                  <span className="arrow-icon">▼</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

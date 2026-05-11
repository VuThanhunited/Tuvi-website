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
    gioSinh: '',
  });
  const [namXem, setNamXem] = useState(String(currentYear));
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

      const res = await fetch(`${API_URL}/tuvi/calculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
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
            {/* Form Card */}
            <div className="xemtuvi-form-card">
              <div className="xemtuvi-form-banner">
                <div className="form-banner-icon">☯</div>
                <h1 className="form-banner-title">Lập Lá Số Tử Vi</h1>
              </div>

              {loading ? (
                <div className="xemtuvi-loading">
                  <div className="spinner" />
                  <p>Đang tính toán lá số tử vi...</p>
                  <span>Phân tích 12 cung, an sao, luận giải chi tiết</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="xemtuvi-form">
                  {error && (
                    <div style={{
                      background: '#ffeaea', color: '#c0392b',
                      padding: '0.75rem 1rem', borderRadius: '6px',
                      marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center',
                    }}>
                      {error}
                    </div>
                  )}
                  {/* Họ Tên */}
                  <div className="form-row">
                    <label className="form-label-tv" htmlFor="hoTen-xem">Họ Tên</label>
                    <input
                      type="text"
                      id="hoTen-xem"
                      name="hoTen"
                      className="form-input-tv"
                      placeholder="Nhập họ tên..."
                      value={formData.hoTen}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Ngày sinh */}
                  <div className="form-row">
                    <label className="form-label-tv">Ngày sinh</label>
                    <div className="form-date-group">
                      <select
                        name="ngaySinh"
                        className="form-select-tv"
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
                        className="form-select-tv form-select-tv--wide"
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
                        className="form-input-tv form-input-tv--year"
                        placeholder="Năm sinh"
                        min="1920"
                        max={currentYear}
                        value={formData.namSinh}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Lịch dương / Lịch âm */}
                  <div className="form-row">
                    <label className="form-label-tv">Lịch</label>
                    <div className="form-radio-group-tv">
                      <label className={`radio-btn-tv ${!isLunar ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="calendarType"
                          checked={!isLunar}
                          onChange={() => setIsLunar(false)}
                        />
                        <span className="radio-dot" />
                        Lịch dương
                      </label>
                      <label className={`radio-btn-tv ${isLunar ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="calendarType"
                          checked={isLunar}
                          onChange={() => setIsLunar(true)}
                        />
                        <span className="radio-dot" />
                        Lịch âm
                      </label>
                    </div>
                  </div>

                  {/* Giờ sinh */}
                  <div className="form-row">
                    <label className="form-label-tv" htmlFor="gioSinh-xem">Giờ sinh</label>
                    <select
                      id="gioSinh-xem"
                      name="gioSinh"
                      className="form-select-tv"
                      value={formData.gioSinh}
                      onChange={handleChange}
                      required
                    >
                      {GIO_SINH.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Giới tính */}
                  <div className="form-row">
                    <label className="form-label-tv">Giới tính</label>
                    <div className="form-radio-group-tv">
                      <label className={`radio-btn-tv ${formData.gioiTinh === 'nam' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="gioiTinh"
                          value="nam"
                          checked={formData.gioiTinh === 'nam'}
                          onChange={handleChange}
                        />
                        <span className="radio-dot" />
                        Nam
                      </label>
                      <label className={`radio-btn-tv ${formData.gioiTinh === 'nu' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="gioiTinh"
                          value="nu"
                          checked={formData.gioiTinh === 'nu'}
                          onChange={handleChange}
                        />
                        <span className="radio-dot" />
                        Nữ
                      </label>
                    </div>
                  </div>

                  {/* Năm xem / Tháng xem */}
                  <div className="form-row">
                    <label className="form-label-tv">Năm xem</label>
                    <div className="form-date-group">
                      <input
                        type="number"
                        className="form-input-tv"
                        min="2020"
                        max="2030"
                        value={namXem}
                        onChange={(e) => setNamXem(e.target.value)}
                      />
                      <div className="form-inline-label">Tháng xem (Âm lịch)</div>
                      <select
                        className="form-select-tv"
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
                  <div className="form-row form-row--submit">
                    <button type="submit" className="btn-lap-la-so" id="submit-lap-la-so">
                      🔮 Lập Lá Số
                    </button>
                  </div>
                </form>
              )}
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
                  Xem lá số tử vi trọn đời có bình giải chi tiết sẽ giúp cho quý bạn mệnh biết về tương lai, vận hạn theo các năm. Khi lấy lá số tử vi theo giờ sinh và ngày tháng năm sinh thì quý bạn cần khám phá phần luận giải lá số để nắm bắt vận mệnh của chính mình. Lá số tử vi trọn đời mang yếu tố tham khảo giúp quý bạn mệnh tránh việc không nên, tăng cường việc tốt từ đó có một cuộc sống suôn sẻ và nhiều may mắn.
                </p>

                <h3>Lá số tử vi trọn đời thể hiện điều gì ?</h3>
                <ul>
                  <li>Trên mỗi lá số tử vi sẽ thể hiện các phương diện cuộc sống của quý bạn mệnh theo từng năm tuổi cụ thể như: <strong>công danh, sự nghiệp, gia đạo, tình duyên, tiền tài, sức khỏe, anh chị em, quan hệ xã hội...</strong></li>
                  <li>Để tra cứu và lấy lá số tử vi trọn đời trực tuyến miễn phí quý bạn cần cung cấp đầy đủ và chính xác nhất về <strong>họ tên, giờ sinh, ngày sinh, tháng sinh, năm sinh và giới tính.</strong></li>
                  <li>Ngoài ra: cách xem lá số tử vi có thể thay đổi theo các năm. Vì vậy để luận đoán và có cái nhìn chính xác nhất về tương lai và vận mệnh của mình trong năm {currentYear}, quý bạn nên lấy lá số tử vi {currentYear} và cách lập lá số tử vi để tham khảo chi tiết tử vi năm {currentYear} của mình, cũng như phân tích và khám phá lá số tử vi trọn đời của các năm khác.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ====== SIDEBAR ====== */}
          <aside className="xemtuvi-sidebar">
            {/* Xem Tử Vi */}
            <div className="sidebar-block">
              <h3 className="sidebar-block-title">Xem Tử Vi</h3>
              <ul className="sidebar-list">
                <li><Link to="/xem-tu-vi">◆ Tử vi năm {currentYear}</Link></li>
                <li><Link to="/xem-tu-vi">◆ Tử vi năm {currentYear - 1}</Link></li>
                <li><Link to="/xem-tu-vi">◆ Tử vi năm {currentYear - 2}</Link></li>
                <li><Link to="/xem-tu-vi">◆ Tử vi năm {currentYear - 3}</Link></li>
                <li><Link to="/xem-tu-vi">◆ Tử vi hàng ngày</Link></li>
                <li><Link to="/xem-tu-vi">◆ Tử vi 12 con giáp</Link></li>
                <li><Link to="/xem-tu-vi">◆ Tử vi trọn đời</Link></li>
                <li><Link to="/xem-tu-vi" className="sidebar-hot">◆ Lập lá số tử vi <span className="hot-badge">Hot</span></Link></li>
                <li><Link to="/xem-tu-vi" className="sidebar-hot">◆ Cân xương tính số <span className="hot-badge">Hot</span></Link></li>
                <li><Link to="/xem-tu-vi">◆ Thống kê cân xương</Link></li>
              </ul>
            </div>

            {/* Xem Tuổi */}
            <div className="sidebar-block">
              <h3 className="sidebar-block-title">Xem Tuổi</h3>
              <ul className="sidebar-list">
                <li><Link to="#">◆ Xem tuổi xông đất</Link></li>
                <li><Link to="#">◆ Xem tuổi vợ chồng</Link></li>
                <li><Link to="#">◆ Xem tuổi kết hôn</Link></li>
                <li><Link to="#">◆ Xem tuổi làm nhà</Link></li>
                <li><Link to="#">◆ Xem tuổi sinh con</Link></li>
                <li><Link to="#">◆ Xem tuổi làm ăn</Link></li>
                <li><Link to="#">◆ Xem tuổi hợp nhau</Link></li>
              </ul>
            </div>

            {/* Lịch Vạn Niên */}
            <div className="sidebar-block">
              <h3 className="sidebar-block-title">Lịch Vạn Niên</h3>
              <ul className="sidebar-list">
                <li><Link to="#">◆ Lịch âm hôm nay</Link></li>
                <li><Link to="#">◆ Lịch âm dương tháng</Link></li>
                <li><Link to="#">◆ Lịch âm dương {currentYear}</Link></li>
                <li><Link to="#">◆ Lịch âm dương {currentYear - 1}</Link></li>
              </ul>
            </div>

            {/* Xem Ngày */}
            <div className="sidebar-block">
              <h3 className="sidebar-block-title">Xem Ngày</h3>
              <ul className="sidebar-list">
                <li><Link to="#">◆ Xem ngày tốt xấu</Link></li>
                <li><Link to="#">◆ Xem ngày kết hôn</Link></li>
                <li><Link to="#">◆ Xem ngày xuất hành</Link></li>
                <li><Link to="#">◆ Xem ngày nhập trạch</Link></li>
                <li><Link to="#">◆ Xem ngày mua xe</Link></li>
                <li><Link to="#">◆ Xem ngày động thổ</Link></li>
                <li><Link to="#">◆ Xem ngày an táng</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

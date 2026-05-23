import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground/ParticleBackground.jsx';
import ContentGate from '../components/ContentGate/ContentGate.jsx';
import './TuViResult.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

/*
 * Cung Chiếu Overlay - Đường chiếu cung (tam hợp + xung chiếu)
 */
const CUNG_CHIEU_CONFIG = {
  0:  { image: '02', transform: 'rotate(0deg)' },
  1:  { image: '03', transform: 'scaleX(-1)' },
  2:  { image: '01', transform: 'rotate(0deg)' },
  3:  { image: '03', transform: 'rotate(0deg)' },
  4:  { image: '02', transform: 'scaleX(-1)' },
  5:  { image: '03', transform: 'scaleX(-1) scaleY(-1)' },
  6:  { image: '01', transform: 'scaleX(-1)' },
  7:  { image: '03', transform: 'scaleY(-1)' },
  8:  { image: '02', transform: 'scaleY(-1)' },
  9:  { image: '03', transform: 'scaleX(-1) rotate(180deg)' },
  10: { image: '01', transform: 'scaleY(-1)' },
  11: { image: '03', transform: 'scaleY(-1) scaleX(-1)' },
};

function CungChieuOverlay({ hoveredCung }) {
  if (hoveredCung === null || hoveredCung === undefined) return null;
  const config = CUNG_CHIEU_CONFIG[hoveredCung];
  if (!config) return null;
  return (
    <div
      className="cung-chieu-overlay"
      aria-hidden="true"
      style={{
        backgroundImage: `url(/images/cung-chieu-${config.image}.png)`,
        transform: config.transform,
      }}
    />
  );
}

// Màu Hóa tinh
const HOA_TINH_STYLE = {
  'hoa-loc':   { color: '#1565c0', label: 'Hóa Lộc' },
  'hoa-quyen': { color: '#6a1b9a', label: 'Hóa Quyền' },
  'hoa-khoa':  { color: '#00838f', label: 'Hóa Khoa' },
  'hoa-ky':    { color: '#b71c1c', label: 'Hóa Kỵ' },
};

// Màu sao phụ theo loại
const SAO_PHU_COLOR = {
  'sat':  '#757575',  // sát tinh - xám
  'loc':  '#d32f2f',  // lộc - đỏ
  'van':  '#1565c0',  // văn - xanh
  'quy':  '#d32f2f',  // quý nhân - đỏ
  'phu':  '#7b1fa2',  // phụ trợ - tím
  'tro':  '#388e3c',  // hỗ trợ - xanh lá
  'dao':  '#f57c00',  // đào hoa - cam
  'default': '#555',
};

// Component hiển thị sao chính
function SaoChinhItem({ sao }) {
  const isTot = sao.trangThai === 'M' || sao.trangThai === 'V';
  const isHam = sao.trangThai === 'H';
  return (
    <span
      className={`sao-chinh ${isTot ? 'sao-tot' : isHam ? 'sao-ham' : 'sao-binh'}`}
      title={`${sao.ten} - ${sao.trangThai === 'M' ? 'Miếu' : sao.trangThai === 'V' ? 'Vượng' : sao.trangThai === 'Đ' ? 'Đắc' : sao.trangThai === 'B' ? 'Bình hòa' : 'Hãm'}`}
    >
      {sao.amDuong}{sao.ten} ({sao.trangThai})
    </span>
  );
}

// Component hiển thị sao phụ
function SaoPhuItem({ sao }) {
  const color = SAO_PHU_COLOR[sao.loai] || SAO_PHU_COLOR.default;
  return (
    <span className="sao-phu" style={{ color }} title={sao.ten}>
      {sao.ten}{sao.trangThai && sao.trangThai !== 'B' ? ` (${sao.trangThai})` : ''}
    </span>
  );
}

// Component hiển thị Hóa tinh
function HoaTinhItem({ hoa, prefix = '' }) {
  const style = HOA_TINH_STYLE[hoa.loai] || { color: '#555', label: hoa.ten };
  return (
    <div className="hoa-tinh-row" style={{ color: style.color }}>
      {prefix && <span className="hoa-prefix">{prefix}</span>}
      <span className="hoa-ten">{hoa.ten}</span>
      {hoa.cung && <span className="hoa-cung"> - {hoa.cung}</span>}
    </div>
  );
}

// Component một ô cung trong lưới
function CungCard({ cung, gridPos, isActive, onMouseEnter, onMouseLeave }) {
  // Backward compatibility: support both old format (name, rating, label) and new format (saoChinhList, etc.)
  const hasNewFormat = cung.saoChinhList !== undefined;
  const diaChiList = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];
  const canChiChars = ['M', 'K', 'C', 'T', 'N', 'Q', 'G', 'Ấ', 'B', 'Đ', 'M', 'K'];
  // For old format: generate basic can-chi from grid position
  const fallbackCanChi = cung.canChi || `${canChiChars[gridPos] || ''}.${diaChiList[gridPos] || ''}`;
  const fallbackDaiHan = cung.daiHan || (gridPos * 10 + 6);

  return (
    <div
      className={`cung-card pos-${gridPos}${isActive ? ' cung-hovered' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header: Can-Chi | Tên cung | Đại hạn */}
      <div className="cung-card-header">
        <div className="cung-top-left">
          <span className="cung-canchhi-text">{fallbackCanChi}</span>
          {cung.hanhDisplay && (
            <span className="cung-hanh" style={{ color: cung.hanhColor }}>
              {cung.hanhDisplay}
            </span>
          )}
        </div>
        <div className="cung-top-center">
          <div className="cung-name">{cung.name ? cung.name.toUpperCase() : ''}</div>
        </div>
        <div className="cung-top-right">
          <div className="cung-daihan">{fallbackDaiHan}</div>
          {cung.thangHan && <div className="cung-thanghan">Th.{cung.thangHan}</div>}
        </div>
      </div>

      {/* Sao chính (new format) */}
      {hasNewFormat ? (
        <div className="cung-sao-chinh-area">
          {cung.saoChinhList && cung.saoChinhList.length > 0 ? (
            cung.saoChinhList.map((sao, idx) => (
              <SaoChinhItem key={idx} sao={sao} />
            ))
          ) : (
            <span className="cung-no-star">—</span>
          )}
        </div>
      ) : (
        /* Old format: show rating label as star info */
        <div className="cung-sao-chinh-area">
          {cung.label ? (
            <span className="sao-chinh sao-binh" style={{ color: cung.labelColor || '#555' }}>
              {cung.label}
            </span>
          ) : (
            <span className="cung-no-star">—</span>
          )}
        </div>
      )}

      {/* Sao phụ (new format only) */}
      {hasNewFormat && cung.saoPhuList && cung.saoPhuList.length > 0 && (
        <div className="cung-sao-phu-area">
          <div className="sao-phu-cols">
            <div className="sao-col">
              {cung.saoPhuList.slice(0, Math.ceil(cung.saoPhuList.length / 2)).map((sao, idx) => (
                <SaoPhuItem key={idx} sao={sao} />
              ))}
            </div>
            <div className="sao-col">
              {cung.saoPhuList.slice(Math.ceil(cung.saoPhuList.length / 2)).map((sao, idx) => (
                <SaoPhuItem key={idx} sao={sao} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hóa tinh năm sinh (new format only) */}
      {hasNewFormat && cung.hoaTinhList && cung.hoaTinhList.length > 0 && (
        <div className="cung-hoa-tinh-area">
          {cung.hoaTinhList.map((hoa, idx) => (
            <HoaTinhItem key={idx} hoa={hoa} />
          ))}
        </div>
      )}

      {/* Hóa tinh năm xem (new format only) */}
      {hasNewFormat && cung.namXemHoaTinh && cung.namXemHoaTinh.length > 0 && (
        <div className="cung-namxem-hoa-area">
          {cung.namXemHoaTinh.map((hoa, idx) => (
            <HoaTinhItem key={idx} hoa={hoa} />
          ))}
        </div>
      )}

      {/* Old format: show interpretation if available */}
      {!hasNewFormat && cung.interpretation && (
        <div className="cung-old-interp">
          <span style={{ fontSize: '0.65rem', color: '#777', display: 'block', marginTop: 'auto' }}>
            {cung.interpretation.slice(0, 60)}...
          </span>
        </div>
      )}
    </div>
  );
}

// ===================== SIDEBAR FORM =====================
function SidebarForm({ result }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: result?.hoTen || '',
    ngaySinh: result?.ngaySinh || 1,
    thangSinh: result?.thangSinh || 1,
    namSinh: result?.namSinh || 2000,
    gioSinh: result?.gioSinh || '17-19',
    gioiTinh: result?.gioiTinh || 'nam',
    isLunar: result?.isLunar || false,
  });
  const [namXem, setNamXem] = useState(result?.namXem || new Date().getFullYear());
  const [thangXem, setThangXem] = useState(result?.thangXem || new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  const GIO_SINH = [
    { value: '23-1', label: 'Tý (23:00-01:00)' },
    { value: '1-3', label: 'Sửu (01:00-03:00)' },
    { value: '3-5', label: 'Dần (03:00-05:00)' },
    { value: '5-7', label: 'Mão (05:00-07:00)' },
    { value: '7-9', label: 'Thìn (07:00-09:00)' },
    { value: '9-11', label: 'Tỵ (09:00-11:00)' },
    { value: '11-13', label: 'Ngọ (11:00-13:00)' },
    { value: '13-15', label: 'Mùi (13:00-15:00)' },
    { value: '15-17', label: 'Thân (15:00-17:00)' },
    { value: '17-19', label: 'Dậu (17:00-19:00)' },
    { value: '19-21', label: 'Tuất (19:00-21:00)' },
    { value: '21-23', label: 'Hợi (21:00-23:00)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tuvi/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, namXem, thangXem }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/ket-qua', { state: data.data });
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-widget form-widget">
      <div className="widget-header">Lập lá số tử vi</div>
      <div className="widget-content">
        <form onSubmit={handleSubmit}>
          {/* Năm xem điều chỉnh */}
          <div className="namxem-control">
            <button type="button" className="namxem-btn" onClick={() => setNamXem(v => v - 1)}>−</button>
            <span className="namxem-display">Năm {namXem}</span>
            <button type="button" className="namxem-btn" onClick={() => setNamXem(v => v + 1)}>+</button>
          </div>
          <div className="thangxem-control">
            <button type="button" className="thangxem-btn" onClick={() => setThangXem(v => v <= 1 ? 12 : v - 1)}>−</button>
            <span className="thangxem-display">Tháng {thangXem}</span>
            <button type="button" className="thangxem-btn" onClick={() => setThangXem(v => v >= 12 ? 1 : v + 1)}>+</button>
          </div>

          <div className="sidebar-divider" />

          {/* Lá số đã tạo thông tin */}
          {result && (
            <div className="la-so-info-mini">
              <div className="la-so-info-row">
                <span className="lsi-label">Họ tên:</span>
                <span className="lsi-val">{result.hoTen}</span>
              </div>
              <div className="la-so-info-row">
                <span className="lsi-label">Năm sinh:</span>
                <span className="lsi-val">{result.namSinh} · {result.canChi}</span>
              </div>
              <div className="la-so-info-row">
                <span className="lsi-label">Con giáp:</span>
                <span className="lsi-val">{result.conGiap?.emoji} {result.conGiap?.name}</span>
              </div>
              <div className="la-so-info-row" style={{ color: '#b71c1c', fontWeight: 600 }}>
                <span className="lsi-label">Tuổi {result.namXem}:</span>
                <span className="lsi-val">{result.tuoi} tuổi</span>
              </div>
            </div>
          )}

          <div className="sidebar-divider" />

          {/* Form nhập thông tin */}
          <div className="form-group">
            <label>Họ Tên</label>
            <input
              type="text"
              value={formData.hoTen}
              onChange={e => setFormData(p => ({ ...p, hoTen: e.target.value }))}
              placeholder="Nhập họ tên..."
              required
            />
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <div className="date-inputs">
              <select
                value={formData.ngaySinh}
                onChange={e => setFormData(p => ({ ...p, ngaySinh: e.target.value }))}
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                value={formData.thangSinh}
                onChange={e => setFormData(p => ({ ...p, thangSinh: e.target.value }))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
              <input
                type="number"
                value={formData.namSinh}
                onChange={e => setFormData(p => ({ ...p, namSinh: e.target.value }))}
                min="1920"
                max="2030"
                style={{ width: '70px' }}
              />
            </div>
          </div>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="sb-cal"
                checked={!formData.isLunar}
                onChange={() => setFormData(p => ({ ...p, isLunar: false }))}
              />
              &nbsp;Lịch dương
            </label>
            <label>
              <input
                type="radio"
                name="sb-cal"
                checked={formData.isLunar}
                onChange={() => setFormData(p => ({ ...p, isLunar: true }))}
              />
              &nbsp;Lịch âm
            </label>
          </div>

          <div className="form-group">
            <label>Giờ sinh</label>
            <select
              value={formData.gioSinh}
              onChange={e => setFormData(p => ({ ...p, gioSinh: e.target.value }))}
            >
              {GIO_SINH.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="sb-gender"
                  value="nam"
                  checked={formData.gioiTinh === 'nam'}
                  onChange={e => setFormData(p => ({ ...p, gioiTinh: e.target.value }))}
                />
                &nbsp;Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="sb-gender"
                  value="nu"
                  checked={formData.gioiTinh === 'nu'}
                  onChange={e => setFormData(p => ({ ...p, gioiTinh: e.target.value }))}
                />
                &nbsp;Nữ
              </label>
            </div>
          </div>

          <div className="form-group double">
            <div>
              <label>Năm xem</label>
              <input
                type="number"
                value={namXem}
                onChange={e => setNamXem(parseInt(e.target.value))}
                min="2020"
                max="2035"
              />
            </div>
            <div>
              <label>Tháng xem (ÂL)</label>
              <select
                value={thangXem}
                onChange={e => setThangXem(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit-form" disabled={loading}>
            {loading ? 'Đang tính...' : 'LẬP LÁ SỐ'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
export default function TuViResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [hoveredCung, setHoveredCung] = useState(null);
  const [activeSection, setActiveSection] = useState('tong-quan');

  useEffect(() => {
    const lasoId = searchParams.get('id');

    if (location.state && location.state.cungResults) {
      setResult(location.state);
      window.scrollTo(0, 0);
    } else if (lasoId) {
      fetch(`${API_URL}/tuvi/${lasoId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setResult(data.data);
          else navigate('/xem-tu-vi');
        })
        .catch(() => navigate('/xem-tu-vi'));
      window.scrollTo(0, 0);
    } else {
      navigate('/xem-tu-vi');
    }
  }, [location.state, searchParams, navigate]);

  if (!result) {
    return (
      <div className="result-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>Đang tải lá số...</p>
        </div>
      </div>
    );
  }

  // Tìm cung Mệnh để highlight mặc định
  const menhIndex = result.cungResults?.findIndex(c => c.name && c.name.trim().toLowerCase() === 'mệnh');
  const activeCung = hoveredCung !== null ? hoveredCung : (menhIndex !== -1 ? menhIndex : 0);

  const namXemDisplay = result.namXemCanChi || `${result.namXem}`;

  const handlePrint = () => window.print();
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Lá số tử vi - ${result.hoTen}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link lá số!');
    }
  };

  return (
    <div className="result-page">
      <div className="tuvi-result-container">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <Link to="/" className="bc-link">Trang chủ</Link>
          <span className="bc-sep">›</span>
          <Link to="/xem-tu-vi" className="bc-link">Xem tử vi</Link>
          <span className="bc-sep">›</span>
          <span className="bc-current">Lá số tử vi</span>
        </div>

        <div className="tuvi-result-layout">
          {/* ================== MAIN CONTENT ================== */}
          <div className="main-content">

            {/* ===== EXPERT SECTION ===== */}
            <div className="expert-section">
              <div className="expert-header">
                <h2>》Nhận xét lá số!</h2>
              </div>
              <div className="expert-content">
                <p>
                  Cung <strong>Tài Bạch, Phúc Đức, Quan Lộc</strong> của quý tín chủ đang có nhiều sao đóng,
                  có thể tín chủ sắp gặp vận hạn về <strong>Tài vận, kinh tế, Phúc khí tổ tiên, Công danh sự nghiệp</strong>.
                </p>
                <p>
                  Để được luận giải miễn phí từ cộng đồng, vui lòng đăng lá số lên nhóm{' '}
                  <a href="#" style={{ color: '#1565c0' }}>TỬ VI LÝ SỐ - Luận Giải Miễn Phí</a>
                </p>

                <div className="expert-actions">
                  <button className="btn-download" onClick={handlePrint}>📥 Tải lá số</button>
                  <button className="btn-facebook">👥 Mở nhóm Facebook</button>
                </div>

                <div className="expert-profile">
                  <div className="expert-avatar">
                    <img
                      src="https://tuvi.vn/images/thay-nguyen-the-anh.png"
                      alt="Thầy Nguyễn Thế Anh"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="expert-info">
                    <h3>Thầy Nguyễn Thế Anh</h3>
                    <p>
                      Với 20 năm kinh nghiệm, là một chuyên gia tử vi nổi tiếng xuất thân từ dòng họ Nho gia
                      có truyền thống ở Thái Bình. Gia đình ông có bộ sưu tập sách cổ độc đáo và giá trị,
                      phản ánh sự am hiểu sâu sắc về thiên văn, phong thủy và dịch số của người xưa.
                    </p>
                    <div className="expert-links">
                      <a href="https://www.doisongphapluat.com/" target="_blank" rel="noreferrer">Báo đời sống pháp luật ↗</a>
                      <a href="#" target="_blank" rel="noreferrer">Báo người đưa tin ↗</a>
                    </div>
                    <p>
                      Để được <strong>luận giải chuyên sâu, tư vấn, định hướng</strong> từ thầy{' '}
                      <strong>Thế Anh</strong> của tuvi.vn, đặt lịch ngay!
                    </p>
                    <button className="btn-booking">🔥 Hot! Đặt lịch luận giải ngay!</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== ASTROLOGY BOARD ===== */}
            <div className="astrology-board-wrapper">
              <div className="astrology-board">

                {result.cungResults.map((cung, i) => (
                  <CungCard
                    key={i}
                    cung={cung}
                    gridPos={i}
                    isActive={activeCung === i}
                    onMouseEnter={() => setHoveredCung(i)}
                    onMouseLeave={() => setHoveredCung(null)}
                  />
                ))}

                {/* Center Info Panel */}
                <div className="astrology-center">
                  <ParticleBackground />
                  <div className="astrology-center-content">
                    <div className="center-top-text">
                      <div className="center-brand">TRANG TỬ VI CỔ HỌC HÀNG ĐẦU VIỆT NAM</div>
                      <a href="https://tuvi.vn" className="center-link" target="_blank" rel="noreferrer">https://tuvi.vn</a>
                      <div className="center-contact">Đặt lịch luận giải qua Hotline/Zalo:</div>
                      <div className="center-phone">0969.975.886</div>
                    </div>

                    <h1 className="center-main-title">Lá Số Tử Vi</h1>

                    <div className="center-info-table">
                      <div className="info-row">
                        <span className="info-label">Họ tên:</span>
                        <span className="info-value name-highlight">{result.hoTen}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Năm:</span>
                        <span className="info-value">{result.namSinh} · {result.canChi}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tháng:</span>
                        <span className="info-value">{result.thangSinh} ({result.isLunar ? 'Âm' : 'Dương'})</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Ngày:</span>
                        <span className="info-value">{result.ngaySinh}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Giờ:</span>
                        <span className="info-value">Giờ {result.gioChiName} ({result.gioHour})</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Năm xem:</span>
                        <span className="info-value" style={{ color: '#b71c1c', fontWeight: 600 }}>
                          {namXemDisplay}{result.tuoi ? `, ${result.tuoi} tuổi` : ''}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Âm dương:</span>
                        <span className="info-value">{result.amDuong || (result.gioiTinh === 'nam' ? 'Dương Nam' : 'Âm Nữ')}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Bản mệnh:</span>
                        <span className="info-value">{result.napAm} - {result.cuc?.name}</span>
                      </div>
                      {result.canXuong && (
                        <div className="info-row">
                          <span className="info-label">Cân lượng:</span>
                          <span className="info-value">{result.canXuong}</span>
                        </div>
                      )}
                      {result.chuMenh && (
                        <div className="info-row">
                          <span className="info-label">Chủ mệnh:</span>
                          <span className="info-value" style={{ color: '#b71c1c' }}>{result.chuMenh}</span>
                        </div>
                      )}
                      {result.chuThan && (
                        <div className="info-row">
                          <span className="info-label">Chủ thân:</span>
                          <span className="info-value" style={{ color: '#b71c1c' }}>{result.chuThan}</span>
                        </div>
                      )}
                      {result.laiNhanCung && (
                        <div className="info-row">
                          <span className="info-label">Lai nhân:</span>
                          <span className="info-value">{result.laiNhanCung}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 12 Zodiac labels */}
                  <div className="center-zodiac-labels">
                    <span className="zodiac-label zl-ty">Tỵ</span>
                    <span className="zodiac-label zl-ngo">Ngọ</span>
                    <span className="zodiac-label zl-mui">Mùi</span>
                    <span className="zodiac-label zl-than">Thân</span>
                    <span className="zodiac-label zl-dau">Dậu</span>
                    <span className="zodiac-label zl-tuat">Tuất</span>
                    <span className="zodiac-label zl-hoi">Hợi</span>
                    <span className="zodiac-label zl-ti">Tý</span>
                    <span className="zodiac-label zl-suu">Sửu</span>
                    <span className="zodiac-label zl-dan">Dần</span>
                    <span className="zodiac-label zl-mao">Mão</span>
                    <span className="zodiac-label zl-thin">Thìn</span>
                  </div>

                  <CungChieuOverlay hoveredCung={activeCung} />
                </div>
              </div>

              {/* BẢNG CHÚ GIẢI */}
              <div className="astrology-legend">
                <div className="legend-status">
                  <strong>M</strong>:Miếu&nbsp;
                  <strong>V</strong>:Vượng&nbsp;
                  <strong>Đ</strong>:Đắc&nbsp;
                  <strong>B</strong>:Bình hòa&nbsp;
                  <strong>H</strong>:Hãm
                </div>
                <div className="legend-colors">
                  <span className="color-box kim"></span> Kim
                  <span className="color-box moc"></span> Mộc
                  <span className="color-box thuy"></span> Thủy
                  <span className="color-box hoa"></span> Hỏa
                  <span className="color-box tho"></span> Thổ
                </div>
                <div className="legend-hoa">
                  <span style={{ color: HOA_TINH_STYLE['hoa-loc'].color }}>■</span> Lộc&nbsp;
                  <span style={{ color: HOA_TINH_STYLE['hoa-quyen'].color }}>■</span> Quyền&nbsp;
                  <span style={{ color: HOA_TINH_STYLE['hoa-khoa'].color }}>■</span> Khoa&nbsp;
                  <span style={{ color: HOA_TINH_STYLE['hoa-ky'].color }}>■</span> Kỵ
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="board-actions">
              <p><em>Lưu ý: bấm vào các cung trên lá số để xem luận giải chi tiết. Nhấn giữ vào lá số để lưu ảnh.</em></p>
              <div className="action-buttons">
                <button className="btn-ai">
                  Xem tử vi bằng AI <span className="hot-badge">Hot!</span>
                </button>
                <button className="btn-action" onClick={() => document.documentElement.requestFullscreen?.()}>⛶ Toàn màn hình</button>
                <button className="btn-action" onClick={handlePrint}>🖨 In lá số</button>
                <button className="btn-action btn-blue" onClick={handleShare}>🔗 Chia sẻ</button>
              </div>
            </div>

            {/* KHÁM PHÁ THÊM */}
            <div className="explore-more">
              <h3>Khám phá thêm</h3>
              <div className="explore-item">Cân xương tính số <span>›</span></div>
              <div className="explore-item">Xem ngay cưới <span>›</span></div>
              <div className="explore-item">Tử vi con giáp <span>›</span></div>
            </div>

            {/* GỢI Ý */}
            <div className="section-block">
              <div className="section-header">Gợi ý</div>
              <div className="tags-list">
                {['Công danh sự nghiệp','Anh em, bạn bè','Con cái','Tình duyên','Vợ chồng','Tài vận, kinh tế','Sức khỏe, bệnh tật','Xuất ngoại','Bằng hữu, đồng nghiệp','Phúc khí tổ tiên','Cha mẹ','Nhà cửa, đất đai','Đại vận','Tiểu vận'].map(tag => (
                  <span key={tag} className="tag" onClick={() => setActiveSection(tag.toLowerCase())}>{tag}</span>
                ))}
              </div>
            </div>

            {/* BÌNH GIẢI TỔNG QUAN */}
            <div className="section-block" id="binh-giai">
              <div className="section-header">Bình giải tổng quan</div>
              <div className="section-content">
                {result.tenCungThan && (
                  <>
                    <h4>Cung Thân đồng cung với cung {result.tenCungThan}</h4>
                    <p>
                      Thân nhập vào {result.tenCungThan === 'Thiên Di' ? 'không gian xã hội hoạt động, là giao du rộng, thích ứng được với hoàn cảnh nhiều biến động, mệnh vận một đời nhiều thay đổi lớn, thân tâm khá bận rộn vất vả, khó được thanh nhàn, ưa ra bên ngoài, đi xa chơi.' : 'cung vị đặc biệt. Thân và Mệnh tương tác, ảnh hưởng nhiều đến cuộc đời.'}
                    </p>
                    <p className="source-text">Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch</p>
                  </>
                )}
                {result.laiNhanCung && (
                  <>
                    <h4 style={{ marginTop: '1rem' }}>Lai Nhân Cung ở cung {result.laiNhanCung}</h4>
                    <p>
                      Gia đình, sản nghiệp của tổ tiên, dời nhà, dịch mã, sẽ ảnh hưởng đến cuộc đời của mệnh tạo.
                      "Lai nhân cung" ở tam phương của cung {result.laiNhanCung} là cách cục nhờ vả người khác để lập nghiệp.
                    </p>
                    <p className="source-text">Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch</p>
                  </>
                )}
                {result.canXuong && (
                  <>
                    <h4 style={{ marginTop: '1rem' }}>Cân Xương Tính Số: {result.canXuong}</h4>
                    <p>
                      Số mạng xem ra phước chẳng khinh. Tự thân tự lập rạng môn đình.
                      Tôi đòi trai gái trong ngoài đủ, kẻ dạ người vâng thật hiển vinh.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* CHI TIẾT PHÂN TÍCH TỪ DATABASE */}
            {result.detailedAnalysis && (
              <div className="detailed-analysis-container">
                <div className="section-block">
                  <div className="section-header">Đặc điểm con giáp {result.conGiap?.name} {result.conGiap?.emoji}</div>
                  <div className="section-content">
                    <div className="analysis-grid">
                      <div className="analysis-item">
                        <h5>Sắc thái {result.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}</h5>
                        <p>{result.gioiTinh === 'nam' ? result.detailedAnalysis.sacThai?.nam : result.detailedAnalysis.sacThai?.nu}</p>
                      </div>
                      <div className="analysis-item">
                        <h5>Tính cách</h5>
                        <p>{result.detailedAnalysis.tinhCach}</p>
                      </div>
                    </div>

                    <div className="strengths-weaknesses">
                      <div className="sw-box strength">
                        <h5>✅ Điểm mạnh</h5>
                        <ul>
                          {result.detailedAnalysis.diemManh?.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="sw-box weakness">
                        <h5>⚠️ Điểm yếu</h5>
                        <ul>
                          {result.detailedAnalysis.diemYeu?.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="section-block">
                  <div className="section-header">Luận giải chi tiết</div>
                  <div className="section-content">
                    {result.detailedAnalysis.suNghiep && (
                      <div className="detail-item">
                        <h4>🚀 Sự nghiệp</h4>
                        <p><strong>Phù hợp:</strong> {result.detailedAnalysis.suNghiep.phu_hop?.join(', ')}</p>
                        <p>{result.detailedAnalysis.suNghiep.luan_giai}</p>
                      </div>
                    )}
                    {result.detailedAnalysis.tinhCam && (
                      <div className="detail-item">
                        <h4>❤️ Tình cảm</h4>
                        <p><strong>Đặc điểm:</strong> {result.detailedAnalysis.tinhCam.dac_diem}</p>
                        <p>{result.detailedAnalysis.tinhCam.luan_giai}</p>
                      </div>
                    )}
                    {result.detailedAnalysis.sucKhoe && (
                      <div className="detail-item">
                        <h4>🏥 Sức khỏe</h4>
                        <p>{result.detailedAnalysis.sucKhoe}</p>
                      </div>
                    )}
                    {result.detailedAnalysis.taiLoc && (
                      <div className="detail-item">
                        <h4>💰 Tài lộc</h4>
                        <p>{result.detailedAnalysis.taiLoc}</p>
                      </div>
                    )}
                  </div>
                </div>

                {result.detailedAnalysis.soMayMan && (
                  <div className="section-block">
                    <div className="section-header">Vận hạn & May mắn</div>
                    <div className="section-content">
                      <div className="luck-grid">
                        <div className="luck-card">
                          <h5>Số may mắn</h5>
                          <div className="luck-values">
                            {result.detailedAnalysis.soMayMan?.map(n => <span key={n} className="luck-tag">{n}</span>)}
                          </div>
                        </div>
                        <div className="luck-card">
                          <h5>Màu may mắn</h5>
                          <div className="luck-values">
                            {result.detailedAnalysis.mauMayMan?.map(c => <span key={c} className="luck-tag">{c}</span>)}
                          </div>
                        </div>
                      </div>
                      {result.detailedAnalysis.namTot && (
                        <div className="luck-years">
                          <h5>Năm tốt:</h5>
                          <p>{result.detailedAnalysis.namTot.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {result.detailedAnalysis.vanHan2026 && (
                  <div className="section-block van-han-2026">
                    <div className="section-header">Vận hạn năm {result.namXem || 2026}</div>
                    <div className="section-content">
                      <p className="overview"><em>{result.detailedAnalysis.vanHan2026.tong_quan}</em></p>
                      <div className="van-han-list">
                        <div className="vh-item"><strong>Tiền tài:</strong> {result.detailedAnalysis.vanHan2026.tien_tai}</div>
                        <div className="vh-item"><strong>Sự nghiệp:</strong> {result.detailedAnalysis.vanHan2026.su_nghiep}</div>
                        <div className="vh-item"><strong>Tình cảm:</strong> {result.detailedAnalysis.vanHan2026.tinh_cam}</div>
                        <div className="vh-item"><strong>Sức khỏe:</strong> {result.detailedAnalysis.vanHan2026.suc_khoe}</div>
                      </div>
                      <div className="advice-box">
                        <h5>💡 Lời khuyên:</h5>
                        <p>{result.detailedAnalysis.vanHan2026.phuong_huong}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BÌNH GIẢI ĐẠI VẬN */}
            <div className="section-block" id="dai-van">
              <div className="section-header">Bình giải Đại vận</div>
              <div className="section-content">
                <h4>Đại vận {result.cuc?.value || 6} - {(result.cuc?.value || 6) + 9} tuổi (Cung {result.cungResults?.[0]?.name})</h4>
                <p>
                  Kinh doanh phát tài, mọi sự hanh thông, thường quyền hành lớn trong tay,
                  lại gặp được nhiều quý nhân phù trợ.
                </p>
                <p className="source-text">Tử vi đẩu số tân biên - Vân Đằng Thái Thứ Lang</p>
              </div>
            </div>

            {/* BÌNH GIẢI TIỂU VẬN */}
            <ContentGate requireRole="master" title="Mở Khóa Chi Tiết Đại Vận & Tiểu Vận" message="Đây là nội dung trả phí. Vui lòng nâng cấp tài khoản để xem trọn đời!">
              <div className="section-block" id="tieu-van">
                <div className="section-header">Chi tiết Tiểu vận</div>
                <div className="section-content">
                  <p><em>Chưa có luận giải</em></p>
                </div>
              </div>
            </ContentGate>

          </div>

          {/* ================== SIDEBAR ================== */}
          <div className="sidebar">
            <SidebarForm result={result} />

            <div className="sidebar-widget toc-widget">
              <div className="widget-header">Mục lục</div>
              <div className="widget-content">
                <ul className="toc-list">
                  <li onClick={() => setActiveSection('tong-quan')}>Tổng quan</li>
                  <li>
                    12 cung <span className="arrow">▾</span>
                    <ul className="toc-sub">
                      {result.cungResults?.map((c, i) => (
                        <li key={i}>{c.name}</li>
                      ))}
                    </ul>
                  </li>
                  <li onClick={() => setActiveSection('dai-van')}>Đại vận</li>
                  <li onClick={() => setActiveSection('tieu-van')}>Tiểu vận</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground/ParticleBackground.jsx';
import ContentGate from '../components/ContentGate/ContentGate.jsx';
import './TuViResult.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

/*
 * Cung Chiếu Overlay - Đường chiếu cung (tam hợp + xung chiếu)
 * Sử dụng 3 hình PNG, mỗi hình dùng cho 1 nhóm tam hợp (4 cung).
 * CSS transform (rotate/flip) được áp dụng để hiển thị đúng hướng cho mỗi cung.
 *
 * Mapping 12 cung theo vị trí grid (pos-0 = Dần, pos-1 = Mão, ..., pos-11 = Sửu):
 *   Nhóm Thân-Tý-Thìn: img01 (pos-2 Thìn, pos-6 Thân, pos-10 Tý) + đối cung
 *   Nhóm Dần-Ngọ-Tuất: img02 (pos-0 Dần, pos-4 Ngọ, pos-8 Tuất) + đối cung
 *   Nhóm Tỵ-Dậu-Sửu:  img03 (pos-3 Tỵ, pos-7 Dậu, pos-11 Sửu) + đối cung
 *   Nhóm Hợi-Mão-Mùi:  img03 flipped (pos-1 Mão, pos-5 Mùi, pos-9 Hợi) + đối cung
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

function StarRating({ rating }) {
  return (
    <div className="cung-card-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function TuViResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [expandedCungs, setExpandedCungs] = useState({});
  const [hoveredCung, setHoveredCung] = useState(null);

  useEffect(() => {
    const lasoId = searchParams.get('id');
    
    if (location.state && location.state.cungResults) {
      // Data passed directly from XemTuVi via API response
      setResult(location.state);
      window.scrollTo(0, 0);
    } else if (lasoId) {
      // Load saved lá số by ID (from history page)
      fetch(`${API_URL}/tuvi/${lasoId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setResult(data.data);
          } else {
            navigate('/xem-tu-vi');
          }
        })
        .catch(() => navigate('/xem-tu-vi'));
      window.scrollTo(0, 0);
    } else {
      navigate('/xem-tu-vi');
    }
  }, [location.state, searchParams, navigate]);

  const toggleCung = (index) => {
    setExpandedCungs(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!result) {
    return (
      <div className="result-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  const menhIndex = result.cungResults.findIndex(c => c.name && c.name.trim().toLowerCase() === 'mệnh');
  const activeCung = hoveredCung !== null ? hoveredCung : (menhIndex !== -1 ? menhIndex : 0);

  return (
    <div className="result-page">
      <div className="tuvi-result-container">
        
        {/* LẼ RA CÓ BREADCRUMB Ở ĐÂY */}
        <div className="breadcrumb">
          Trang chủ / Xem tử vi / Lá số tử vi
        </div>

        <div className="tuvi-result-layout">
          {/* MAIN CONTENT (LEFT) */}
          <div className="main-content">
            
            {/* THẦY NGUYỄN THẾ ANH SECTION */}
            <div className="expert-section">
              <div className="expert-header">
                <h2>》Nhận xét lá số!</h2>
              </div>
              <div className="expert-content">
                <p>Cung <strong>Tài Bạch, Phúc Đức, Quan Lộc</strong> của quý tín chủ đang có nhiều sao xấu đóng, có thể tín chủ sắp gặp nhiều hạn về <strong>Tài vận, kinh tế, Phúc khí tổ tiên, Công danh sự nghiệp</strong> của mình.</p>
                <p>Để được luận giải miễn phí từ cộng đồng, vui lòng đăng lá số lên nhóm <a href="#">TỬ VI LÝ SỐ - Luận Giải Miễn Phí</a></p>
                
                <div className="expert-actions">
                  <button className="btn-download">📥 Tải lá số</button>
                  <button className="btn-facebook">👥 Mở nhóm Facebook</button>
                </div>

                <div className="expert-profile">
                  <div className="expert-avatar">
                    <img src="https://tuvi.vn/images/thay-nguyen-the-anh.png" alt="Thầy Nguyễn Thế Anh" onError={(e) => {e.target.style.display='none'}} />
                  </div>
                  <div className="expert-info">
                    <h3>Thầy Nguyễn Thế Anh</h3>
                    <p>Với 20 năm kinh nghiệm, là một chuyên gia tử vi nổi tiếng xuất thân từ dòng họ Nho gia có truyền thống ở Thái Bình. Gia đình ông có bộ sưu tập sách cổ độc đáo và giá trị, phản ánh sự am hiểu sâu sắc về thiên văn, phong thủy và dịch số của người xưa.</p>
                    <div className="expert-links">
                      <a href="#">Báo đời sống pháp luật ↗</a>
                      <a href="#">Báo người đưa tin ↗</a>
                    </div>
                    <p>Để được <strong>luận giải chuyên sâu, tư vấn, định hướng</strong> từ thầy <strong>Thế Anh</strong> của tuvi.vn, đặt lịch ngay!</p>
                    <button className="btn-booking">Hot! Đặt lịch luận giải ngay Hot!</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ASTROLOGY BOARD */}
            <div className="astrology-board-wrapper">
              <div className="astrology-board">

                {result.cungResults.map((cung, i) => {
                  const diaChiList = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];
                  const canChiChar = ['M', 'K', 'C', 'T', 'N', 'Q', 'G', 'Đ', 'B', 'Đ', 'M', 'K'];
                  const daiHan = (result.cuc.value || 3) + (i * 10);
                  
                  return (
                    <div 
                      key={i} 
                      className={`cung-card pos-${i}${activeCung === i ? ' cung-hovered' : ''}`}
                      onMouseEnter={() => setHoveredCung(i)}
                      onMouseLeave={() => setHoveredCung(null)}
                    >
                      <div className="cung-card-header">
                        <div className="cung-top-left" style={{color: '#757575'}}>{canChiChar[i]}.{diaChiList[i]}</div>
                        <div className="cung-top-center">
                          <div className="cung-name">{cung.name.toUpperCase()}</div>
                        </div>
                        <div className="cung-top-right">{daiHan}</div>
                      </div>
                      <div className="cung-main-star">
                        <span className="star-good">
                          {i % 3 === 0 ? 'Thái Dương (V)' : i % 3 === 1 ? 'Thiên Cơ (Đ)' : 'Tử Vi (M)'}
                        </span>
                      </div>
                      <div className="cung-stars-list">
                        <div className="star-col">
                          <div className="star-bad">{i % 2 === 0 ? 'Thiên Khôi' : 'Đà La (H)'}</div>
                          <div className="star-good">{i % 2 !== 0 ? 'Hóa Lộc' : 'Hóa Quyền'}</div>
                        </div>
                        <div className="star-col">
                          <div className="star-bad">{i % 3 === 0 ? 'Linh Tinh (H)' : 'Địa Không'}</div>
                          <div className="star-neutral">Thiên Mã</div>
                        </div>
                      </div>
                      <div className="cung-bottom-info">
                        <span className="cung-bottom-left" style={{color: '#d32f2f'}}>Thiếu Dương</span>
                        <span className="cung-bottom-right" style={{color: '#757575'}}>Đại Hao</span>
                      </div>
                    </div>
                  );
                })}

                {/* Center Info Panel */}
                <div className="astrology-center">
                  <ParticleBackground />
                  <div className="astrology-center-content">
                    <div className="center-top-text">
                      <div className="center-brand">TRANG TỬ VI CỔ HỌC HÀNG ĐẦU VIỆT NAM</div>
                      <a href="https://tuvi.vn" className="center-link">https://tuvi.vn</a>
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
                        <span className="info-value">{result.namSinh} - {result.canChi}</span>
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
                        <span className="info-value">{result.gioSinh}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Năm xem:</span>
                        <span className="info-value">Bính Ngọ (2026)</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Âm dương:</span>
                        <span className="info-value">{result.amDuong}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Bản mệnh:</span>
                        <span className="info-value">{result.napAm} ({result.nguHanh})</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Cục:</span>
                        <span className="info-value">{result.cuc.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* 12 Zodiac labels around center border */}
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

                  {/* Đường chiếu cung tam hợp + xung chiếu - chỉ nằm trong khung giữa */}
                  <CungChieuOverlay hoveredCung={activeCung} />
                </div>
              </div>

              {/* BẢNG CHÚ GIẢI */}
              <div className="astrology-legend">
                <div className="legend-status">
                  <strong>M</strong>:Miếu <strong>V</strong>:Vượng <strong>Đ</strong>:Đắc <strong>B</strong>:Bình hòa <strong>H</strong>:Hãm
                </div>
                <div className="legend-colors">
                  <span className="color-box kim"></span> Kim
                  <span className="color-box moc"></span> Mộc
                  <span className="color-box thuy"></span> Thủy
                  <span className="color-box hoa"></span> Hỏa
                  <span className="color-box tho"></span> Thổ
                </div>
                <div className="legend-id">Lá số #474884</div>
              </div>
            </div>

            <div className="board-actions">
              <p><em>Lưu ý: bấm vào các cung trên lá số để xem luận giải chi tiết.</em></p>
              <div className="action-buttons">
                <button className="btn-ai">Xem tử vi bằng AI <span className="hot-badge">Hot!</span></button>
                <button className="btn-action">⛶ Toàn màn hình</button>
                <button className="btn-action">🖨 In lá số</button>
                <button className="btn-action btn-blue">🔗 Chia sẻ</button>
              </div>
            </div>

            {/* KHÁM PHÁ THÊM */}
            <div className="explore-more">
              <h3>Khám phá thêm</h3>
              <div className="explore-item">Cân xương tính số <span>›</span></div>
            </div>

            {/* GỢI Ý */}
            <div className="section-block">
              <div className="section-header">Gợi ý</div>
              <div className="tags-list">
                <span className="tag">Công danh sự nghiệp</span>
                <span className="tag">Anh em, bạn bè</span>
                <span className="tag">Con cái</span>
                <span className="tag">Tình duyên</span>
                <span className="tag">Vợ chồng</span>
                <span className="tag">Tài vận, kinh tế</span>
                <span className="tag">Sức khỏe, bệnh tật</span>
                <span className="tag">Xuất ngoại</span>
                <span className="tag">Bằng hữu, đồng nghiệp</span>
                <span className="tag">Phúc khí tổ tiên</span>
                <span className="tag">Cha mẹ</span>
                <span className="tag">Nhà cửa, đất đai</span>
                <span className="tag">Đại vận</span>
                <span className="tag">Tiểu vận</span>
              </div>
            </div>

            {/* BÌNH GIẢI TỔNG QUAN */}
            <div className="section-block">
              <div className="section-header">Bình giải tổng quan</div>
              <div className="section-content">
                <h4>Cung Thân đồng cung với cung Thiên di</h4>
                <p>Dễ bị hoàn cảnh thay đổi gây ảnh hưởng, nhà ở và nơi làm việc hay thay đổi</p>
                <p className="source-text">Trung Châu tử vi đẩu số - Tứ Hóa Phái - Nguyễn Anh Vũ dịch</p>
                <br/>
                <p>Thân nhập vào không gian xã hội hoạt động, là giao du rộng, thích ứng được với hoàn cảnh nhiều biến động, mệnh vận một đời nhiều thay đổi lớn...</p>
                <p className="source-text">Tử vi đẩu số tinh hoa tập thành - Đại Đức Sơn Nhân</p>
              </div>
            </div>

            {/* DỮ LIỆU CHI TIẾT TỪ DATABASE */}
            {result.detailedAnalysis && (
              <div className="detailed-analysis-container">
                <div className="section-block">
                  <div className="section-header">Đặc điểm con giáp {result.conGiap.name}</div>
                  <div className="section-content">
                    <div className="analysis-grid">
                      <div className="analysis-item">
                        <h5>Sắc thái {result.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}</h5>
                        <p>{result.gioiTinh === 'nam' ? result.detailedAnalysis.sacThai.nam : result.detailedAnalysis.sacThai.nu}</p>
                      </div>
                      <div className="analysis-item">
                        <h5>Tính cách</h5>
                        <p>{result.detailedAnalysis.tinhCach}</p>
                      </div>
                    </div>
                    
                    <div className="strengths-weaknesses">
                      <div className="sw-box strength">
                        <h5>Điểm mạnh</h5>
                        <ul>
                          {result.detailedAnalysis.diemManh.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="sw-box weakness">
                        <h5>Điểm yếu</h5>
                        <ul>
                          {result.detailedAnalysis.diemYeu.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="section-block">
                  <div className="section-header">Luận giải chi tiết</div>
                  <div className="section-content">
                    <div className="detail-item">
                      <h4>🚀 Sự nghiệp</h4>
                      <p><strong>Phù hợp:</strong> {result.detailedAnalysis.suNghiep.phu_hop.join(', ')}</p>
                      <p>{result.detailedAnalysis.suNghiep.luan_giai}</p>
                    </div>
                    
                    <div className="detail-item">
                      <h4>❤️ Tình cảm</h4>
                      <p><strong>Đặc điểm:</strong> {result.detailedAnalysis.tinhCam.dac_diem}</p>
                      <p>{result.detailedAnalysis.tinhCam.luan_giai}</p>
                    </div>

                    <div className="detail-item">
                      <h4>🏥 Sức khỏe</h4>
                      <p>{result.detailedAnalysis.sucKhoe}</p>
                    </div>

                    <div className="detail-item">
                      <h4>💰 Tài lộc</h4>
                      <p>{result.detailedAnalysis.taiLoc}</p>
                    </div>
                  </div>
                </div>

                <div className="section-block">
                  <div className="section-header">Vận hạn & May mắn</div>
                  <div className="section-content">
                    <div className="luck-grid">
                      <div className="luck-card">
                        <h5>Số may mắn</h5>
                        <div className="luck-values">
                          {result.detailedAnalysis.soMayMan.map(n => <span key={n} className="luck-tag">{n}</span>)}
                        </div>
                      </div>
                      <div className="luck-card">
                        <h5>Màu may mắn</h5>
                        <div className="luck-values">
                          {result.detailedAnalysis.mauMayMan.map(c => <span key={c} className="luck-tag">{c}</span>)}
                        </div>
                      </div>
                    </div>

                    <div className="luck-years">
                      <h5>Năm tốt:</h5>
                      <p>{result.detailedAnalysis.namTot.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {result.detailedAnalysis.vanHan2026 && (
                  <div className="section-block van-han-2026">
                    <div className="section-header">Vận hạn năm 2026 (Bính Ngọ)</div>
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

            {/* CHI TIẾT ĐẠI VẬN - Cần đăng nhập & Trả phí (Coin) */}
            <ContentGate requireRole="master" title="Mở Khóa Chi Tiết Đại Vận" message="Đây là nội dung trả phí. Vui lòng sử dụng 10 Coin hoặc nâng cấp tài khoản Thầy Xem/VIP để xem trọn đời!">
              <div className="section-block">
                <div className="section-header">Chi tiết đại vận (10 năm)</div>
                <div className="section-content">
                  <h4>Đại vận 26 - 35 tuổi (Cung Phu Thê)</h4>
                  <p>Trong giai đoạn này, bản mệnh có nhiều biến chuyển về mặt tình cảm và gia đạo. Cơ hội thăng tiến trong sự nghiệp phụ thuộc nhiều vào sự hỗ trợ từ người bạn đời hoặc đối tác chiến lược.</p>
                  <ul>
                    <li><strong>Công danh:</strong> Có quý nhân phù trợ, dễ thăng tiến nếu làm việc nhóm.</li>
                    <li><strong>Tài lộc:</strong> Tiền bạc hanh thông, nhưng cần tránh đầu tư mạo hiểm.</li>
                    <li><strong>Tình duyên:</strong> Đào hoa vượng, người độc thân dễ tìm được ý trung nhân.</li>
                  </ul>
                  <br />
                  <h4>Đại vận 36 - 45 tuổi (Cung Tử Tức)</h4>
                  <p>Giai đoạn này trọng tâm chuyển hướng sang con cái và tài sản tích lũy. Sự xuất hiện của sao Hóa Lộc mang lại nhiều may mắn bất ngờ về đất đai, điền sản.</p>
                </div>
              </div>
            </ContentGate>

            {/* LUẬN GIẢI CHUYÊN SÂU - Cần VIP/Master */}
            <ContentGate requireRole="master" title="Nội dung dành cho Thầy Xem / VIP">
              <div className="section-block">
                <div className="section-header">Luận giải chuyên sâu & Hóa Giải</div>
                <div className="section-content">
                  <h4>Phân tích cách cục đặc biệt</h4>
                  <p>Bản mệnh sở hữu cách cục "Tử Phủ Vũ Tướng", đây là cách cục của người có khả năng lãnh đạo, quản lý tốt. Tuy nhiên, do sát tinh xâm phạm ở cung Quan Lộc, đường công danh có thể gặp trở ngại vào những năm Tý, Ngọ.</p>
                  
                  <h4>Phương pháp hóa giải vận hạn</h4>
                  <p>Để giảm bớt sát khí của sao Không Kiếp tại mệnh, gia chủ nên:</p>
                  <ul>
                    <li>Sử dụng vật phẩm phong thủy có ngũ hành tương sinh (như thạch anh tóc vàng, tỳ hưu ngọc).</li>
                    <li>Hạn chế xuất hành đi xa hoặc khởi sự kinh doanh lớn vào các tháng 4, 7 âm lịch.</li>
                    <li>Năng làm việc thiện, phóng sinh để tích phước báu.</li>
                  </ul>
                </div>
              </div>
            </ContentGate>
            
          </div>

          {/* SIDEBAR (RIGHT) */}
          <div className="sidebar">
            <div className="sidebar-widget form-widget">
              <div className="widget-header">Lập lá số tử vi</div>
              <div className="widget-content">
                <div className="form-group">
                  <label>Họ Tên</label>
                  <input type="text" placeholder="Nhập họ tên..." defaultValue={result.hoTen} />
                </div>
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <div className="date-inputs">
                    <select><option>1</option></select>
                    <select><option>Tháng 1</option></select>
                    <input type="text" defaultValue="2000" />
                  </div>
                </div>
                <div className="radio-group">
                  <label><input type="radio" name="cal" defaultChecked /> Lịch dương</label>
                  <label><input type="radio" name="cal" /> Lịch âm</label>
                </div>
                <div className="form-group">
                  <label>Giờ sinh</label>
                  <div className="time-inputs">
                    <select><option>GMT +7</option></select>
                    <select><option>12 Giờ</option></select>
                    <select><option>30 Phút</option></select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <div className="radio-group">
                    <label><input type="radio" name="gender" defaultChecked={result.gioiTinh==='nam'} /> Nam</label>
                    <label><input type="radio" name="gender" defaultChecked={result.gioiTinh==='nu'} /> Nữ</label>
                  </div>
                </div>
                <div className="form-group double">
                  <div>
                    <label>Năm xem</label>
                    <input type="text" defaultValue="2026" />
                  </div>
                  <div>
                    <label>Tháng xem (Âm lịch)</label>
                    <select><option>Tháng 3</option></select>
                  </div>
                </div>
                <button className="btn-submit-form">LẬP LÁ SỐ</button>
              </div>
            </div>

            <div className="sidebar-widget toc-widget">
              <div className="widget-header">Mục lục</div>
              <div className="widget-content">
                <ul className="toc-list">
                  <li>Tổng quan</li>
                  <li>12 cung <span className="arrow">▾</span></li>
                  <li>Đại vận</li>
                  <li>Tiểu vận</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

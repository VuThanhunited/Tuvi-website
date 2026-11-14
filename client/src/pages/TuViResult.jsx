import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ParticleBackground from '../components/ParticleBackground/ParticleBackground.jsx';
import './TuViResult.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

/* ── Thứ tự 12 cung hiển thị ở bảng chọn Luận giải (3 cột x 4 hàng) ── */
const CUNG_DISPLAY_ORDER = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức',
  'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch',
  'Tử Tức', 'Phu Thê', 'Huynh Đệ',
];

const CUNG_INTRO_MAP = {
  'Mệnh': 'Cung Mệnh là phần mở đầu để xem tính cách và khuynh hướng của đương số. Khi luận giải, cần đối chiếu với các cung Tài Bạch, Quan Lộc và Thiên Di.',
  'Phụ Mẫu': 'Cung Phụ Mẫu phản ánh mối quan hệ với cha mẹ, nền tảng gia phong và phúc ấm sinh thành. Khi luận giải, cần đối chiếu với các cung Tật Ách, Nô Bộc và Tử Tức.',
  'Phúc Đức': 'Cung Phúc Đức thể hiện phúc phần tổ tiên, đời sống tinh thần và sự an yên nội tâm. Khi luận giải, cần đối chiếu với các cung Tài Bạch, Phu Thê và Thiên Di.',
  'Điền Trạch': 'Cung Điền Trạch chủ về nhà cửa, đất đai, tài sản tích lũy và môi trường sống. Khi luận giải, cần đối chiếu với các cung Huynh Đệ, Tật Ách và Tử Tức.',
  'Quan Lộc': 'Cung Quan Lộc đại diện cho sự nghiệp, công danh, vị thế xã hội và định hướng nghề nghiệp. Khi luận giải, cần đối chiếu với các cung Mệnh, Tài Bạch và Phu Thê.',
  'Nô Bộc': 'Cung Nô Bộc phản ánh bạn bè, đồng nghiệp, cộng sự và các mối quan hệ xã hội. Khi luận giải, cần đối chiếu với các cung Huynh Đệ, Phụ Mẫu và Tử Tức.',
  'Thiên Di': 'Cung Thiên Di chủ về xuất ngoại, giao tiếp xã hội, khả năng thích nghi và quý nhân bên ngoài. Khi luận giải, cần đối chiếu với các cung Mệnh, Phúc Đức và Phu Thê.',
  'Tật Ách': 'Cung Tật Ách phản ánh thể chất, sức khỏe, tai ách và phương diện nội tâm ẩn giấu. Khi luận giải, cần đối chiếu với các cung Phụ Mẫu, Điền Trạch và Huynh Đệ.',
  'Tài Bạch': 'Cung Tài Bạch chủ về năng lực tài chính, nguồn thu nhập và cách quản lý tiền bạc. Khi luận giải, cần đối chiếu với các cung Mệnh, Quan Lộc và Phúc Đức.',
  'Tử Tức': 'Cung Tử Tức phản ánh đường con cái, mối liên kết thế hệ sau và khả năng truyền thừa. Khi luận giải, cần đối chiếu với các cung Điền Trạch, Nô Bộc và Phụ Mẫu.',
  'Phu Thê': 'Cung Phu Thê phản ánh nhân duyên, hôn nhân và sự hòa hợp giữa hai vợ chồng. Khi luận giải, cần đối chiếu với các cung Phúc Đức, Quan Lộc và Thiên Di.',
  'Huynh Đệ': 'Cung Huynh Đệ chủ về anh chị em trong gia đình, bạn đồng hành thân cận. Khi luận giải, cần đối chiếu với các cung Điền Trạch, Nô Bộc và Tật Ách.',
};

/* ── Lá số mẫu mặc định khi mở trực tiếp /ket-qua hoặc chưa lập lá số ── */
const DEFAULT_MOCK_RESULT = {
  _isMockDefault: true,
  hoTen: 'Lá số Tử Vi',
  gioiTinh: 'nam',
  ngaySinh: 15,
  thangSinh: 8,
  namSinh: 1995,
  gioSinh: '11-13',
  namXem: 2026,
  cungResults: [
    { name: 'Mệnh',       gridIdx: 3,  diaChi: 'Tỵ',   bienCode: 'x1',  cungCode: 'MENH',       isMenh: true,  saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Phụ Mẫu',    gridIdx: 4,  diaChi: 'Ngọ',  bienCode: 'x2',  cungCode: 'PHU_MAU',    isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Phúc Đức',   gridIdx: 5,  diaChi: 'Mùi',  bienCode: 'x3',  cungCode: 'PHUC_DUC',   isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Điền Trạch', gridIdx: 6,  diaChi: 'Thân', bienCode: 'x4',  cungCode: 'DIEN_TRACH', isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Quan Lộc',   gridIdx: 7,  diaChi: 'Dậu',  bienCode: 'x5',  cungCode: 'QUAN_LOC',   isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Nô Bộc',     gridIdx: 8,  diaChi: 'Tuất', bienCode: 'x6',  cungCode: 'NO_BOC',     isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Thiên Di',   gridIdx: 9,  diaChi: 'Hợi',  bienCode: 'x7',  cungCode: 'THIEN_DI',   isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Tật Ách',    gridIdx: 10, diaChi: 'Tý',   bienCode: 'x8',  cungCode: 'TAT_ACH',    isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Tài Bạch',   gridIdx: 11, diaChi: 'Sửu',  bienCode: 'x9',  cungCode: 'TAI_BACH',   isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Tử Tức',     gridIdx: 0,  diaChi: 'Dần',  bienCode: 'x10', cungCode: 'TU_TUC',     isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Huynh Đệ',   gridIdx: 1,  diaChi: 'Mão',  bienCode: 'x12', cungCode: 'HUYNH_DE',   isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
    { name: 'Phu Thê',    gridIdx: 2,  diaChi: 'Thìn', bienCode: 'x11', cungCode: 'PHU_THE',    isMenh: false, saoChinhList: [], saoPhuList: [], hoaTinhList: [] },
  ],
  quanTuViResults: [],
};

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

/* ── Icon hoa sen vàng ── */
function LotusIcon() {
  return (
    <svg className="lotus-svg" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 3C15.5 8 14.5 13 18 19C21.5 13 20.5 8 18 3Z" stroke="#f5d27b" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 19C12 16 9.5 11.5 10.5 6.5C13.5 9.5 16 13.5 18 19Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 19C24 16 26.5 11.5 25.5 6.5C22.5 9.5 20 13.5 18 19Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 20C10.5 20 6 16.5 4.5 11.5C9.5 13 13.5 15.5 18 20Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 20C25.5 20 30 16.5 31.5 11.5C26.5 13 22.5 15.5 18 20Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 22.5C13 21 23 21 28 22.5" stroke="#f5d27b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Họa tiết góc cổ điển cho khung Quán Tử Vi ── */
function GreekKeyCorner({ className }) {
  return (
    <svg className={`corner-key-svg ${className}`} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M2 26V2H26M2 10H18V18H10V13.5H14"
        stroke="#c99b49"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/* ── Biểu tượng Âm Dương vàng ── */
function GoldYinYangSvg({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="center-yinyang-svg">
      <defs>
        <linearGradient id="qtvGoldYin" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3cd69" />
          <stop offset="50%" stopColor="#d19a33" />
          <stop offset="100%" stopColor="#b07619" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="#fffdf6" stroke="#d5ab54" strokeWidth="2" />
      <path d="M24 3A21 21 0 0 1 24 45A10.5 10.5 0 0 1 24 24A10.5 10.5 0 0 0 24 3Z" fill="url(#qtvGoldYin)" />
      <circle cx="24" cy="13.5" r="3.2" fill="url(#qtvGoldYin)" />
      <circle cx="24" cy="34.5" r="3.2" fill="#fffdf6" />
    </svg>
  );
}

/* ── Phân loại Cát tinh (xanh lá) / Hung tinh (đỏ) ── */
const HUNG_KEYWORDS = [
  'kình dương', 'đà la', 'hỏa tinh', 'linh tinh', 'địa không', 'địa kiếp',
  'hóa kỵ', 'thiên hình', 'thiên diêu', 'kiếp sát', 'đại hao', 'tiểu hao',
  'tuế phá', 'thiên khốc', 'thiên hư', 'cô thần', 'quả tú', 'bạch hổ',
  'tang môn', 'điếu khách', 'phá toái', 'quan phù', 'quan phủ', 'tử phù',
  'thiên la', 'địa võng', 'phục binh', 'lưu hà', 'thiên không', 'đẩu quân',
  'thiên thương', 'thiên sứ', 'bệnh phù', 'thái tuế', 'trực phù', 'tuần không', 'triệt lộ'
];

function getSaoNhomColor(sao) {
  if (sao.nhomSao === 'cat') return '#2e7d32';
  if (sao.nhomSao === 'hung') return '#d32f2f';
  const low = (sao.ten || '').toLowerCase();
  if (sao.loai === 'hoa-ky' || sao.loai === 'sat' || HUNG_KEYWORDS.some(k => low.includes(k))) {
    return '#d32f2f';
  }
  return '#2e7d32';
}

function getSaoChinhColor(trangThai) {
  switch (trangThai) {
    case 'M': return '#a31616';
    case 'V': return '#b71c1c';
    case 'Đ': return '#c25e00';
    case 'B': return '#444444';
    case 'H': return '#7a7a7a';
    default:  return '#444444';
  }
}

function SaoChinhItem({ sao }) {
  const color = getSaoChinhColor(sao.trangThai);
  const statusLabel =
    sao.trangThai === 'M' ? 'Miếu' :
    sao.trangThai === 'V' ? 'Vượng' :
    sao.trangThai === 'Đ' ? 'Đắc' :
    sao.trangThai === 'B' ? 'Bình hòa' :
    sao.trangThai === 'H' ? 'Hãm' : '';
  const isBold = sao.trangThai === 'M' || sao.trangThai === 'V';
  return (
    <span
      className="sao-chinh"
      style={{ color, fontWeight: isBold ? '700' : '600' }}
      title={statusLabel ? `${sao.ten} - ${statusLabel}` : sao.ten}
    >
      {sao.ten}{sao.trangThai ? ` (${sao.trangThai})` : ''}
    </span>
  );
}

function SaoPhuItem({ sao }) {
  const color = getSaoNhomColor(sao);
  return (
    <span className="sao-phu" style={{ color }} title={sao.ten}>
      {sao.ten}{sao.trangThai && sao.trangThai !== 'B' ? ` (${sao.trangThai})` : ''}
    </span>
  );
}

function HoaTinhItem({ hoa }) {
  const isKy = hoa.loai === 'hoa-ky' || (hoa.ten || '').toLowerCase().includes('kỵ');
  const color = isKy ? '#d32f2f' : '#2e7d32';
  return (
    <span className="sao-phu hoa-tinh-inline" style={{ color }} title={hoa.ten}>
      {hoa.ten}
    </span>
  );
}

const GRID_DIACHI = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];

/* ── Ô cung trên lá số: Chính tinh bên TRÁI, Cát tinh (xanh lá) & Hung tinh (đỏ) bên PHẢI ── */
function CungCard({ cung, gridPos, tamPhuongBadge, isActive, isSelected, isMockDefault, onClick, onMouseEnter, onMouseLeave }) {
  const hasRealStars = !isMockDefault && (
    (cung.saoChinhList && cung.saoChinhList.length > 0) ||
    (cung.saoPhuList && cung.saoPhuList.length > 0) ||
    Boolean(cung.canChi)
  );
  const diaChiName = cung.diaChi || GRID_DIACHI[gridPos] || '';
  const canPart = cung.canChi ? cung.canChi.split('.')[0] : '';

  const rightSideStars = (cung.saoPhuList || []).filter(s => s.ten !== cung.trangSinh);
  const hoaStars = [
    ...(cung.hoaTinhList || []),
    ...(cung.namXemHoaTinh || []),
  ];

  // Chế độ xem mẫu tối giản trước khi lập lá số (giống hệt ảnh mẫu khách hàng)
  if (!hasRealStars) {
    return (
      <div
        className={`cung-card cung-card--minimal pos-${gridPos}${isActive ? ' cung-hovered' : ''}${isSelected ? ' cung-selected' : ''}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="cung-minimal-name">
          {cung.name || ''}
        </div>
        {tamPhuongBadge && (
          <span className="tam-phuong-badge" title={`Tam phương tứ chính vị trí ${tamPhuongBadge}`}>
            {tamPhuongBadge}
          </span>
        )}
      </div>
    );
  }

  const fallbackDaiHan = cung.daiHan || (gridPos * 10 + 6);

  return (
    <div
      className={`cung-card pos-${gridPos}${isActive ? ' cung-hovered' : ''}${isSelected ? ' cung-selected' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header Row: Can.Chi + Hành | Tên Cung | Đại hạn */}
      <div className="cung-card-header">
        <div className="cung-top-left">
          <span className="cung-canchhi-text">{canPart ? `${canPart}.` : ''}{diaChiName}</span>
          {cung.hanhDisplay && (
            <span className="cung-hanh" style={{ color: cung.hanhColor }}>
              {cung.hanhDisplay}
            </span>
          )}
        </div>
        <div className="cung-top-center">
          <div className={`cung-name${cung.isMenh ? ' cung-name-menh' : ''}${cung.isMinh ? ' cung-name-minh' : ''}`}>
            {cung.name ? (cung.isMinh ? `${cung.name} <Thân>` : cung.name).toUpperCase() : ''}
          </div>
        </div>
        <div className="cung-top-right">
          <div className="cung-daihan">{fallbackDaiHan}</div>
          {cung.thangHan && <div className="cung-thanghan">Th.{cung.thangHan}</div>}
        </div>
      </div>

      {/* Thân ô cung 2 cột: TRÁI = Chính tinh | PHẢI = Cát tinh (xanh lá) + Hung tinh (đỏ) */}
      <div className="cung-stars-two-col">
        <div className="cung-col-chinh">
          {cung.saoChinhList && cung.saoChinhList.length > 0 ? (
            cung.saoChinhList.map((sao, idx) => (
              <SaoChinhItem key={idx} sao={sao} />
            ))
          ) : (
            <span className="cung-vcd">Vô chính diệu</span>
          )}
        </div>

        <div className="cung-col-phu">
          {rightSideStars.map((sao, idx) => (
            <SaoPhuItem key={`phu-${idx}`} sao={sao} />
          ))}
          {hoaStars.map((hoa, idx) => (
            <HoaTinhItem key={`hoa-${idx}`} hoa={hoa} />
          ))}
        </div>
      </div>

      {/* Số đánh dấu Tam phương Tứ chính (1, 2, 3, 4) */}
      {tamPhuongBadge && (
        <span className="tam-phuong-badge" title={`Tam phương tứ chính vị trí ${tamPhuongBadge}`}>
          {tamPhuongBadge}
        </span>
      )}

      {/* Cung Footer: ĐV | Tràng Sinh | LN */}
      <div className="cung-card-footer">
        <div className="cung-bottom-left">{cung.dvLabel || ''}</div>
        <div className="cung-bottom-center">{cung.trangSinh || ''}</div>
        <div className="cung-bottom-right">{cung.lnLabel || ''}</div>
      </div>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
export default function TuViResult({ embedded = false, externalResult = null, onRequestNew = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin, token } = useAuth();

  const [result, setResult] = useState(null);
  const [hoveredGridPos, setHoveredGridPos] = useState(null);
  const [selectedCungIdx, setSelectedCungIdx] = useState(null);
  const [showBirthInfo, setShowBirthInfo] = useState(true);
  const [selectedQtvIdx, setSelectedQtvIdx] = useState(0);
  const [updatingYear, setUpdatingYear] = useState(false);

  const authToken = token || localStorage.getItem('tuvi_token');

  useEffect(() => {
    const lasoId = !embedded ? searchParams.get('id') : null;

    const applyResult = (data) => {
      setResult(data);
      const mIdx = data.cungResults?.findIndex(c => c.name && c.name.trim().toLowerCase() === 'mệnh');
      setSelectedCungIdx(mIdx !== -1 && mIdx !== undefined ? mIdx : 0);
      setSelectedQtvIdx(0);
    };

    if (externalResult && externalResult.cungResults) {
      applyResult(externalResult);
      return;
    }

    if (!embedded && location.state && location.state.cungResults) {
      applyResult(location.state);
      try {
        localStorage.setItem('last_tuvi_result', JSON.stringify(location.state));
      } catch {
        // ignore quota
      }
      window.scrollTo(0, 0);
      return;
    }

    if (lasoId) {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      fetch(`${API_URL}/tuvi/${lasoId}`, { headers })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.cungResults) {
            applyResult(data.data);
          } else {
            applyResult(DEFAULT_MOCK_RESULT);
          }
        })
        .catch(() => applyResult(DEFAULT_MOCK_RESULT));
      window.scrollTo(0, 0);
      return;
    }

    // Fallback: lấy lá số gần nhất trong localStorage, hoặc dùng lá số mẫu chuẩn mockup (không redirect)
    try {
      const cached = localStorage.getItem('last_tuvi_result');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.cungResults) && parsed.cungResults.length > 0) {
          applyResult(parsed);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    applyResult(DEFAULT_MOCK_RESULT);
  }, [embedded, externalResult, location.state, searchParams, authToken]);

  // Nếu user là admin và vào từ state/cache nhưng chưa có quanTuViResults -> fetch lại theo ID
  useEffect(() => {
    if (isAdmin && result?._id && !result._isMockDefault && !result.quanTuViResults && authToken) {
      fetch(`${API_URL}/tuvi/${result._id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.quanTuViResults) {
            setResult(prev => ({ ...prev, quanTuViResults: data.data.quanTuViResults }));
          }
        })
        .catch(() => {});
    }
  }, [isAdmin, result?._id, result?._isMockDefault, result?.quanTuViResults, authToken]);

  // Lưu lịch sử gần đây vào localStorage (chỉ lưu lá số thật)
  useEffect(() => {
    if (!result || result._isMockDefault) return;
    try {
      let list = JSON.parse(localStorage.getItem('created_horoscopes') || '[]');
      const exists = list.some(item => item.hoTen === result.hoTen && item.namSinh === result.namSinh && item.ngaySinh === result.ngaySinh);
      if (!exists) {
        const newItem = {
          id: result._id || Date.now().toString(),
          hoTen: result.hoTen,
          namSinh: result.namSinh,
          canChi: result.canChi || '',
          napAm: result.napAm || '',
          cuc: result.cuc?.name || '',
          canXuong: result.canXuong || '',
          ngaySinh: result.ngaySinh,
          thangSinh: result.thangSinh,
          gioSinh: result.gioSinh || '',
          gioiTinh: result.gioiTinh || 'nam',
          isLunar: result.isLunar || false,
          timestamp: Date.now()
        };
        list = [newItem, ...list].slice(0, 5);
        localStorage.setItem('created_horoscopes', JSON.stringify(list));
      }
    } catch {
      // ignore storage quota errors
    }
  }, [result]);

  const handleAdjustNamXem = async (delta) => {
    if (!result || result._isMockDefault || updatingYear) return;
    const nextYear = (parseInt(result.namXem, 10) || new Date().getFullYear()) + delta;
    setUpdatingYear(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers.Authorization = `Bearer ${authToken}`;
      const res = await fetch(`${API_URL}/tuvi/calculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          hoTen: result.hoTen,
          gioiTinh: result.gioiTinh,
          ngaySinh: result.ngaySinh,
          thangSinh: result.thangSinh,
          namSinh: result.namSinh,
          gioSinh: result.gioSinh,
          isLunar: result.isLunar,
          namXem: nextYear,
          thangXem: result.thangXem || 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        try {
          localStorage.setItem('last_tuvi_result', JSON.stringify(data.data));
        } catch {
          // ignore
        }
        if (embedded) {
          setResult(data.data);
        } else {
          navigate('/ket-qua', { state: data.data });
        }
      }
    } catch {
      // ignore
    } finally {
      setUpdatingYear(false);
    }
  };

  // Bản đồ nút 12 cung theo đúng thứ tự yêu cầu
  const orderedCungButtons = useMemo(() => {
    if (!result?.cungResults) return [];
    return CUNG_DISPLAY_ORDER.map((cungName) => {
      const idx = result.cungResults.findIndex(
        c => c.name && c.name.trim().toLowerCase() === cungName.toLowerCase()
      );
      return { name: cungName, idx };
    }).filter(item => item.idx !== -1);
  }, [result?.cungResults]);

  if (!result) {
    return (
      <div className={embedded ? 'result-embedded' : 'result-page'}>
        <div className="container" style={{ textAlign: 'center', paddingTop: '2.5rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ color: '#7a1618', marginTop: '1rem', fontWeight: 600 }}>Đang tải lá số...</p>
        </div>
      </div>
    );
  }

  const isMockDefault = Boolean(result._isMockDefault);
  const menhIndex = result.cungResults?.findIndex(c => c.name && c.name.trim().toLowerCase() === 'mệnh');
  const selectedCung = selectedCungIdx !== null ? result.cungResults?.[selectedCungIdx] : result.cungResults?.[menhIndex !== -1 ? menhIndex : 0];
  const fallbackGridPos = selectedCung?.gridIdx ?? (menhIndex !== -1 ? result.cungResults[menhIndex]?.gridIdx : 0) ?? 0;
  const activeGridPos = hoveredGridPos !== null ? hoveredGridPos : fallbackGridPos;

  // Khi đang xem lá số thật và hover/chọn cung, đánh số Tam phương Tứ chính 1-2-3-4
  const showTamPhuong = !isMockDefault || hoveredGridPos !== null;
  const tamPhuongMap = showTamPhuong ? {
    [activeGridPos]: 1,
    [(activeGridPos + 8) % 12]: 2,
    [(activeGridPos + 6) % 12]: 3,
    [(activeGridPos + 4) % 12]: 4,
  } : {};

  const namXemDisplay = result.namXemCanChi || `${result.namXem}`;
  const qtvList = Array.isArray(result.quanTuViResults) ? result.quanTuViResults : [];
  const activeQtv = qtvList[selectedQtvIdx] || qtvList[0] || null;

  const handlePrint = () => window.print();
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Lá số tử vi - ${result?.hoTen}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link lá số!');
    }
  };

  return (
    <div className={embedded ? 'result-embedded' : 'result-page'}>
      <div className="tuvi-result-container">
        {/* ═══ HEADER TIÊU ĐỀ KẾT QUẢ ═══ */}
        <div className="ketqua-top-bar">
          <div className="ketqua-top-spacer" />
          <div className="ketqua-title-wrap">
            <span className="ketqua-title-line ketqua-title-line--left" />
            <h1 className="ketqua-main-title">Kết quả lá số Tử Vi</h1>
            <span className="ketqua-title-line ketqua-title-line--right" />
          </div>
          <div className="ketqua-top-actions">
            {embedded && onRequestNew ? (
              <button type="button" onClick={onRequestNew} className="btn-lap-moi">
                <span aria-hidden="true">↻</span> Lập lá số mới
              </button>
            ) : (
              <Link to="/xem-tu-vi" className="btn-lap-moi">
                <span aria-hidden="true">↻</span> Lập lá số mới
              </Link>
            )}
          </div>
        </div>

        {/* ═══ KHỐI TRÊN (2 CỘT - MỌI TÀI KHOẢN ĐỀU THẤY) ═══ */}
        <div className="ketqua-main-grid">
          {/* ── CỘT TRÁI: LÁ SỐ TỬ VI ── */}
          <section className="ketqua-card card-laso">
            <div className="ketqua-card-header">
              <div className="ketqua-card-title-group">
                <LotusIcon />
                <h2>Lá số Tử Vi</h2>
              </div>
              <span className="badge-free">Miễn phí</span>
            </div>

            <div className="ketqua-card-body laso-card-body">
              <div className="astrology-board-wrapper">
                <div className="astrology-board">
                  {result.cungResults.map((cung, i) => (
                    <CungCard
                      key={i}
                      cung={cung}
                      gridPos={cung.gridIdx}
                      tamPhuongBadge={tamPhuongMap[cung.gridIdx] || null}
                      isActive={!isMockDefault && tamPhuongMap[cung.gridIdx] !== undefined}
                      isSelected={!isMockDefault && selectedCungIdx === i}
                      isMockDefault={isMockDefault}
                      onClick={() => setSelectedCungIdx(i)}
                      onMouseEnter={() => setHoveredGridPos(cung.gridIdx)}
                      onMouseLeave={() => setHoveredGridPos(null)}
                    />
                  ))}

                  {/* Thiên Bàn ở giữa */}
                  <div className="astrology-center">
                    <ParticleBackground />
                    <div className="center-medallion">
                      <div className="center-medallion-inner">
                        {isMockDefault || !showBirthInfo ? (
                          <div className="center-mock-emblem">
                            <h2 className="center-main-title center-main-title--emblem">
                              Lá số<br />Tử Vi
                            </h2>
                            <GoldYinYangSvg size={44} />
                            {!isMockDefault && (
                              <div className="yinyang-hidden-name">{result.hoTen}</div>
                            )}
                          </div>
                        ) : (
                          <div className="astrology-center-content">
                            <h2 className="center-main-title">Lá số<br />Tử Vi</h2>
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
                                <span className="info-label">Ngày:</span>
                                <span className="info-value">
                                  {result.ngaySinh}/{result.thangSinh} (Âm: {result.lunarDay || result.ngaySinh}/{result.lunarMonth || result.thangSinh})
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Giờ sinh:</span>
                                <span className="info-value">{result.gioHour || result.gioSinh}</span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Năm xem:</span>
                                <span className="info-value" style={{ color: '#a31616', fontWeight: 700 }}>
                                  {namXemDisplay}{result.tuoi ? `, ${result.tuoi}t` : ''}
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Bản mệnh:</span>
                                <span className="info-value">{result.napAm || result.nguHanh}</span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Cục:</span>
                                <span className="info-value">{result.cuc?.name || ''}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isMockDefault && (
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
                    )}

                    {!isMockDefault && <CungChieuOverlay hoveredCung={activeGridPos} />}
                  </div>
                </div>
              </div>

              {/* Thanh chú giải & thao tác chỉ hiện sau khi đã lập lá số thật */}
              {!isMockDefault && (
                <div className="laso-bottom-toolbar">
                  <div className="laso-legend-inline">
                    <span><strong>Trái:</strong> Chính tinh</span>
                    <span className="legend-dot-cat">● Cát tinh (Xanh lá)</span>
                    <span className="legend-dot-hung">● Hung tinh (Đỏ)</span>
                  </div>
                  <div className="laso-controls-row">
                    <label className="toggle-birth-label">
                      <input
                        type="checkbox"
                        checked={!showBirthInfo}
                        onChange={() => setShowBirthInfo(v => !v)}
                      />
                      <span>Ẩn thông tin sinh</span>
                    </label>
                    <div className="laso-mini-actions">
                      <button type="button" className="mini-btn" onClick={() => handleAdjustNamXem(-1)} disabled={updatingYear}>
                        −1 Năm
                      </button>
                      <button type="button" className="mini-btn" onClick={() => handleAdjustNamXem(1)} disabled={updatingYear}>
                        +1 Năm
                      </button>
                      <button type="button" className="mini-btn mini-btn-gold" onClick={handlePrint}>
                        In / Lưu
                      </button>
                      <button type="button" className="mini-btn" onClick={handleShare}>
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── CỘT PHẢI: LUẬN GIẢI LÁ SỐ ── */}
          <section className="ketqua-card card-luangiai">
            <div className="ketqua-card-header">
              <div className="ketqua-card-title-group">
                <LotusIcon />
                <h2>Luận giải lá số</h2>
              </div>
              <span className="badge-free">Miễn phí</span>
            </div>

            <div className="ketqua-card-body luangiai-card-body">
              {/* Lưới 12 nút Cung (3 cột x 4 hàng) */}
              <div className="cung-selector-grid" role="tablist" aria-label="Chọn cung luận giải">
                {orderedCungButtons.map((item) => {
                  const isActive = selectedCungIdx === item.idx;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`cung-selector-btn${isActive ? ' active' : ''}`}
                      onClick={() => setSelectedCungIdx(item.idx)}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              {/* Khung Luận giải cung đang chọn */}
              {selectedCung && (
                <div className="selected-cung-panel">
                  <div className="selected-cung-panel-header">
                    <div className="selected-cung-panel-title">
                      <span className="yinyang-mini" aria-hidden="true">☯</span>
                      <h3>Luận giải cung {selectedCung.name}</h3>
                    </div>
                    <span className="badge-sample">
                      {selectedCung.interpretation ? 'Luận giải chi tiết' : 'Nội dung mẫu'}
                    </span>
                  </div>

                  <div className="selected-cung-panel-body">
                    <p className="cung-intro-lead">
                      {CUNG_INTRO_MAP[selectedCung.name] || `Cung ${selectedCung.name} đóng tại ${selectedCung.diaChi || ''}. Khi luận giải cần đối chiếu Tam phương tứ chính.`}
                    </p>

                    <div className="gold-divider" />

                    {!isMockDefault && (
                      <>
                        <div className="cung-selected-stars-summary">
                          <div>
                            <strong>Địa chi:</strong> {selectedCung.canChi} ({selectedCung.hanhDisplay}) · <strong>Đại hạn:</strong> {selectedCung.daiHan}
                          </div>
                          <div>
                            <strong>Chính tinh:</strong>{' '}
                            {selectedCung.saoChinhList?.length
                              ? selectedCung.saoChinhList.map(s => `${s.ten}${s.trangThai ? ` (${s.trangThai})` : ''}`).join(', ')
                              : 'Vô chính diệu'}
                          </div>
                        </div>

                        {selectedCung.interpretation ? (
                          <div
                            className="cung-rich-content"
                            dangerouslySetInnerHTML={{ __html: selectedCung.interpretation }}
                          />
                        ) : (
                          <div className="cung-sample-fallback">
                            <p>
                              Cung <strong>{selectedCung.name}</strong> đang tọa tại <strong>{selectedCung.diaChi || '—'}</strong>.
                              {result.tenCungThan && selectedCung.isMinh && (
                                <> Đây cũng là vị trí <strong>Cung Thân</strong> cư {selectedCung.name}, ảnh hưởng mạnh đến hậu vận của đương số.</>
                              )}
                            </p>
                            {selectedCung.isMenh && result.menhCucRelation && (
                              <p><strong>Tương quan Mệnh - Cục:</strong> {result.menhCucRelation}. {result.canXuong ? `Cân lượng: ${result.canXuong}.` : ''}</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ═══ KHỐI DƯỚI: QUÁN TỬ VI — CHỈ HIỂN THỊ VỚI TÀI KHOẢN ADMIN ═══ */}
        {isAdmin && (
          <section className="quantuvi-admin-section" aria-label="Quán Tử Vi - Dành riêng cho Admin">
            <div className="quantuvi-header">
              <div className="quantuvi-header-icon">
                <LotusIcon />
              </div>
              <h2 className="quantuvi-header-title">QUÁN TỬ VI</h2>
              <div className="quantuvi-header-right" aria-hidden="true" />
            </div>

            <div className="quantuvi-body">
              <div className="quantuvi-ornate-frame">
                {/* 4 góc hoa văn cổ điển giống hình mẫu */}
                <GreekKeyCorner className="corner-tl" />
                <GreekKeyCorner className="corner-tr" />
                <GreekKeyCorner className="corner-bl" />
                <GreekKeyCorner className="corner-br" />

                <div className="quantuvi-two-cols">
                  {/* CỘT 1: BỘ SAO PHỐI (MỆNH TÀI QUAN DI) */}
                  <div className="quantuvi-col">
                    <div className="quantuvi-col-header">
                      Bộ sao Phối (Mệnh Tài Quan Di)
                    </div>
                    <div className="quantuvi-col-content">
                      {qtvList.length === 0 ? (
                        !isMockDefault ? (
                          <p className="qtv-empty-msg">
                            Chưa có dữ liệu đối chiếu Bộ sao Phối cho lá số này. Hãy lập lại lá số hoặc thêm quy tắc trong Admin CMS.
                          </p>
                        ) : null
                      ) : (
                        <div className="qtv-rules-list">
                          {qtvList.map((item, idx) => {
                            const isSelected = (activeQtv?.id || idx) === (item.id || idx) && selectedQtvIdx === idx;
                            return (
                              <button
                                key={item.id || idx}
                                type="button"
                                className={`qtv-rule-item${isSelected ? ' active' : ''}${item.isCustomRule ? ' is-custom' : ''}`}
                                onClick={() => setSelectedQtvIdx(idx)}
                              >
                                <div className="qtv-rule-top">
                                  <span className="qtv-rule-tag">
                                    {item.isCustomRule ? '✦ Quy tắc CMS khớp' : '◈ Tổng hợp 4 cung'}
                                  </span>
                                  {item.tamHopGroup && (
                                    <span className="qtv-tamhop-pill">{item.tamHopGroup}</span>
                                  )}
                                </div>
                                <div className="qtv-rule-title">{item.boSaoPhoi}</div>
                                {Array.isArray(item.matchedStars) && item.matchedStars.length > 0 && (
                                  <ul className="qtv-matched-stars">
                                    {item.matchedStars.map((st, sIdx) => (
                                      <li key={sIdx}>{st}</li>
                                    ))}
                                  </ul>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CỘT 2: NỘI DUNG TRẢ VỀ */}
                  <div className="quantuvi-col">
                    <div className="quantuvi-col-header">
                      Nội dung trả về
                    </div>
                    <div className="quantuvi-col-content">
                      {activeQtv ? (
                        <div className="qtv-return-content">
                          <div className="qtv-return-head">
                            <h4>{activeQtv.boSaoPhoi}</h4>
                            {activeQtv.source && (
                              <span className="qtv-return-source">{activeQtv.source}</span>
                            )}
                          </div>
                          <div
                            className="qtv-return-html"
                            dangerouslySetInnerHTML={{ __html: activeQtv.content }}
                          />
                        </div>
                      ) : !isMockDefault ? (
                        <p className="qtv-empty-msg">
                          Chọn một Bộ sao Phối bên cột trái để xem nội dung luận giải trả về.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

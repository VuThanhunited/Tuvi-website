import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Sparkles } from 'lucide-react';
import './LapLaSoCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const getToken = () => localStorage.getItem('token');

const GIO_CHI_LIST = ['Ty','Suu','Dan','Mao','Thin','Ti','Ngo','Mui','Than','Dau','Tuat','Hoi'];
const GIO_RANGE = ['23-1','1-3','3-5','5-7','7-9','9-11','11-13','13-15','15-17','17-19','19-21','21-23'];

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

const HUNG_KEYWORDS = [
  'kình dương', 'đà la', 'hỏa tinh', 'linh tinh', 'địa không', 'địa kiếp',
  'hóa kỵ', 'thiên hình', 'thiên diêu', 'kiếp sát', 'đại hao', 'tiểu hao',
  'tuế phá', 'thiên khốc', 'thiên hư', 'cô thần', 'quả tú', 'bạch hổ',
  'tang môn', 'điếu khách', 'phá toái', 'quan phù', 'quan phủ', 'tử phù',
  'thiên la', 'địa võng', 'phục binh', 'lưu hà', 'thiên không', 'đẩu quân',
  'thiên thương', 'thiên sứ', 'bệnh phù', 'thái tuế', 'trực phù', 'tuần không', 'triệt lộ'
];

const GRID_DIACHI = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];

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

function AdminLotusIcon() {
  return (
    <svg className="laso-qtv-lotus" viewBox="0 0 36 28" fill="none" aria-hidden="true">
      <path d="M18 3C15.5 8 14.5 13 18 19C21.5 13 20.5 8 18 3Z" stroke="#f5d27b" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 19C12 16 9.5 11.5 10.5 6.5C13.5 9.5 16 13.5 18 19Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 19C24 16 26.5 11.5 25.5 6.5C22.5 9.5 20 13.5 18 19Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 20C10.5 20 6 16.5 4.5 11.5C9.5 13 13.5 15.5 18 20Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 20C25.5 20 30 16.5 31.5 11.5C26.5 13 22.5 15.5 18 20Z" stroke="#f5d27b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 22.5C13 21 23 21 28 22.5" stroke="#f5d27b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AdminGreekKeyCorner({ className }) {
  return (
    <svg className={`laso-qtv-corner ${className}`} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M2 26V2H26M2 10H18V18H10V13.5H14" stroke="#c99b49" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

export default function LapLaSoCMS() {
  const [activeTab, setActiveTab] = useState('form');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [laSoList, setLaSoList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [fetchingList, setFetchingList] = useState(false);
  const [search, setSearch] = useState('');
  const [saveToDb, setSaveToDb] = useState(false);
  const [selectedCungIdx, setSelectedCungIdx] = useState(0);
  const [hoveredGridPos, setHoveredGridPos] = useState(null);
  const [selectedQtvIdx, setSelectedQtvIdx] = useState(0);
  const [showBirthInfo, setShowBirthInfo] = useState(true);
  // Edit modal state
  const [editLaSo, setEditLaSo] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [form, setForm] = useState({
    hoTen: '', gioiTinh: 'nam', ngaySinh: 1, thangSinh: 1,
    namSinh: 1990, gioSinh: 'Ngo', isLunar: false, namXem: new Date().getFullYear(),
  });

  useEffect(() => { if (activeTab === 'list') fetchList(1); }, [activeTab]);

  const fetchList = async (page = 1) => {
    setFetchingList(true);
    try {
      const url = API_URL + '/admin/la-so-list?page=' + page + '&limit=15&search=' + search;
      const res = await axios.get(url, { headers: { Authorization: 'Bearer ' + getToken() } });
      if (res.data.success) { setLaSoList(res.data.data); setPagination(res.data.pagination); }
    } catch (err) { console.error(err); }
    finally { setFetchingList(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null); setResult(null);
    try {
      const payload = { ...form, saveToDb };
      const res = await axios.post(API_URL + '/admin/lap-la-so', payload, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      if (res.data.success) {
        const data = res.data.data;
        setResult(data);
        const mIdx = data?.cungResults?.findIndex(c => c.name && c.name.trim().toLowerCase() === 'mệnh');
        setSelectedCungIdx(mIdx !== -1 && mIdx !== undefined ? mIdx : 0);
        setSelectedQtvIdx(0);
        setStatus({ success: true, message: res.data.message });
        setActiveTab('result');
      } else {
        setStatus({ success: false, message: res.data.message });
      }
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || 'Loi server!' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa lá số này?')) return;
    try {
      await axios.delete(API_URL + '/admin/la-so/' + id, { headers: { Authorization: 'Bearer ' + getToken() } });
      fetchList(pagination.page);
    } catch (err) { alert('Lỗi xóa lá số'); }
  };

  const openEditLaSo = (ls) => {
    setEditLaSo({
      _id: ls._id,
      hoTen: ls.hoTen || '',
      gioiTinh: ls.gioiTinh || 'nam',
      ngaySinh: ls.ngaySinh || 1,
      thangSinh: ls.thangSinh || 1,
      namSinh: ls.namSinh || 1990,
      gioSinh: ls.gioSinh || 'Ngo',
      isLunar: ls.isLunar || false,
    });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const res = await axios.put(API_URL + '/admin/la-so/' + editLaSo._id, editLaSo, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      if (res.data.success) {
        setStatus({ success: true, message: 'Đã cập nhật lá số thành công!' });
        setLaSoList(prev => prev.map(l => l._id === editLaSo._id ? { ...l, ...editLaSo } : l));
        setEditLaSo(null);
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({ success: false, message: res.data.message });
      }
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || 'Lỗi cập nhật!' });
    } finally {
      setEditLoading(false);
    }
  };

  const getRatingStars = (r) => {
    const full = r || 0;
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  const orderedCungButtons = useMemo(() => {
    if (!result?.cungResults) return [];
    return CUNG_DISPLAY_ORDER.map((cungName) => {
      const idx = result.cungResults.findIndex(
        c => c.name && c.name.trim().toLowerCase() === cungName.toLowerCase()
      );
      return { name: cungName, idx };
    }).filter(item => item.idx !== -1);
  }, [result?.cungResults]);

  const selectedCung = result?.cungResults?.[selectedCungIdx] || result?.cungResults?.[0] || null;
  const activeGridPos = hoveredGridPos !== null ? hoveredGridPos : (selectedCung?.gridIdx ?? 0);
  const tamPhuongMap = {
    [activeGridPos]: 1,
    [(activeGridPos + 8) % 12]: 2,
    [(activeGridPos + 6) % 12]: 3,
    [(activeGridPos + 4) % 12]: 4,
  };
  const qtvList = Array.isArray(result?.quanTuViResults) ? result.quanTuViResults : [];
  const activeQtv = qtvList[selectedQtvIdx] || qtvList[0] || null;

  return (
    <div className="laso-cms">
      <header className="laso-cms__header">
        <div className="laso-cms__header-icon">
          <Sparkles size={26} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="laso-cms__title">Lập Lá Số Tử Vi</h1>
          <p className="laso-cms__subtitle">Nhập thông tin ngày sinh để lập lá số tử vi tức thì</p>
        </div>
      </header>
      <div className="laso-cms__tabs">
        {[
          { key: 'form', label: 'Lập Lá Số Mới', disabled: false },
          { key: 'result', label: 'Kết Quả', disabled: !result },
          { key: 'list', label: 'Đã Lập (' + pagination.total + ')', disabled: false },
        ].map(t => (
          <button key={t.key} disabled={t.disabled}
            className={'laso-cms__tab' + (activeTab === t.key ? ' active' : '') + (t.disabled ? ' disabled' : '')}
            onClick={() => !t.disabled && setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {status && (
        <div className={'laso-cms__status ' + (status.success ? 'success' : 'error')}>
          {status.success ? 'OK: ' : 'Loi: '}{status.message}
        </div>
      )}
      {activeTab === 'form' && (
        <div className="laso-cms__card">
          <div className="laso-cms__card-header">
            <h2>Nhập Thông Tin Người Cần Xem</h2>
            <p>Điền đầy đủ thông tin để hệ thống tính toán chính xác lá số tử vi</p>
          </div>
          <form onSubmit={handleSubmit} className="laso-cms__form">
            <div className="laso-cms__form-row">
              <div className="laso-cms__form-group span2">
                <label>Họ và Tên *</label>
                <input type="text" placeholder="Nguyễn Văn A" required
                  value={form.hoTen} onChange={e => setForm(p => ({ ...p, hoTen: e.target.value }))} />
              </div>
              <div className="laso-cms__form-group">
                <label>Giới Tính *</label>
                <select value={form.gioiTinh} onChange={e => setForm(p => ({ ...p, gioiTinh: e.target.value }))}>
                  <option value="nam">Nam Mạng</option>
                  <option value="nu">Nữ Mạng</option>
                </select>
              </div>
            </div>
            <div className="laso-cms__section-title">Ngày Sinh</div>
            <div className="laso-cms__form-row">
              <div className="laso-cms__form-group">
                <label>Ngày *</label>
                <input type="number" min={1} max={31} value={form.ngaySinh}
                  onChange={e => setForm(p => ({ ...p, ngaySinh: parseInt(e.target.value) }))} required />
              </div>
              <div className="laso-cms__form-group">
                <label>Tháng *</label>
                <input type="number" min={1} max={12} value={form.thangSinh}
                  onChange={e => setForm(p => ({ ...p, thangSinh: parseInt(e.target.value) }))} required />
              </div>
              <div className="laso-cms__form-group">
                <label>Năm *</label>
                <input type="number" min={1900} max={2030} value={form.namSinh}
                  onChange={e => setForm(p => ({ ...p, namSinh: parseInt(e.target.value) }))} required />
              </div>
            </div>
            <div className="laso-cms__form-row">
              <div className="laso-cms__form-group">
                <label>Giờ Sinh (Địa Chi Giờ) *</label>
                <select value={form.gioSinh} onChange={e => setForm(p => ({ ...p, gioSinh: e.target.value }))}>
                  {GIO_CHI_LIST.map((chi, i) => (
                    <option key={chi} value={chi}>{chi} ({GIO_RANGE[i]}h)</option>
                  ))}
                </select>
              </div>
              <div className="laso-cms__form-group">
                <label>Loại Lịch *</label>
                <select value={form.isLunar ? 'lunar' : 'solar'} onChange={e => setForm(p => ({ ...p, isLunar: e.target.value === 'lunar' }))}>
                  <option value="solar">Dương Lịch (Tây)</option>
                  <option value="lunar">Âm Lịch (Ta)</option>
                </select>
              </div>
              <div className="laso-cms__form-group">
                <label>Năm Xem (Tùy Chọn)</label>
                <input type="number" min={1990} max={2050} value={form.namXem}
                  onChange={e => setForm(p => ({ ...p, namXem: parseInt(e.target.value) }))} />
              </div>
            </div>
            <div className="laso-cms__save-option">
              <label className="laso-cms__checkbox-label">
                <input type="checkbox" checked={saveToDb} onChange={e => setSaveToDb(e.target.checked)} />
                <span>Lưu lá số này vào cơ sở dữ liệu</span>
              </label>
            </div>
            <button type="submit" className="laso-cms__btn-primary" disabled={loading}>
              {loading ? 'Đang lập lá số...' : 'Lập Lá Số Ngay'}
            </button>
          </form>
        </div>
      )}
      {activeTab === 'result' && result && (
        <div className="laso-qtv-result-wrap">
          <div className="laso-qtv-top-bar">
            <div />
            <div className="laso-qtv-title-wrap">
              <span className="laso-qtv-title-line" />
              <h2>Kết quả lá số Tử Vi</h2>
              <span className="laso-qtv-title-line laso-qtv-title-line--right" />
            </div>
            <div className="laso-qtv-top-actions">
              <button type="button" className="laso-qtv-btn-new" onClick={() => { setActiveTab('form'); setResult(null); setStatus(null); }}>
                ↻ Lập lá số mới
              </button>
            </div>
          </div>

          <div className="laso-qtv-main-grid">
            {/* Cột trái: Lá số Tử Vi */}
            <section className="laso-qtv-card">
              <div className="laso-qtv-card-header">
                <div className="laso-qtv-card-title-group">
                  <AdminLotusIcon />
                  <h3>Lá số Tử Vi</h3>
                </div>
                <span className="laso-qtv-badge-free">Miễn phí</span>
              </div>
              <div className="laso-qtv-card-body">
                <div className="laso-qtv-board">
                  {(result.cungResults || []).map((cung, i) => {
                    const gridPos = cung.gridIdx ?? i;
                    const diaChiName = cung.diaChi || GRID_DIACHI[gridPos] || '';
                    const canPart = cung.canChi ? cung.canChi.split('.')[0] : '';
                    const rightSideStars = (cung.saoPhuList || []).filter(s => s.ten !== cung.trangSinh);
                    const hoaStars = [...(cung.hoaTinhList || []), ...(cung.namXemHoaTinh || [])];
                    const badge = tamPhuongMap[gridPos] || null;

                    return (
                      <div
                        key={i}
                        className={`laso-qtv-cell pos-${gridPos}${badge ? ' hovered' : ''}${selectedCungIdx === i ? ' selected' : ''}`}
                        onClick={() => setSelectedCungIdx(i)}
                        onMouseEnter={() => setHoveredGridPos(gridPos)}
                        onMouseLeave={() => setHoveredGridPos(null)}
                      >
                        <div className="laso-qtv-cell-head">
                          <div className="laso-qtv-cell-tl">
                            <span>{canPart ? `${canPart}.` : ''}{diaChiName}</span>
                            {cung.hanhDisplay && <small style={{ color: cung.hanhColor }}>{cung.hanhDisplay}</small>}
                          </div>
                          <div className="laso-qtv-cell-tc">
                            <span className={`laso-qtv-cname${cung.isMenh ? ' menh' : ''}`}>
                              {(cung.isMinh ? `${cung.name} <Thân>` : (cung.name || '')).toUpperCase()}
                            </span>
                          </div>
                          <div className="laso-qtv-cell-tr">
                            <span>{cung.daiHan || (gridPos * 10 + 6)}</span>
                          </div>
                        </div>

                        <div className="laso-qtv-stars-cols">
                          <div className="laso-qtv-col-chinh">
                            {cung.saoChinhList && cung.saoChinhList.length > 0 ? (
                              cung.saoChinhList.map((s, si) => (
                                <span key={si} className="laso-qtv-schinh" style={{ color: getSaoChinhColor(s.trangThai), fontWeight: (s.trangThai === 'M' || s.trangThai === 'V') ? 700 : 600 }}>
                                  {s.ten}{s.trangThai ? ` (${s.trangThai})` : ''}
                                </span>
                              ))
                            ) : (
                              <span className="laso-qtv-vcd">Vô chính diệu</span>
                            )}
                          </div>
                          <div className="laso-qtv-col-phu">
                            {rightSideStars.map((s, si) => (
                              <span key={`p-${si}`} className="laso-qtv-sphu" style={{ color: getSaoNhomColor(s) }}>
                                {s.ten}{s.trangThai && s.trangThai !== 'B' ? ` (${s.trangThai})` : ''}
                              </span>
                            ))}
                            {hoaStars.map((h, hi) => (
                              <span key={`h-${hi}`} className="laso-qtv-sphu" style={{ color: (h.loai === 'hoa-ky' || (h.ten || '').toLowerCase().includes('kỵ')) ? '#d32f2f' : '#2e7d32', fontWeight: 700 }}>
                                {h.ten}
                              </span>
                            ))}
                          </div>
                        </div>

                        {badge && <span className="laso-qtv-tp-badge">{badge}</span>}

                        <div className="laso-qtv-cell-foot">
                          <span className="dv">{cung.dvLabel || ''}</span>
                          <span className="ts">{cung.trangSinh || ''}</span>
                          <span className="ln">{cung.lnLabel || ''}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="laso-qtv-center">
                    <div className="laso-qtv-medallion">
                      {showBirthInfo ? (
                        <>
                          <h4 className="laso-qtv-center-title">Lá số Tử Vi</h4>
                          <div className="laso-qtv-center-info">
                            <div><strong>Họ tên:</strong> <span className="red">{result.hoTen}</span></div>
                            <div><strong>Năm:</strong> {result.namSinh} · {result.canChi}</div>
                            <div><strong>Ngày:</strong> {result.ngaySinh}/{result.thangSinh} (Âm: {result.lunarDay || result.ngaySinh}/{result.lunarMonth || result.thangSinh})</div>
                            <div><strong>Giờ:</strong> {result.gioHour || result.gioSinh}</div>
                            <div><strong>Mệnh:</strong> {result.napAm || result.nguHanh}</div>
                            {result.cuc?.name && <div><strong>Cục:</strong> {result.cuc.name}</div>}
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="laso-qtv-center-title big">Lá số<br />Tử Vi</h4>
                          <div className="laso-qtv-yinyang">☯</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="laso-qtv-legend">
                  <span><strong>Trái:</strong> Chính tinh</span>
                  <span style={{ color: '#2e7d32', fontWeight: 700 }}>● Cát tinh (Xanh lá)</span>
                  <span style={{ color: '#d32f2f', fontWeight: 700 }}>● Hung tinh (Đỏ)</span>
                  <label className="laso-qtv-toggle">
                    <input type="checkbox" checked={!showBirthInfo} onChange={() => setShowBirthInfo(v => !v)} />
                    <span>Ẩn chi tiết</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Cột phải: Luận giải lá số */}
            <section className="laso-qtv-card">
              <div className="laso-qtv-card-header">
                <div className="laso-qtv-card-title-group">
                  <AdminLotusIcon />
                  <h3>Luận giải lá số</h3>
                </div>
                <span className="laso-qtv-badge-free">Miễn phí</span>
              </div>
              <div className="laso-qtv-card-body lg">
                <div className="laso-qtv-cung-btns">
                  {orderedCungButtons.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`laso-qtv-cung-btn${selectedCungIdx === item.idx ? ' active' : ''}`}
                      onClick={() => setSelectedCungIdx(item.idx)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                {selectedCung && (
                  <div className="laso-qtv-selected-box">
                    <div className="laso-qtv-selected-head">
                      <div className="laso-qtv-selected-title">
                        <span className="yy">☯</span>
                        <h4>Luận giải cung {selectedCung.name}</h4>
                      </div>
                      <span className="laso-qtv-sample-pill">
                        {selectedCung.interpretation ? 'Luận giải chi tiết' : 'Nội dung mẫu'}
                      </span>
                    </div>
                    <p className="laso-qtv-intro">
                      {CUNG_INTRO_MAP[selectedCung.name] || `Cung ${selectedCung.name} tọa tại ${selectedCung.diaChi || '—'}.`}
                    </p>
                    <div className="laso-qtv-divider" />
                    <div className="laso-qtv-stars-summary">
                      <div><strong>Địa chi:</strong> {selectedCung.canChi} ({selectedCung.hanhDisplay}) · <strong>Đại hạn:</strong> {selectedCung.daiHan}</div>
                      <div><strong>Chính tinh:</strong> {selectedCung.saoChinhList?.length ? selectedCung.saoChinhList.map(s => `${s.ten}${s.trangThai ? ` (${s.trangThai})` : ''}`).join(', ') : 'Vô chính diệu'}</div>
                    </div>
                    {selectedCung.interpretation && (
                      <div className="laso-qtv-rich" dangerouslySetInnerHTML={{ __html: selectedCung.interpretation }} />
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Khối Quán Tử Vi 2 cột (Admin) */}
          <section className="laso-qtv-admin-box">
            <div className="laso-qtv-admin-header">
              <AdminLotusIcon />
              <h3>QUÁN TỬ VI</h3>
              <div />
            </div>
            <div className="laso-qtv-admin-body">
              <div className="laso-qtv-ornate-frame">
                <AdminGreekKeyCorner className="tl" />
                <AdminGreekKeyCorner className="tr" />
                <AdminGreekKeyCorner className="bl" />
                <AdminGreekKeyCorner className="br" />
                <div className="laso-qtv-two-cols">
                  <div className="laso-qtv-col">
                    <div className="laso-qtv-col-head">Bộ sao Phối (Mệnh Tài Quan Di)</div>
                    <div className="laso-qtv-col-body">
                      {qtvList.length === 0 ? (
                        <p className="laso-qtv-empty">Chưa có quy tắc Bộ sao Phối khớp cho lá số này.</p>
                      ) : (
                        <div className="laso-qtv-rule-list">
                          {qtvList.map((item, idx) => (
                            <button
                              key={item.id || idx}
                              type="button"
                              className={`laso-qtv-rule-item${selectedQtvIdx === idx ? ' active' : ''}`}
                              onClick={() => setSelectedQtvIdx(idx)}
                            >
                              <div className="laso-qtv-rule-tag">
                                {item.isCustomRule ? '✦ Quy tắc CMS khớp' : '◈ Tổng hợp 4 cung'}
                                {item.tamHopGroup ? ` · ${item.tamHopGroup}` : ''}
                              </div>
                              <div className="laso-qtv-rule-title">{item.boSaoPhoi}</div>
                              {Array.isArray(item.matchedStars) && item.matchedStars.length > 0 && (
                                <ul className="laso-qtv-rule-stars">
                                  {item.matchedStars.map((st, si) => <li key={si}>{st}</li>)}
                                </ul>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="laso-qtv-col">
                    <div className="laso-qtv-col-head">Nội dung trả về</div>
                    <div className="laso-qtv-col-body">
                      {activeQtv ? (
                        <div className="laso-qtv-return">
                          <h4>{activeQtv.boSaoPhoi}</h4>
                          <div className="laso-qtv-return-html" dangerouslySetInnerHTML={{ __html: activeQtv.content }} />
                        </div>
                      ) : (
                        <p className="laso-qtv-empty">Chọn một Bộ sao Phối bên trái để xem nội dung trả về.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="laso-cms__result-actions">
            <button className="laso-cms__btn-secondary" onClick={() => { setActiveTab('form'); setResult(null); setStatus(null); }}>
              Lập Lá Số Khác
            </button>
            <button className="laso-cms__btn-primary" onClick={() => window.print()}>In Lá Số</button>
          </div>
        </div>
      )}
      {activeTab === 'list' && (
        <div className="laso-cms__card">
          <div className="laso-cms__card-header">
            <h2>Danh Sách Lá Số Đã Lập Và Lưu</h2>
            <div className="laso-cms__search-row">
              <input type="text" placeholder="Tìm kiếm theo tên..." value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchList(1)}
                className="laso-cms__search" />
              <button onClick={() => fetchList(1)} className="laso-cms__btn-search">Tìm</button>
            </div>
          </div>
          {fetchingList ? (
            <div className="laso-cms__loading">Đang tải...</div>
          ) : laSoList.length === 0 ? (
            <div className="laso-cms__empty"><p>Chưa có lá số nào được lưu. Lập lá số và chọn "Lưu vào CSDL".</p></div>
          ) : (
            <>
              <table className="laso-cms__table">
                <thead>
                  <tr>
                    <th>Họ Tên</th>
                    <th>Giới Tính</th>
                    <th>Ngày Sinh</th>
                    <th>Giờ</th>
                    <th>Can Chi</th>
                    <th>Nạp Âm</th>
                    <th>Đánh Giá</th>
                    <th>Ngày Lập</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {laSoList.map(ls => (
                    <tr key={ls._id}>
                      <td className="laso-cms__td-name">{ls.hoTen}</td>
                      <td>{ls.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}</td>
                      <td>{ls.ngaySinh}/{ls.thangSinh}/{ls.namSinh}</td>
                      <td>{ls.gioSinh}</td>
                      <td className="laso-cms__td-gold">{ls.canChi}</td>
                      <td>{ls.napAm}</td>
                      <td>{getRatingStars(ls.overallRating)}</td>
                      <td>{new Date(ls.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button className="laso-cms__btn-edit-sm" onClick={() => openEditLaSo(ls)}>✏️ Sửa</button>
                        <button className="laso-cms__btn-delete-sm" onClick={() => handleDelete(ls._id)}>🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pagination.totalPages > 1 && (
                <div className="laso-cms__pagination">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={'laso-cms__page-btn' + (p === pagination.page ? ' active' : '')} onClick={() => fetchList(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      {editLaSo && (
        <div className="laso-cms__modal-overlay" onClick={() => setEditLaSo(null)}>
          <div className="laso-cms__modal" onClick={e => e.stopPropagation()}>
            <div className="laso-cms__modal-header">
              <h3>✏️ Chỉnh Sửa Lá Số</h3>
              <button className="laso-cms__modal-close" onClick={() => setEditLaSo(null)}>✕</button>
            </div>
            <div className="laso-cms__modal-body">
              <div className="laso-cms__form-row">
                <div className="laso-cms__form-group span2">
                  <label>Họ và Tên *</label>
                  <input type="text" value={editLaSo.hoTen}
                    onChange={e => setEditLaSo(p => ({ ...p, hoTen: e.target.value }))} />
                </div>
                <div className="laso-cms__form-group">
                  <label>Giới Tính</label>
                  <select value={editLaSo.gioiTinh}
                    onChange={e => setEditLaSo(p => ({ ...p, gioiTinh: e.target.value }))}>
                    <option value="nam">Nam Mạng</option>
                    <option value="nu">Nữ Mạng</option>
                  </select>
                </div>
              </div>
              <div className="laso-cms__section-title">Ngày Sinh</div>
              <div className="laso-cms__form-row">
                <div className="laso-cms__form-group">
                  <label>Ngày *</label>
                  <input type="number" min={1} max={31} value={editLaSo.ngaySinh}
                    onChange={e => setEditLaSo(p => ({ ...p, ngaySinh: parseInt(e.target.value) }))} />
                </div>
                <div className="laso-cms__form-group">
                  <label>Tháng *</label>
                  <input type="number" min={1} max={12} value={editLaSo.thangSinh}
                    onChange={e => setEditLaSo(p => ({ ...p, thangSinh: parseInt(e.target.value) }))} />
                </div>
                <div className="laso-cms__form-group">
                  <label>Năm *</label>
                  <input type="number" min={1900} max={2030} value={editLaSo.namSinh}
                    onChange={e => setEditLaSo(p => ({ ...p, namSinh: parseInt(e.target.value) }))} />
                </div>
              </div>
              <div className="laso-cms__form-row">
                <div className="laso-cms__form-group">
                  <label>Giờ Sinh (Địa Chi)</label>
                  <select value={editLaSo.gioSinh}
                    onChange={e => setEditLaSo(p => ({ ...p, gioSinh: e.target.value }))}>
                    {GIO_CHI_LIST.map((chi, i) => (
                      <option key={chi} value={chi}>{chi} ({GIO_RANGE[i]}h)</option>
                    ))}
                  </select>
                </div>
                <div className="laso-cms__form-group">
                  <label>Loại Lịch</label>
                  <select value={editLaSo.isLunar ? 'lunar' : 'solar'}
                    onChange={e => setEditLaSo(p => ({ ...p, isLunar: e.target.value === 'lunar' }))}>
                    <option value="solar">Dương Lịch</option>
                    <option value="lunar">Âm Lịch</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="laso-cms__modal-footer">
              <button className="laso-cms__btn-secondary" onClick={() => setEditLaSo(null)}>Hủy</button>
              <button className="laso-cms__btn-primary" onClick={handleEditSave} disabled={editLoading}>
                {editLoading ? 'Đang lưu...' : '💾 Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Sparkles, Check, RotateCcw } from 'lucide-react';
import './InterpretationCMS.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

// ── 12 Biến Cung theo quy tac.docx ──
const CUNG_VAR_DEFS = [
  { bien: 'x1',  code: 'MENH',       ten: 'Mệnh',       main: true },
  { bien: 'x9',  code: 'TAI_BACH',   ten: 'Tài Bạch',   main: true },
  { bien: 'x5',  code: 'QUAN_LOC',   ten: 'Quan Lộc',   main: true },
  { bien: 'x7',  code: 'THIEN_DI',   ten: 'Thiên Di',   main: true },
  { bien: 'x2',  code: 'PHU_MAU',    ten: 'Phụ Mẫu',    main: false },
  { bien: 'x3',  code: 'PHUC_DUC',   ten: 'Phúc Đức',   main: false },
  { bien: 'x4',  code: 'DIEN_TRACH', ten: 'Điền Trạch', main: false },
  { bien: 'x6',  code: 'NO_BOC',     ten: 'Nô Bộc',     main: false },
  { bien: 'x8',  code: 'TAT_ACH',    ten: 'Tật Ách',    main: false },
  { bien: 'x10', code: 'TU_TUC',     ten: 'Tử Tức',     main: false },
  { bien: 'x11', code: 'PHU_THE',    ten: 'Phu Thê',    main: false },
  { bien: 'x12', code: 'HUYNH_DE',   ten: 'Huynh Đệ',   main: false },
];

// ── 4 Bộ Tam hợp Địa Chi theo quy tac.docx ──
const TAM_HOP_DEFS = [
  { key: '', label: 'Tất cả bộ Địa Chi' },
  { key: 'HOI_MAO_MUI',  label: 'Hợi – Mão – Mùi' },
  { key: 'DAN_NGO_TUAT', label: 'Dần – Ngọ – Tuất' },
  { key: 'THAN_TY_THIN', label: 'Thân – Tý – Thìn' },
  { key: 'TY_DAU_SUU',   label: 'Tỵ – Dậu – Sửu' },
];

// ── 14 Chính Tinh ──
const CHINH_TINH_VARS = [
  { code: 'TU_VI',       ten: 'Tử Vi' },
  { code: 'THIEN_CO',    ten: 'Thiên Cơ' },
  { code: 'THAI_DUONG',  ten: 'Thái Dương' },
  { code: 'VU_KHUC',     ten: 'Vũ Khúc' },
  { code: 'THIEN_DONG',  ten: 'Thiên Đồng' },
  { code: 'LIEM_TRINH',  ten: 'Liêm Trinh' },
  { code: 'THIEN_PHU',   ten: 'Thiên Phủ' },
  { code: 'THAI_AM',     ten: 'Thái Âm' },
  { code: 'THAM_LANG',   ten: 'Tham Lang' },
  { code: 'CU_MON',      ten: 'Cự Môn' },
  { code: 'THIEN_TUONG', ten: 'Thiên Tướng' },
  { code: 'THIEN_LUONG', ten: 'Thiên Lương' },
  { code: 'THAT_SAT',    ten: 'Thất Sát' },
  { code: 'PHA_QUAN',    ten: 'Phá Quân' },
];

// ── Cát Tinh (Sao đẹp - màu xanh lá) ──
const CAT_TINH_VARS = [
  { code: 'TA_PHU',     ten: 'Tả Phù' },
  { code: 'HUU_BAT',    ten: 'Hữu Bật' },
  { code: 'VAN_XUONG',  ten: 'Văn Xương' },
  { code: 'VAN_KHUC',   ten: 'Văn Khúc' },
  { code: 'THIEN_KHOI', ten: 'Thiên Khôi' },
  { code: 'THIEN_VIET', ten: 'Thiên Việt' },
];

// ── Hung Tinh (Sao xấu - màu đỏ) ──
const HUNG_TINH_VARS = [
  { code: 'KINH_DUONG', ten: 'Kình Dương' },
  { code: 'DA_LA',      ten: 'Đà La' },
  { code: 'HOA_TINH',   ten: 'Hỏa Tinh' },
  { code: 'LINH_TINH',  ten: 'Linh Tinh' },
  { code: 'DIA_KHONG',  ten: 'Địa Không' },
  { code: 'DIA_KIEP',   ten: 'Địa Kiếp' },
];

const ALL_STAR_VAR_MAP = Object.fromEntries(
  [...CHINH_TINH_VARS, ...CAT_TINH_VARS, ...HUNG_TINH_VARS].map(s => [s.code, s])
);

const DEFAULT_MAIN_CUNGS = ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'];

// Danh sách sao dùng cho Tab Luận giải cơ bản
const SAO_LIST = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh',
  'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương',
  'Thất Sát', 'Phá Quân',
  'Văn Khúc', 'Văn Xương', 'Tả Phù', 'Hữu Bật',
  'Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ',
  'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Kiếp', 'Địa Không',
  'Thiên Mã', 'Thiên Khốc', 'Thiên Hư', 'Hồng Loan', 'Thiên Hỷ',
  'Thiên Quan', 'Thiên Phúc', 'Long Trì', 'Phụng Các',
  'Thiên Tài', 'Thiên Thọ', 'Thiên La', 'Địa Võng',
  'Kiếp Sát', 'Phá Toái', 'Đại Hao', 'Tiểu Hao',
  'Tuế Phá', 'Long Đức', 'Phúc Đức', 'Điếu Khách',
  'Bạch Hổ', 'Thiên Đức', 'Nguyệt Đức', 'Quang Quý'
];

const CUNG_LIST = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch',
  'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách',
  'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

function getStarBadgeKind(code) {
  if (CAT_TINH_VARS.some(s => s.code === code)) return 'cat';
  if (HUNG_TINH_VARS.some(s => s.code === code)) return 'hung';
  return 'chinh';
}

export default function InterpretationCMS() {
  const [activeTab, setActiveTab] = useState('bo_sao_phoi');
  const [data, setData] = useState([]);
  const [boSaoList, setBoSaoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [seedLoading, setSeedLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showVarGuide, setShowVarGuide] = useState(false);
  const editorRef = useRef(null);

  // Filter state cho Tab cơ bản
  const [filterType, setFilterType] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // State cho Trình soạn thảo 2 cột Quán Tử Vi (Bộ sao Phối)
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [savingRule, setSavingRule] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    boSaoPhoi: '',
    saoCodes: [],
    cungCodes: DEFAULT_MAIN_CUNGS,
    tamHopGroup: '',
    content: '',
    source: 'Quán Tử Vi — Luận giải nâng cao',
  });

  // State cho Modal luận giải cơ bản
  const [formData, setFormData] = useState({
    type: 'sao_cung',
    sao: '',
    cung: '',
    trangThai: '',
    tenCachCuc: '',
    content: '',
    source: ''
  });

  const fetchBoSaoRules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/interpretations?type=bo_sao_phoi&limit=200`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setBoSaoList(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Lỗi tải Bộ sao Phối:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterpretations = async (type = filterType, search = filterSearch) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/interpretations?limit=100`;
      if (type) url += `&type=${type}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu CMS:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDbStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/database-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setDbStatus(result.data);
    } catch (err) {
      console.error('Lỗi kiểm tra database status:', err);
    }
  };

  useEffect(() => {
    fetchBoSaoRules();
    fetchInterpretations();
    fetchDbStatus();
  }, []);

  const buildBoSaoLabel = (saoCodes, cungCodes, tamHopGroup) => {
    const starNames = saoCodes.map(c => ALL_STAR_VAR_MAP[c]?.ten || c);
    const cungLabels = cungCodes.length === 4 && DEFAULT_MAIN_CUNGS.every(c => cungCodes.includes(c))
      ? 'Mệnh Tài Quan Di'
      : cungCodes.map(cc => CUNG_VAR_DEFS.find(x => x.code === cc)?.ten || cc).join(', ');
    const tamHopLabel = TAM_HOP_DEFS.find(t => t.key === tamHopGroup)?.label;
    const base = starNames.length ? starNames.join(' + ') : 'Bộ sao kết hợp';
    const scope = cungLabels ? ` (${cungLabels})` : '';
    const tamHopPart = tamHopGroup && tamHopLabel ? ` · [${tamHopLabel}]` : '';
    return `${base}${scope}${tamHopPart}`;
  };

  const toggleStarCode = (code) => {
    setRuleForm(prev => {
      const exists = prev.saoCodes.includes(code);
      const nextSaoCodes = exists
        ? prev.saoCodes.filter(c => c !== code)
        : [...prev.saoCodes, code];
      return {
        ...prev,
        saoCodes: nextSaoCodes,
        boSaoPhoi: buildBoSaoLabel(nextSaoCodes, prev.cungCodes, prev.tamHopGroup),
      };
    });
  };

  const toggleCungCode = (code) => {
    setRuleForm(prev => {
      const exists = prev.cungCodes.includes(code);
      const nextCungCodes = exists
        ? prev.cungCodes.filter(c => c !== code)
        : [...prev.cungCodes, code];
      const safeCungs = nextCungCodes.length > 0 ? nextCungCodes : [code];
      return {
        ...prev,
        cungCodes: safeCungs,
        boSaoPhoi: prev.saoCodes.length > 0
          ? buildBoSaoLabel(prev.saoCodes, safeCungs, prev.tamHopGroup)
          : prev.boSaoPhoi,
      };
    });
  };

  const handleTamHopChange = (key) => {
    setRuleForm(prev => ({
      ...prev,
      tamHopGroup: key,
      boSaoPhoi: prev.saoCodes.length > 0
        ? buildBoSaoLabel(prev.saoCodes, prev.cungCodes, key)
        : prev.boSaoPhoi,
    }));
  };

  const resetRuleForm = () => {
    setEditingRuleId(null);
    setRuleForm({
      boSaoPhoi: '',
      saoCodes: [],
      cungCodes: DEFAULT_MAIN_CUNGS,
      tamHopGroup: '',
      content: '',
      source: 'Quán Tử Vi — Luận giải nâng cao',
    });
  };

  const handleSaveBoSaoRule = async (e) => {
    e.preventDefault();
    if (!ruleForm.boSaoPhoi.trim() && ruleForm.saoCodes.length === 0) {
      setStatusMsg({ success: false, text: 'Vui lòng chọn ít nhất 1 sao hoặc nhập tên Bộ sao Phối ở Cột 1.' });
      return;
    }
    if (!ruleForm.content.trim()) {
      setStatusMsg({ success: false, text: 'Vui lòng nhập Nội dung trả về ở Cột 2.' });
      return;
    }

    setSavingRule(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('token');
      const method = editingRuleId ? 'PUT' : 'POST';
      const url = editingRuleId
        ? `${API_URL}/interpretations/${editingRuleId}`
        : `${API_URL}/interpretations`;

      const payload = {
        type: 'bo_sao_phoi',
        boSaoPhoi: ruleForm.boSaoPhoi.trim() || buildBoSaoLabel(ruleForm.saoCodes, ruleForm.cungCodes, ruleForm.tamHopGroup),
        saoCodes: ruleForm.saoCodes,
        cungCodes: ruleForm.cungCodes,
        tamHopGroup: ruleForm.tamHopGroup,
        content: ruleForm.content.trim(),
        source: ruleForm.source.trim() || 'Quán Tử Vi — Luận giải nâng cao',
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setStatusMsg({
          success: true,
          text: editingRuleId ? 'Đã cập nhật quy tắc Bộ sao Phối!' : 'Đã thêm quy tắc Bộ sao Phối mới!'
        });
        resetRuleForm();
        fetchBoSaoRules();
        fetchInterpretations();
        fetchDbStatus();
      } else {
        setStatusMsg({ success: false, text: result.message || 'Lưu thất bại!' });
      }
    } catch {
      setStatusMsg({ success: false, text: 'Lỗi kết nối máy chủ khi lưu quy tắc!' });
    } finally {
      setSavingRule(false);
    }
  };

  const handleEditBoSaoRule = (item) => {
    setEditingRuleId(item._id);
    setRuleForm({
      boSaoPhoi: item.boSaoPhoi || '',
      saoCodes: Array.isArray(item.saoCodes) ? item.saoCodes : [],
      cungCodes: (Array.isArray(item.cungCodes) && item.cungCodes.length > 0) ? item.cungCodes : DEFAULT_MAIN_CUNGS,
      tamHopGroup: item.tamHopGroup || '',
      content: item.content || '',
      source: item.source || 'Quán Tử Vi — Luận giải nâng cao',
    });
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFilter = () => {
    setFilterSearch(searchInput);
    fetchInterpretations(filterType, searchInput);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setFilterType(val);
    fetchInterpretations(val, filterSearch);
  };

  const handleSeedInterpretations = async () => {
    if (!window.confirm('Seed dữ liệu mẫu luận giải (bao gồm Bộ sao Phối Quán Tử Vi) vào database? Dữ liệu cũ được giữ nguyên.')) return;
    setSeedLoading(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/seed-interpretations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ clearExisting: false })
      });
      const result = await res.json();
      setStatusMsg({ success: result.success, text: result.message });
      if (result.success) {
        fetchBoSaoRules();
        fetchInterpretations();
        fetchDbStatus();
      }
    } catch {
      setStatusMsg({ success: false, text: 'Lỗi khi seed dữ liệu!' });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleImportTuViDatabase = async () => {
    if (!window.confirm('Import TuViDatabase (12 con giáp) từ file tuvi_database.json? Dữ liệu cũ sẽ bị xóa!')) return;
    setImportLoading(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/import-tuvi-database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setStatusMsg({ success: result.success, text: result.message });
      if (result.success) fetchDbStatus();
    } catch {
      setStatusMsg({ success: false, text: 'Lỗi khi import database!' });
    } finally {
      setImportLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = currentId ? 'PUT' : 'POST';
      const url = currentId
        ? `${API_URL}/interpretations/${currentId}`
        : `${API_URL}/interpretations`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (result.success) {
        setShowModal(false);
        fetchBoSaoRules();
        fetchInterpretations();
        fetchDbStatus();
      } else {
        alert(result.message || 'Lưu thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
    }
  };

  const handleEdit = (item) => {
    if (item.type === 'bo_sao_phoi') {
      setActiveTab('bo_sao_phoi');
      handleEditBoSaoRule(item);
      return;
    }
    setCurrentId(item._id);
    setFormData({
      type: item.type || 'sao_cung',
      sao: item.sao || '',
      cung: item.cung || '',
      trangThai: item.trangThai || '',
      tenCachCuc: item.tenCachCuc || '',
      content: item.content || '',
      source: item.source || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa luận giải này?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/interpretations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBoSaoRules();
      fetchInterpretations();
      fetchDbStatus();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  };

  const openNewModal = () => {
    setCurrentId(null);
    setFormData({
      type: 'sao_cung', sao: '', cung: '', trangThai: '', tenCachCuc: '', content: '', source: ''
    });
    setShowModal(true);
  };

  return (
    <div className="cms-container">
      <div className="cms-header">
        <h1 className="cms-title">
          <BookOpen size={22} color="#c5a059" /> Quản trị CMS — Luận Giải & Quán Tử Vi
        </h1>
        <div className="cms-header-actions">
          <button
            type="button"
            className="btn-outline-guide"
            onClick={() => setShowVarGuide(v => !v)}
          >
            {showVarGuide ? 'Ẩn Bảng Biến Quy Tắc' : '📖 Bảng Biến Quy Tắc'}
          </button>
          {activeTab === 'basic' && (
            <button className="btn-add-new" onClick={openNewModal}>
              <Plus size={16} /> Thêm luận giải cơ bản
            </button>
          )}
        </div>
      </div>

      {/* Database Status Panel */}
      {dbStatus && (
        <div className="db-status-panel">
          <div className="db-stat-box">
            <div className="db-stat-label">📚 Collection Interpretation</div>
            <div className={`db-stat-value ${dbStatus.interpretation.count > 0 ? 'ok' : 'empty'}`}>
              {dbStatus.interpretation.status} ({boSaoList.length} bộ sao phối)
            </div>
          </div>
          <div className="db-stat-box">
            <div className="db-stat-label">🐉 TuViDatabase (Con Giáp)</div>
            <div className={`db-stat-value ${dbStatus.tuViDatabase.conGiapCount >= 12 ? 'ok' : 'empty'}`}>
              {dbStatus.tuViDatabase.status}
            </div>
          </div>
          <div className="db-stat-box">
            <div className="db-stat-label">📋 Lá số đã lập</div>
            <div className="db-stat-value gold">{dbStatus.tuViResult.status}</div>
          </div>
          <div className="db-stat-actions">
            <button
              onClick={handleSeedInterpretations}
              disabled={seedLoading}
              className="btn-seed-green"
            >
              {seedLoading ? '⏳ Đang seed...' : '🌱 Seed Luận Giải Mẫu'}
            </button>
            <button
              onClick={handleImportTuViDatabase}
              disabled={importLoading}
              className="btn-seed-blue"
            >
              {importLoading ? '⏳ Đang import...' : '📥 Import TuViDatabase'}
            </button>
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMsg && (
        <div className={`cms-alert ${statusMsg.success ? 'success' : 'error'}`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}>✕</button>
        </div>
      )}

      {/* Bảng tham chiếu Biến Quy Tắc (x1..x12, Chính tinh, Cát tinh, Hung tinh, Tam hợp) */}
      {showVarGuide && (
        <div className="var-guide-card">
          <h3>📐 Quy ước Biến Hệ Thống (quy tac.docx)</h3>
          <div className="var-guide-grid">
            <div>
              <h4>1. 12 Biến Cung (x1 → x12)</h4>
              <div className="var-chips-wrap">
                {CUNG_VAR_DEFS.map(c => (
                  <span key={c.code} className={`var-chip ${c.main ? 'var-chip-main' : ''}`}>
                    <b>{c.bien}</b> = {c.code} ({c.ten}){c.main ? ' ★' : ''}
                  </span>
                ))}
              </div>
              <p className="var-note">★ Nhóm kiểm tra chính (Tam phương tứ chính): Mệnh (1) – Tài Bạch (2) – Thiên Di (3) – Quan Lộc (4).</p>
            </div>
            <div>
              <h4>2. Nhóm Sao & Tam Hợp Địa Chi</h4>
              <p className="var-line">
                <b>Tam hợp:</b> Hợi Mão Mùi · Dần Ngọ Tuất · Thân Tý Thìn · Tỵ Dậu Sửu
              </p>
              <p className="var-line">
                <b>14 Chính tinh:</b> {CHINH_TINH_VARS.map(s => s.code).join(', ')}
              </p>
              <p className="var-line cat">
                <b>Cát tinh (Xanh lá):</b> {CAT_TINH_VARS.map(s => s.code).join(', ')}
              </p>
              <p className="var-line hung">
                <b>Hung tinh (Đỏ):</b> {HUNG_TINH_VARS.map(s => s.code).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs chuyển đổi: Quán Tử Vi 2 Cột vs Luận giải cơ bản */}
      <div className="cms-mode-tabs">
        <button
          type="button"
          className={`cms-mode-tab ${activeTab === 'bo_sao_phoi' ? 'active' : ''}`}
          onClick={() => setActiveTab('bo_sao_phoi')}
        >
          <Sparkles size={16} /> Luận giải nâng cao — Quán Tử Vi (2 Cột)
          <span className="tab-count">{boSaoList.length}</span>
        </button>
        <button
          type="button"
          className={`cms-mode-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <BookOpen size={16} /> Luận giải Cơ bản (Cung / Sao)
          <span className="tab-count">{data.length}</span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════
          TAB 1: QUÁN TỬ VI — SOẠN THẢO 2 CỘT (BỘ SAO PHỐI | NỘI DUNG)
         ═════════════════════════════════════════════════════════ */}
      {activeTab === 'bo_sao_phoi' && (
        <div className="quantuvi-cms-section">
          <form ref={editorRef} onSubmit={handleSaveBoSaoRule} className="quantuvi-editor-card">
            <div className="quantuvi-editor-topbar">
              <div>
                <h2>
                  {editingRuleId ? '✏️ Chỉnh sửa Quy tắc Bộ sao Phối' : '✨ Tạo Quy tắc Bộ sao Phối mới (Quán Tử Vi)'}
                </h2>
                <p>
                  Xét 4 cung kiểm tra chính <b>Mệnh – Tài Bạch – Quan Lộc – Thiên Di</b>: khi lá số có các sao khớp Cột 1 sẽ trả về nội dung ở Cột 2.
                </p>
              </div>
              {editingRuleId && (
                <button type="button" className="btn-cancel" onClick={resetRuleForm}>
                  <RotateCcw size={15} /> Hủy sửa
                </button>
              )}
            </div>

            {/* Bố cục 2 Cột chuẩn theo quy tac.docx */}
            <div className="quantuvi-cms-two-cols">
              {/* CỘT 1: BỘ SAO PHỐI */}
              <div className="qtv-cms-col">
                <div className="qtv-cms-col-head">
                  Cột 1: Bộ sao Phối (Mệnh Tài Quan Di)
                </div>
                <div className="qtv-cms-col-body">
                  {/* Chọn phạm vi cung kiểm tra */}
                  <div className="picker-block">
                    <label className="picker-label">Phạm vi cung đối chiếu (mặc định 4 cung chính):</label>
                    <div className="picker-chips">
                      {CUNG_VAR_DEFS.map(c => {
                        const active = ruleForm.cungCodes.includes(c.code);
                        return (
                          <button
                            key={c.code}
                            type="button"
                            className={`pick-chip cung ${active ? 'active' : ''} ${c.main ? 'is-main' : ''}`}
                            onClick={() => toggleCungCode(c.code)}
                            title={`${c.bien}: ${c.code}`}
                          >
                            {active && <Check size={12} />} {c.ten} ({c.bien})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chọn bộ Tam hợp địa chi (tùy chọn) */}
                  <div className="picker-block">
                    <label className="picker-label">Bộ Tam hợp Địa Chi (tùy chọn):</label>
                    <select
                      className="qtv-select"
                      value={ruleForm.tamHopGroup}
                      onChange={e => handleTamHopChange(e.target.value)}
                    >
                      {TAM_HOP_DEFS.map(t => (
                        <option key={t.key} value={t.key}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Chọn 14 Chính tinh */}
                  <div className="picker-block">
                    <label className="picker-label">14 Chính tinh (CHINH_TINH):</label>
                    <div className="picker-chips">
                      {CHINH_TINH_VARS.map(s => {
                        const active = ruleForm.saoCodes.includes(s.code);
                        return (
                          <button
                            key={s.code}
                            type="button"
                            className={`pick-chip chinh ${active ? 'active' : ''}`}
                            onClick={() => toggleStarCode(s.code)}
                          >
                            {active && <Check size={12} />} {s.ten}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chọn Cát tinh (xanh lá) & Hung tinh (đỏ) */}
                  <div className="picker-split-row">
                    <div className="picker-block">
                      <label className="picker-label cat">Cát tinh — Sao đẹp (Màu xanh lá):</label>
                      <div className="picker-chips">
                        {CAT_TINH_VARS.map(s => {
                          const active = ruleForm.saoCodes.includes(s.code);
                          return (
                            <button
                              key={s.code}
                              type="button"
                              className={`pick-chip cat ${active ? 'active' : ''}`}
                              onClick={() => toggleStarCode(s.code)}
                            >
                              {active && <Check size={12} />} {s.ten}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="picker-block">
                      <label className="picker-label hung">Hung tinh — Sao xấu (Màu đỏ):</label>
                      <div className="picker-chips">
                        {HUNG_TINH_VARS.map(s => {
                          const active = ruleForm.saoCodes.includes(s.code);
                          return (
                            <button
                              key={s.code}
                              type="button"
                              className={`pick-chip hung ${active ? 'active' : ''}`}
                              onClick={() => toggleStarCode(s.code)}
                            >
                              {active && <Check size={12} />} {s.ten}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Tên/biểu thức hiển thị của Bộ sao phối */}
                  <div className="picker-block">
                    <label className="picker-label">Tên / Biểu thức Bộ sao Phối hiển thị ở Cột 1:</label>
                    <input
                      type="text"
                      className="qtv-input"
                      placeholder="VD: Tử Vi + Thiên Phủ hội Tả Phù, Hữu Bật (Mệnh Tài Quan Di)"
                      value={ruleForm.boSaoPhoi}
                      onChange={e => setRuleForm(prev => ({ ...prev, boSaoPhoi: e.target.value }))}
                    />
                    {ruleForm.saoCodes.length > 0 && (
                      <div className="selected-codes-preview">
                        Mã đối chiếu: {ruleForm.saoCodes.join(' + ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CỘT 2: NỘI DUNG TRẢ VỀ */}
              <div className="qtv-cms-col">
                <div className="qtv-cms-col-head">
                  Cột 2: Nội dung trả về (Luận giải nâng cao)
                </div>
                <div className="qtv-cms-col-body qtv-cms-col-body-right">
                  <div className="picker-block flex-fill">
                    <label className="picker-label">Nội dung trả về khi lá số khớp Bộ sao Phối (hỗ trợ HTML):</label>
                    <textarea
                      className="qtv-textarea"
                      placeholder="Nhập nội dung luận giải nâng cao trả về cho Admin tại khung Quán Tử Vi..."
                      value={ruleForm.content}
                      onChange={e => setRuleForm(prev => ({ ...prev, content: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="picker-block">
                    <label className="picker-label">Nguồn / Ghi chú:</label>
                    <input
                      type="text"
                      className="qtv-input"
                      placeholder="VD: Quán Tử Vi — Luận giải nâng cao"
                      value={ruleForm.source}
                      onChange={e => setRuleForm(prev => ({ ...prev, source: e.target.value }))}
                    />
                  </div>

                  <div className="qtv-submit-row">
                    <button type="button" className="btn-cancel" onClick={resetRuleForm}>
                      Làm mới
                    </button>
                    <button type="submit" className="btn-save" disabled={savingRule}>
                      {savingRule ? 'Đang lưu...' : (editingRuleId ? '💾 Cập nhật Quy tắc' : '💾 Lưu Bộ sao Phối')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Bảng danh sách 2 cột các Bộ sao Phối đã lưu */}
          <div className="cms-table-wrapper">
            <table className="cms-table quantuvi-two-col-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Cột 1: Bộ sao Phối (Mệnh Tài Quan Di)</th>
                  <th style={{ width: '50%' }}>Cột 2: Nội dung trả về</th>
                  <th style={{ width: '12%' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>⏳ Đang tải danh sách Bộ sao Phối...</td></tr>
                )}
                {!loading && boSaoList.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      Chưa có quy tắc Bộ sao Phối nào. Hãy tạo mới ở khung 2 cột phía trên hoặc bấm "Seed Luận Giải Mẫu".
                    </td>
                  </tr>
                )}
                {boSaoList.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="table-bosao-title">{item.boSaoPhoi || item.tenCachCuc || '(Chưa đặt tên)'}</div>
                      <div className="table-bosao-badges">
                        {(item.saoCodes || []).map(sc => {
                          const kind = getStarBadgeKind(sc);
                          return (
                            <span key={sc} className={`star-tag ${kind}`}>
                              {ALL_STAR_VAR_MAP[sc]?.ten || sc}
                            </span>
                          );
                        })}
                        {item.tamHopGroup && (
                          <span className="star-tag tamhop">
                            {TAM_HOP_DEFS.find(t => t.key === item.tamHopGroup)?.label || item.tamHopGroup}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-content-preview">{item.content}</div>
                      {item.source && <div className="table-source-tag">Nguồn: {item.source}</div>}
                    </td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEditBoSaoRule(item)} title="Sửa">✏️</button>
                      <button className="action-btn delete" onClick={() => handleDelete(item._id)} title="Xóa">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          TAB 2: LUẬN GIẢI CƠ BẢN (12 CUNG & TỪNG SAO)
         ═════════════════════════════════════════════════════════ */}
      {activeTab === 'basic' && (
        <>
          <div className="cms-filters">
            <select value={filterType} onChange={handleTypeChange}>
              <option value="">Tất cả loại</option>
              <option value="sao_cung">Sao tại Cung</option>
              <option value="cung">Ý nghĩa Cung</option>
              <option value="sao">Ý nghĩa Sao</option>
              <option value="cach_cuc">Cách Cục</option>
              <option value="tu_hoa">Tứ Hóa</option>
              <option value="bo_sao_phoi">Bộ sao Phối (Quán Tử Vi)</option>
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm theo Sao, Cung, Bộ sao phối, Nội dung..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFilter()}
            />
            <button className="btn-add-new" style={{ padding: '8px 15px' }} onClick={handleFilter}>Lọc</button>
          </div>

          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Sao / Bộ sao Phối</th>
                  <th>Cung</th>
                  <th>Trạng thái</th>
                  <th>Cách Cục</th>
                  <th>Trích đoạn nội dung</th>
                  <th>Nguồn</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="8" style={{ textAlign: 'center' }}>⏳ Đang tải dữ liệu...</td></tr>}
                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>
                      Chưa có dữ liệu nào. Hãy bấm "Seed Luận Giải Mẫu" hoặc thêm mới!
                    </td>
                  </tr>
                )}
                {data.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>
                      <span className="cms-type-pill">{item.type}</span>
                    </td>
                    <td>{item.boSaoPhoi || item.sao || '-'}</td>
                    <td>{item.cung || (item.cungCodes?.length ? item.cungCodes.join(', ') : '-')}</td>
                    <td>{item.trangThai || '-'}</td>
                    <td>{item.tenCachCuc || '-'}</td>
                    <td style={{ maxWidth: '260px' }}>{item.content ? item.content.substring(0, 75) + '...' : '-'}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.source || '-'}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(item)}>✏️</button>
                      <button className="action-btn delete" onClick={() => handleDelete(item._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && data.length > 0 && (
              <div style={{ textAlign: 'right', padding: '8px 16px', color: '#64748b', fontSize: '0.85rem' }}>
                Tổng: {data.length} luận giải
              </div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="cms-modal-overlay">
          <div className="cms-modal">
            <h3>{currentId ? 'Chỉnh sửa luận giải' : 'Thêm luận giải mới'}</h3>

            <div className="form-row">
              <div className="form-group in-row">
                <label>Loại luận giải</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="sao_cung">Sao đóng tại Cung</option>
                  <option value="cung">Ý nghĩa Cung</option>
                  <option value="sao">Ý nghĩa Sao cơ bản</option>
                  <option value="cach_cuc">Cách Cục</option>
                  <option value="tu_hoa">Tứ Hóa</option>
                </select>
              </div>
              <div className="form-group in-row">
                <label>Nguồn (Sách/Tác giả)</label>
                <input type="text" name="source" value={formData.source} onChange={handleInputChange} placeholder="VD: Trung Châu Tử Vi" />
              </div>
            </div>

            {(formData.type === 'sao_cung' || formData.type === 'sao' || formData.type === 'cung') && (
              <div className="form-row">
                {(formData.type === 'sao_cung' || formData.type === 'sao') && (
                  <div className="form-group in-row">
                    <label>Sao</label>
                    <select name="sao" value={formData.sao} onChange={handleInputChange}>
                      <option value="">-- Chọn sao --</option>
                      {SAO_LIST.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
                {(formData.type === 'sao_cung' || formData.type === 'cung') && (
                  <div className="form-group in-row">
                    <label>Cung</label>
                    <select name="cung" value={formData.cung} onChange={handleInputChange}>
                      <option value="">-- Chọn cung --</option>
                      {CUNG_LIST.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.type === 'sao_cung' && (
                  <div className="form-group in-row">
                    <label>Trạng thái</label>
                    <select name="trangThai" value={formData.trangThai} onChange={handleInputChange}>
                      <option value="">Không có / Bỏ qua</option>
                      <option value="M">Miếu (M)</option>
                      <option value="V">Vượng (V)</option>
                      <option value="Đ">Đắc (Đ)</option>
                      <option value="B">Bình (B)</option>
                      <option value="H">Hãm (H)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {formData.type === 'cach_cuc' && (
              <div className="form-row">
                <div className="form-group in-row">
                  <label>Tên cách cục</label>
                  <input type="text" name="tenCachCuc" value={formData.tenCachCuc} onChange={handleInputChange} placeholder="VD: Tử Phủ Vũ Tướng" />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Nội dung luận giải (Hỗ trợ HTML)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Nhập nội dung luận giải vào đây..."
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
              <button className="btn-save" onClick={handleSave}>Lưu dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

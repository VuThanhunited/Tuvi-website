import { generateLaSo } from 'tuvi-neo';
import { getLunarDate, getSolarDate, getDayCanChi } from '@dqcai/vn-lunar';
import TuViResult from '../models/TuViResult.js';
import TuViDatabase from '../models/TuViDatabase.js';
import Interpretation from '../models/Interpretation.js';

// ===== THIÊN CAN / ĐỊA CHI =====
const THIEN_CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const DIA_CHI   = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const DC_EMO    = ['🐀','🐂','🐯','🐰','🐲','🐍','🐴','🐐','🐒','🐓','🐕','🐷'];

const NHC = { Kim:'#9e9e9e', Thủy:'#1E90FF', Hỏa:'#FF4500', Thổ:'#DAA520', Mộc:'#2E8B57' };
const DC_HANH = ['Thủy','Thổ','Mộc','Mộc','Thổ','Hỏa','Hỏa','Thổ','Kim','Kim','Thổ','Thủy'];
const DC_AM_DUONG = ['+','-','+','-','+','-','+','-','+','-','+','-'];

const HANH_COLOR = {
  Kim: '#9e9e9e',
  Mộc: '#2E8B57',
  Thủy: '#1565C0',
  Hỏa: '#c62828',
  Thổ: '#DAA520'
};

const GIO_TO_HOUR = {
  '23-1': 0,
  '1-3': 2,
  '3-5': 4,
  '5-7': 6,
  '7-9': 8,
  '9-11': 10,
  '11-13': 12,
  '13-15': 14,
  '15-17': 16,
  '17-19': 18,
  '19-21': 20,
  '21-23': 22
};

const GIO_CHI = {
  '23-1':{chi:'Tý',index:0},
  '1-3':{chi:'Sửu',index:1},
  '3-5':{chi:'Dần',index:2},
  '5-7':{chi:'Mão',index:3},
  '7-9':{chi:'Thìn',index:4},
  '9-11':{chi:'Tỵ',index:5},
  '11-13':{chi:'Ngọ',index:6},
  '13-15':{chi:'Mùi',index:7},
  '15-17':{chi:'Thân',index:8},
  '17-19':{chi:'Dậu',index:9},
  '19-21':{chi:'Tuất',index:10},
  '21-23':{chi:'Hợi',index:11}
};

const GIO_ALIAS_MAP = {
  ty: '23-1', 'tý': '23-1',
  suu: '1-3', 'sửu': '1-3',
  dan: '3-5', 'dần': '3-5',
  mao: '5-7', 'mão': '5-7',
  thin: '7-9', 'thìn': '7-9',
  ti: '9-11', 'tỵ': '9-11',
  ngo: '11-13', 'ngọ': '11-13',
  mui: '13-15', 'mùi': '13-15',
  than: '15-17', 'thân': '15-17',
  dau: '17-19', 'dậu': '17-19',
  tuat: '19-21', 'tuất': '19-21',
  hoi: '21-23', 'hợi': '21-23',
};

function normalizeGioSinh(gioSinh) {
  if (!gioSinh) return '11-13';
  const raw = String(gioSinh).trim();
  if (GIO_TO_HOUR[raw] !== undefined) return raw;
  return GIO_ALIAS_MAP[raw.toLowerCase()] || '11-13';
}

// ===== HELPERS =====
function getNguHanh(napAm) {
  if (!napAm) return 'Thổ';
  if (napAm.includes('Kim')) return 'Kim';
  if (napAm.includes('Thủy')) return 'Thủy';
  if (napAm.includes('Hỏa')) return 'Hỏa';
  if (napAm.includes('Thổ')) return 'Thổ';
  if (napAm.includes('Mộc')) return 'Mộc';
  return 'Thổ';
}

function tinhCanXuong(tcIdx, thang, ngay, gioChiIdx) {
  const luong = (tcIdx + thang + ngay + gioChiIdx) % 16;
  const luongVal = Math.floor(luong / 16 * 10) + 1; // 1-10 lượng
  const chiVal = Math.floor(Math.random() * 9) + 1;  // 1-9 chỉ
  return `${Math.min(luongVal, 8)} lượng ${chiVal} chỉ`;
}

function getMenhCucQuanHe(menh, cucName) {
  if (!menh || !cucName) return '';
  const cuc = cucName.replace(/Nhị|Tam|Tứ|Ngũ|Lục|Cục/gi, '').trim();
  const m = menh.replace(/Mạng|Mệnh/gi, '').trim();
  const c = cuc.trim();

  if (m === c) return 'Cục Mệnh bình hòa';

  const sinhMap = {
    'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim'
  };
  const khacMap = {
    'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim'
  };

  if (sinhMap[c] === m) return `Cục sinh Mệnh (Cục ${c} sinh Mệnh ${m})`;
  if (sinhMap[m] === c) return `Mệnh sinh Cục (Mệnh ${m} sinh Cục ${c})`;
  if (khacMap[c] === m) return `Cục khắc Mệnh (Cục ${c} khắc Mệnh ${m})`;
  if (khacMap[m] === c) return `Mệnh khắc Cục (Mệnh ${m} khắc Cục ${c})`;

  return '';
}

function getCungCanName(tcIdx, chiCung) {
  const danCanIdx = (tcIdx * 2 + 2) % 10;
  const dist = (chiCung - 2 + 12) % 12;
  const canIdx = (danCanIdx + dist) % 10;
  return THIEN_CAN[canIdx];
}

function capitalize(str) {
  if (!str) return '';
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getCanChiNam(year) {
  const tcIdx = ((year - 4) % 10 + 10) % 10;
  const dcIdx = ((year - 4) % 12 + 12) % 12;
  return `${THIEN_CAN[tcIdx]} ${DIA_CHI[dcIdx]}`;
}

function getMauSao(status) {
  if (!status) return 'xam';
  const s = status.toUpperCase();
  if (s === 'M' || s === 'V') return 'do';
  if (s === 'Đ' || s === 'B') return 'xam';
  return 'ham';
}

// ===== HẰNG SỐ BIẾN HỆ THỐNG (THEO QUY TẮC) =====
const CUNG_VARS = {
  'Mệnh':       { bien: 'x1',  code: 'MENH',       isMainCheck: true },
  'Phụ Mẫu':    { bien: 'x2',  code: 'PHU_MAU',    isMainCheck: false },
  'Phúc Đức':   { bien: 'x3',  code: 'PHUC_DUC',   isMainCheck: false },
  'Điền Trạch': { bien: 'x4',  code: 'DIEN_TRACH', isMainCheck: false },
  'Quan Lộc':   { bien: 'x5',  code: 'QUAN_LOC',   isMainCheck: true },
  'Nô Bộc':     { bien: 'x6',  code: 'NO_BOC',     isMainCheck: false },
  'Thiên Di':   { bien: 'x7',  code: 'THIEN_DI',   isMainCheck: true },
  'Tật Ách':    { bien: 'x8',  code: 'TAT_ACH',    isMainCheck: false },
  'Tài Bạch':   { bien: 'x9',  code: 'TAI_BACH',   isMainCheck: true },
  'Tử Tức':     { bien: 'x10', code: 'TU_TUC',     isMainCheck: false },
  'Phu Thê':    { bien: 'x11', code: 'PHU_THE',    isMainCheck: false },
  'Huynh Đệ':   { bien: 'x12', code: 'HUYNH_DE',   isMainCheck: false },
};

const TAM_HOP_GROUPS = [
  { key: 'HOI_MAO_MUI',  label: 'Hợi – Mão – Mùi',  chis: ['Hợi', 'Mão', 'Mùi'] },
  { key: 'DAN_NGO_TUAT', label: 'Dần – Ngọ – Tuất', chis: ['Dần', 'Ngọ', 'Tuất'] },
  { key: 'THAN_TY_THIN', label: 'Thân – Tý – Thìn', chis: ['Thân', 'Tý', 'Thìn'] },
  { key: 'TY_DAU_SUU',   label: 'Tỵ – Dậu – Sửu',   chis: ['Tỵ', 'Dậu', 'Sửu'] },
];

const CHINH_TINH_LIST = [
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

const CAT_TINH_CORE = [
  { code: 'TA_PHU',     ten: 'Tả Phù' },
  { code: 'HUU_BAT',    ten: 'Hữu Bật' },
  { code: 'VAN_XUONG',  ten: 'Văn Xương' },
  { code: 'VAN_KHUC',   ten: 'Văn Khúc' },
  { code: 'THIEN_KHOI', ten: 'Thiên Khôi' },
  { code: 'THIEN_VIET', ten: 'Thiên Việt' },
];

const HUNG_TINH_CORE = [
  { code: 'KINH_DUONG', ten: 'Kình Dương' },
  { code: 'DA_LA',      ten: 'Đà La' },
  { code: 'HOA_TINH',   ten: 'Hỏa Tinh' },
  { code: 'LINH_TINH',  ten: 'Linh Tinh' },
  { code: 'DIA_KHONG',  ten: 'Địa Không' },
  { code: 'DIA_KIEP',   ten: 'Địa Kiếp' },
];

const ALL_KNOWN_STAR_VARS = [
  ...CHINH_TINH_LIST,
  ...CAT_TINH_CORE,
  ...HUNG_TINH_CORE,
  { code: 'LOC_TON', ten: 'Lộc Tồn' },
  { code: 'THIEN_MA', ten: 'Thiên Mã' },
  { code: 'HOA_LOC', ten: 'Hóa Lộc' },
  { code: 'HOA_QUYEN', ten: 'Hóa Quyền' },
  { code: 'HOA_KHOA', ten: 'Hóa Khoa' },
  { code: 'HOA_KY', ten: 'Hóa Kỵ' },
  { code: 'DAO_HOA', ten: 'Đào Hoa' },
  { code: 'HONG_LOAN', ten: 'Hồng Loan' },
  { code: 'THIEN_HINH', ten: 'Thiên Hình' },
  { code: 'CO_THAN', ten: 'Cô Thần' },
  { code: 'QUA_TU', ten: 'Quả Tú' },
  { code: 'THIEN_KHOC', ten: 'Thiên Khốc' },
  { code: 'THIEN_HU', ten: 'Thiên Hư' },
  { code: 'BACH_HO', ten: 'Bạch Hổ' },
  { code: 'TANG_MON', ten: 'Tang Môn' },
  { code: 'TUAN_KHONG', ten: 'Tuần Không' },
  { code: 'TRIET_LO', ten: 'Triệt Lộ' },
];

const CAT_TINH_CODES = new Set([
  'TA_PHU', 'HUU_BAT', 'VAN_XUONG', 'VAN_KHUC', 'THIEN_KHOI', 'THIEN_VIET',
  'LOC_TON', 'THIEN_MA', 'HOA_LOC', 'HOA_QUYEN', 'HOA_KHOA',
  'QUANG_QUY', 'AN_QUANG', 'THIEN_QUY', 'THIEN_QUAN', 'THIEN_PHUC',
  'THIEN_GIAI', 'DIA_GIAI', 'GIAI_THAN', 'DAO_HOA', 'HONG_LOAN', 'THIEN_HY', 'THIEN_HI',
  'TAM_THAI', 'BAT_TOA', 'PHONG_CAO', 'THIEN_TAI', 'THIEN_THO', 'LONG_TRI',
  'PHUONG_CAC', 'PHUNG_CAC', 'QUOC_AN', 'DUONG_PHU', 'THAI_PHU', 'HOA_CAI',
  'BAC_SY', 'THIEN_DUC', 'NGUYET_DUC', 'LONG_DUC', 'PHUC_DUC', 'THIEN_Y', 'VAN_TINH'
]);

const HUNG_TINH_CODES = new Set([
  'KINH_DUONG', 'DA_LA', 'HOA_TINH', 'LINH_TINH', 'DIA_KHONG', 'DIA_KIEP',
  'HOA_KY', 'THIEN_HINH', 'THIEN_DIEU', 'KIEP_SAT', 'DAI_HAO', 'TIEU_HAO',
  'TUE_PHA', 'THIEN_KHOC', 'THIEN_HU', 'CO_THAN', 'QUA_TU', 'BACH_HO',
  'TANG_MON', 'DIEU_KHACH', 'PHA_TOAI', 'QUAN_PHU', 'TU_PHU', 'THIEN_LA',
  'DIA_VONG', 'PHUC_BINH', 'LUU_HA', 'THIEN_KHONG', 'DAU_QUAN', 'THIEN_THUONG',
  'THIEN_SU', 'BENH_PHU', 'THAI_TUE', 'TRUC_PHU', 'TUAN_KHONG', 'TRIET_LO'
]);

function toStarCode(name) {
  if (!name) return '';
  return String(name)
    .replace(/^L\.\s*/i, 'L_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function getTamHopByDiaChi(diaChi) {
  return TAM_HOP_GROUPS.find(g => g.chis.includes(diaChi)) || null;
}

function extractStarCodesFromText(text) {
  if (!text) return [];
  const normalizedUpper = String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'D')
    .toUpperCase();
  const found = new Set();
  for (const s of ALL_KNOWN_STAR_VARS) {
    const tenNorm = s.ten
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'D')
      .toUpperCase();
    if (normalizedUpper.includes(s.code) || normalizedUpper.includes(tenNorm)) {
      found.add(s.code);
    }
  }
  return Array.from(found);
}

function getHoaLoai(name) {
  const n = name.toLowerCase();
  if (n.includes('lộc')) return 'hoa-loc';
  if (n.includes('quyền')) return 'hoa-quyen';
  if (n.includes('khoa')) return 'hoa-khoa';
  if (n.includes('kỵ')) return 'hoa-ky';
  return 'hoa-loc';
}

function getSaoPhuLoai(name) {
  const n = name.toLowerCase();
  if (['kình dương', 'đà la', 'hỏa tinh', 'linh tinh', 'địa không', 'địa kiếp', 'thiên hình', 'thiên diêu', 'kiếp sát', 'đại hao', 'tiểu hao', 'phục binh', 'quan phủ', 'quan phù', 'đường phù', 'tuế phá', 'thiên khốc', 'thiên hư'].some(x => n.includes(x))) {
    return 'sat';
  }
  if (['lộc tồn', 'thiên mã'].some(x => n.includes(x))) return 'loc';
  if (['văn xương', 'văn khúc', 'đường thư', 'tấu thư', 'phong cáo'].some(x => n.includes(x))) return 'van';
  if (['thiên khôi', 'thiên việt', 'tả phù', 'hữu bật', 'thiên quan', 'thiên phúc', 'long đức', 'nguyệt đức', 'thiên đức', 'giải thần', 'phượng các', 'tam thai', 'bát tọa', 'ân quang', 'thiên quý'].some(x => n.includes(x))) return 'quy';
  if (['hồng loan', 'thiên hỷ', 'đào hoa'].some(x => n.includes(x))) return 'dao';
  return 'tro';
}

function getSaoPhuMau(name) {
  const type = getSaoPhuLoai(name);
  if (type === 'sat') return 'ham';
  if (type === 'loc' || type === 'quy' || type === 'dao') return 'do';
  return 'xam';
}

// ===== CÂN LƯỢNG & CAN CHI HELPERS =====
const NAP_AM_MAP = {
  'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phú Đăng Hỏa', 'Ất Tỵ': 'Phú Đăng Hỏa',
  'Bính Ngọ': 'Sa Trung Thổ', 'Đinh Mùi': 'Sa Trung Thổ',
  'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy'
};

const CAN_LUONG_YEAR = {
  'Giáp Tý': 1.2, 'Ất Sửu': 0.9, 'Bính Dần': 0.6, 'Đinh Mão': 0.7, 'Mậu Thìn': 1.2,
  'Kỷ Tỵ': 0.4, 'Canh Ngọ': 0.9, 'Tân Mùi': 0.8, 'Nhâm Thân': 0.7, 'Quý Dậu': 0.8,
  'Giáp Tuất': 1.5, 'Ất Hợi': 0.9, 'Bính Tý': 1.6, 'Đinh Sửu': 0.8, 'Mậu Dần': 0.8,
  'Kỷ Mão': 1.9, 'Canh Thìn': 1.2, 'Tân Tỵ': 0.6, 'Nhâm Ngọ': 0.8, 'Quý Mùi': 1.9,
  'Giáp Thân': 0.5, 'Ất Dậu': 1.5, 'Bính Tuất': 0.6, 'Đinh Hợi': 1.6, 'Mậu Tý': 1.5,
  'Kỷ Sửu': 0.8, 'Canh Dần': 0.9, 'Tân Mão': 1.2, 'Nhâm Thìn': 1.0, 'Quý Tỵ': 0.7,
  'Giáp Ngọ': 1.5, 'Ất Mùi': 0.5, 'Bính Thân': 0.5, 'Đinh Dậu': 1.4, 'Mậu Tuất': 1.4,
  'Kỷ Hợi': 0.9, 'Canh Tý': 0.7, 'Tân Sửu': 0.7, 'Nhâm Dần': 0.9, 'Quý Mão': 1.2,
  'Giáp Thìn': 1.2, 'Ất Tỵ': 0.7, 'Bính Ngọ': 1.3, 'Đinh Mùi': 0.5, 'Mậu Thân': 1.4,
  'Kỷ Dậu': 0.5, 'Canh Tuất': 0.9, 'Tân Hợi': 1.7, 'Nhâm Tý': 0.5, 'Quý Sửu': 0.8,
  'Giáp Dần': 1.5, 'Ất Mão': 0.8, 'Bính Thìn': 0.8, 'Đinh Tỵ': 0.6, 'Mậu Ngọ': 1.9,
  'Kỷ Mùi': 0.6, 'Canh Thân': 0.8, 'Tân Dậu': 0.8, 'Nhâm Tuất': 1.0, 'Quý Hợi': 0.7
};

const CAN_LUONG_MONTH = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.9, 1.5, 1.8, 0.8, 0.9, 0.5];

const CAN_LUONG_DAY = [
  0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6,
  0.9, 1.7, 0.8, 1.7, 1.0, 0.8, 0.9, 1.8, 0.5, 1.5,
  1.0, 0.9, 0.8, 0.9, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6
];

const CAN_LUONG_HOUR = {
  'Tý': 1.6, 'Sửu': 0.6, 'Dần': 0.7, 'Mão': 1.0, 'Thìn': 0.9, 'Tỵ': 1.6,
  'Ngọ': 1.0, 'Mùi': 0.8, 'Thân': 0.8, 'Dậu': 0.9, 'Tuất': 0.6, 'Hợi': 0.6
};

function calculateCanXuong(canChiNam, lunarMonth, lunarDay, gioChiName) {
  const yVal = CAN_LUONG_YEAR[canChiNam] || 1.0;
  const mVal = CAN_LUONG_MONTH[lunarMonth - 1] || 1.0;
  const dVal = CAN_LUONG_DAY[lunarDay - 1] || 1.0;
  const hVal = CAN_LUONG_HOUR[gioChiName] || 1.0;
  const total = Math.round((yVal + mVal + dVal + hVal) * 10) / 10;
  const luong = Math.floor(total);
  const chi = Math.round((total - luong) * 10);
  return `${luong} lượng ${chi} chỉ`;
}

function getCanChiGio(dayCan, gioChiIdx) {
  const dayCanIdx = THIEN_CAN.indexOf(dayCan);
  if (dayCanIdx === -1) return '';
  const startCanIdx = (dayCanIdx % 5 * 2) % 10;
  const hourCanIdx = (startCanIdx + gioChiIdx) % 10;
  return `${THIEN_CAN[hourCanIdx]} ${DIA_CHI[gioChiIdx]}`;
}

function getCanChiThang(yearCan, lunarMonth) {
  const tcIdx = THIEN_CAN.indexOf(yearCan);
  if (tcIdx === -1) return '';
  const startCanIdx = (tcIdx % 5 * 2 + 2) % 10;
  const monthCanIdx = (startCanIdx + (lunarMonth - 1)) % 10;
  const monthChiIdx = (lunarMonth + 1) % 12; // Month 1 is Dần (index 2)
  return `${THIEN_CAN[monthCanIdx]} ${DIA_CHI[monthChiIdx]}`;
}

function addLuuStars(cungResults, namXem) {
  const tcIdx = ((namXem - 4) % 10 + 10) % 10;
  const dcIdx = ((namXem - 4) % 12 + 12) % 12;

  // Placements
  const luuThaiTueChi = dcIdx;
  const luuTangMonChi = (dcIdx + 2) % 12;
  const luuBachHoChi = (dcIdx + 8) % 12;
  const L_LOC_TON_MAP = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
  const luuLocTonChi = L_LOC_TON_MAP[tcIdx];
  const luuKinhDuongChi = (luuLocTonChi + 1) % 12;
  const luuDaLaChi = (luuLocTonChi + 11) % 12;
  const luuThienKhocChi = (6 - dcIdx + 12) % 12;
  const luuThienHuChi = (6 + dcIdx) % 12;
  
  const L_THIEN_MA_MAP = {
    2: 8, 6: 8, 10: 8,
    8: 2, 0: 2, 4: 2,
    5: 11, 9: 11, 1: 11,
    11: 5, 3: 5, 7: 5
  };
  const luuThienMaChi = L_THIEN_MA_MAP[dcIdx] || 8;

  const addLuuStar = (chiIdx, name) => {
    const cung = cungResults.find(c => {
      const DC_TO_GRID_MAP = { 2:0, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 0:10, 1:11 };
      return c.gridIdx === DC_TO_GRID_MAP[chiIdx];
    });
    if (cung) {
      const code = toStarCode(name);
      const isCatLuu = name.includes('Lộc Tồn') || name.includes('Thiên Mã');
      cung.saoPhuList.push({
        ten: name,
        code,
        nhomSao: isCatLuu ? 'cat' : 'hung',
        trangThai: '',
        mau: isCatLuu ? 'xanh' : 'do',
        loai: isCatLuu ? 'loc' : 'sat',
        amDuong: '',
        isLuu: true
      });
    }
  };

  addLuuStar(luuThaiTueChi, 'L.Thái Tuế');
  addLuuStar(luuTangMonChi, 'L.Tang Môn');
  addLuuStar(luuBachHoChi, 'L.Bạch Hổ');
  addLuuStar(luuLocTonChi, 'L.Lộc Tồn');
  addLuuStar(luuKinhDuongChi, 'L.Kình Dương');
  addLuuStar(luuDaLaChi, 'L.Đà La');
  addLuuStar(luuThienKhocChi, 'L.Thiên Khốc');
  addLuuStar(luuThienHuChi, 'L.Thiên Hư');
  addLuuStar(luuThienMaChi, 'L.Thiên Mã');

  // L.Hóa Lộc, L.Hóa Quyền, L.Hóa Khoa, L.Hóa Kỵ
  const TU_HOA_MAP = {
    0: { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' },
    1: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
    2: { loc: 'Thiên Đồng', quyen: 'Thiên Cơ', khoa: 'Văn Xương', ky: 'Liêm Trinh' },
    3: { loc: 'Thái Âm', quyen: 'Thiên Đồng', khoa: 'Thiên Cơ', ky: 'Cự Môn' },
    4: { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
    5: { loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
    6: { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
    7: { loc: 'Cự Môn', quyen: 'Thái Dương', khoa: 'Văn Khúc', ky: 'Văn Xương' },
    8: { loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phù', ky: 'Vũ Khúc' },
    9: { loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' }
  };

  const tuHoa = TU_HOA_MAP[tcIdx];
  if (tuHoa) {
    const addLuuHoa = (starName, label) => {
      const targetCung = cungResults.find(c => {
        const hasChinh = c.saoChinhList.some(s => s.ten.toLowerCase() === starName.toLowerCase());
        const hasPhu = c.saoPhuList.some(s => s.ten.toLowerCase() === starName.toLowerCase());
        return hasChinh || hasPhu;
      });
      if (targetCung) {
        const hoaLoai = label.toLowerCase().includes('lộc') ? 'hoa-loc' :
          label.toLowerCase().includes('quyền') ? 'hoa-quyen' :
          label.toLowerCase().includes('khoa') ? 'hoa-khoa' : 'hoa-ky';
        targetCung.hoaTinhList.push({
          ten: label,
          code: toStarCode(label),
          nhomSao: hoaLoai === 'hoa-ky' ? 'hung' : 'cat',
          loai: hoaLoai,
          isLuu: true
        });
      }
    };

    addLuuHoa(tuHoa.loc, 'L.Hóa Lộc');
    addLuuHoa(tuHoa.quyen, 'L.Hóa Quyền');
    addLuuHoa(tuHoa.khoa, 'L.Hóa Khoa');
    addLuuHoa(tuHoa.ky, 'L.Hóa Kỵ');
  }
}

// ===== MAIN CALCULATION WRAPPER =====
export async function calcTuVi({ hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem, birthHour: preciseHour, birthMin: preciseMin }) {
  const year = parseInt(namSinh);
  const month = parseInt(thangSinh);
  const day = parseInt(ngaySinh);
  const namXemInt = parseInt(namXem) || new Date().getFullYear();
  const normalizedGio = normalizeGioSinh(gioSinh);
  const birthHour = GIO_TO_HOUR[normalizedGio] !== undefined ? GIO_TO_HOUR[normalizedGio] : 12;

  // 1. Calculate using tuvi-neo library
  const laso = generateLaSo({
    name: hoTen,
    gender: gioiTinh === 'nam' ? 'male' : 'female',
    birth: {
      isLunar: !!isLunar,
      year,
      month,
      day,
      hour: birthHour,
      minute: 0,
    },
  });

  // Extract variables
  const [tc, dc] = laso.Info.Nam.split(' ');
  const tcIdx = THIEN_CAN.indexOf(tc);
  const dcIdx = DIA_CHI.indexOf(dc);

  // Get Solar & Lunar conversion & Can Chi details using @dqcai/vn-lunar
  let sDay = day, sMonth = month, sYear = year;
  let lDay = day, lMonth = month, lYear = year;
  let jdValue = 2448058; // fallback

  try {
    if (isLunar) {
      const sDate = getSolarDate(day, month, year, false);
      sDay = sDate.day;
      sMonth = sDate.month;
      sYear = sDate.year;
      jdValue = sDate.jd;
    } else {
      const lDate = getLunarDate(day, month, year);
      lDay = lDate.day;
      lMonth = lDate.month;
      lYear = lDate.year;
      jdValue = lDate.jd;
    }
  } catch (e) {
    console.error('Error during Lunar/Solar conversion:', e);
  }

  const birthCanChi = `${tc} ${dc}`;
  const napAm = NAP_AM_MAP[birthCanChi] || 'Lộ Bàng Thổ';
  const nguHanh = getNguHanh(napAm);
  const cuc = { name: laso.Info.Cuc, value: laso.Info.CucNH };

  const gioChiName = laso.Info.Gio;
  const gioChiIdx = GIO_CHI[normalizedGio]?.index || 0;

  // Can Chi calculations for Month, Day, Hour
  const lunarMonthCanChi = getCanChiThang(tc, lMonth);
  const lunarDayCanChi = getDayCanChi(jdValue);
  const dayCan = lunarDayCanChi.split(' ')[0];
  const gioCanChiName = getCanChiGio(dayCan, gioChiIdx);

  // Accurate display time string
  const displayHour = preciseHour !== undefined ? parseInt(preciseHour) : birthHour;
  const displayMin = preciseMin !== undefined ? parseInt(preciseMin) : 0;
  const gioHour = `${displayHour} giờ ${displayMin} phút ${gioCanChiName}`;

  const amDuong = laso.Info.AmDuong;
  const tuoi = namXemInt - year + 1;
  const namXemCanChi = `${getCanChiNam(namXemInt)} (${namXemInt})`;

  const chuMenh = capitalize(laso.Info.ChuMenh);
  const chuThan = capitalize(laso.Info.ChuThan);
  const tenCungThan = laso.Info.ThanCu ? capitalize(laso.Info.ThanCu.replace("Thân cư ", "")) : "";
  const canXuong = calculateCanXuong(birthCanChi, lMonth, lDay, gioChiName);

  const cungs = laso.Cac_cung;
  const cungMenh = cungs.find(c => c.Name.toLowerCase() === 'mệnh');
  const cungMenhDCIdx = cungMenh ? cungMenh.ChiCung : 0;
  
  const DC_TO_GRID_MAP = { 2:0, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 0:10, 1:11 };
  const cungMenhGridIdx = DC_TO_GRID_MAP[cungMenhDCIdx] || 0;

  // Standard Names & Icons in order (from Mệnh)
  const CUNG_NAMES = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
  const CUNG_ICONS = ['👤','👨‍👩‍👧','🙏','🏠','💼','🤝','✈️','🏥','💰','👶','💑','👫'];
  
  const cungResults = [];
  const menhIdx = cungs.findIndex(c => c.Name.toLowerCase() === 'mệnh');

  for (let i = 0; i < 12; i++) {
    const cungObj = cungs[(menhIdx + i) % 12];
    const cungName = CUNG_NAMES[i];
    const icon = CUNG_ICONS[i];
    const gridIdx = DC_TO_GRID_MAP[cungObj.ChiCung];
    const daiHan = cungObj.SoCuc;
    
    // Shift Tháng Hạn by exactly 6 months to match tuvi.vn
    const thangHan = (cungObj.ThangHan + 5) % 12 + 1;

    // Thiên can / Địa chi của cung
    const dcName = DIA_CHI[cungObj.ChiCung];
    const cungCanName = getCungCanName(tcIdx, cungObj.ChiCung);
    const displayCanChi = `${cungCanName.charAt(0)}.${dcName}`;
    const hanhDC = DC_HANH[cungObj.ChiCung];
    const amDuongCung = DC_AM_DUONG[cungObj.ChiCung];
    const cungVarMeta = CUNG_VARS[cungName] || { bien: `x${i + 1}`, code: `CUNG_${i + 1}`, isMainCheck: false };

    // Sao chính
    const saoChinhList = (cungObj.ChinhTinh || []).map(s => {
      const ten = capitalize(s.Name);
      return {
        ten,
        code: toStarCode(ten),
        nhomSao: 'chinh',
        trangThai: s.Status || '',
        mau: getMauSao(s.Status),
        loai: 'chinh',
        amDuong: cungObj.NguHanhCung % 2 === 0 ? '+' : '-'
      };
    });

    // Sao phụ & Hóa tinh
    const saoPhuList = [];
    const hoaTinhList = [];

    // Filter and split Cát tinh (màu xanh lá)
    (cungObj.Saotot || []).forEach(s => {
      const ten = capitalize(s.Name);
      const code = toStarCode(ten);
      const isHung = HUNG_TINH_CODES.has(code);
      if (ten.startsWith('Hóa ')) {
        const hoaLoai = getHoaLoai(ten);
        hoaTinhList.push({
          ten,
          code,
          nhomSao: hoaLoai === 'hoa-ky' ? 'hung' : 'cat',
          loai: hoaLoai
        });
      } else {
        saoPhuList.push({
          ten,
          code,
          nhomSao: isHung ? 'hung' : 'cat',
          trangThai: s.Status || '',
          mau: isHung ? 'do' : 'xanh',
          loai: getSaoPhuLoai(ten),
          amDuong: ''
        });
      }
    });

    // Filter and split Hung tinh (màu đỏ)
    (cungObj.Saoxau || []).forEach(s => {
      const ten = capitalize(s.Name);
      const code = toStarCode(ten);
      const isCat = CAT_TINH_CODES.has(code);
      if (ten.startsWith('Hóa ')) {
        const hoaLoai = getHoaLoai(ten);
        hoaTinhList.push({
          ten,
          code,
          nhomSao: hoaLoai === 'hoa-ky' ? 'hung' : 'cat',
          loai: hoaLoai
        });
      } else {
        saoPhuList.push({
          ten,
          code,
          nhomSao: isCat ? 'cat' : 'hung',
          trangThai: s.Status || '',
          mau: isCat ? 'xanh' : 'do',
          loai: getSaoPhuLoai(ten),
          amDuong: ''
        });
      }
    });

    // Thêm Tràng Sinh
    if (cungObj.TrangSinh) {
      const tsName = capitalize(cungObj.TrangSinh);
      saoPhuList.push({
        ten: tsName,
        code: toStarCode(tsName),
        nhomSao: 'cat',
        trangThai: '',
        mau: 'xam',
        loai: 'tro',
        amDuong: ''
      });
    }

    // Thêm Tuần/Triệt
    if (cungObj.Tuan === 1) {
      saoPhuList.push({ ten: 'Tuần Không', code: 'TUAN_KHONG', nhomSao: 'hung', trangThai: '', mau: 'do', loai: 'sat', amDuong: '' });
    }
    if (cungObj.Triet === 1) {
      saoPhuList.push({ ten: 'Triệt Lộ', code: 'TRIET_LO', nhomSao: 'hung', trangThai: '', mau: 'do', loai: 'sat', amDuong: '' });
    }

    // Rating
    const seed = year * 10000 + month * 100 + day + i * 13;
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    const rating = Math.floor((x - Math.floor(x)) * 5) + 1;

    cungResults.push({
      gridIdx,
      bienCode: cungVarMeta.bien,
      cungCode: cungVarMeta.code,
      diaChi: dcName,
      isMainCheckGroup: cungVarMeta.isMainCheck,
      name: cungName,
      icon,
      daiHan,
      thangHan,
      canChi: displayCanChi,
      canName: cungCanName,
      hanhDisplay: `${amDuongCung}${hanhDC}`,
      hanhColor: HANH_COLOR[hanhDC] || '#666',
      hanhDC,
      isMenh: i === 0,
      isMinh: cungObj.Than === 1,
      saoChinhList,
      saoPhuList,
      hoaTinhList,
      namXemHoaTinh: [],
      rating,
      trangSinh: cungObj.TrangSinh ? capitalize(cungObj.TrangSinh) : '',
      interpretation: ''
    });
  }

  // 1.5 Calculate & Inject 13 dynamic Lưu stars for Year of Query (namXem)
  addLuuStars(cungResults, namXemInt);

  // 2. Fetch and compile CMS interpretations in 1 single optimized DB query
  const allStarNames = [];
  cungResults.forEach(c => {
    c.saoChinhList.forEach(s => allStarNames.push(s.ten));
    c.saoPhuList.forEach(s => allStarNames.push(s.ten));
    c.hoaTinhList.forEach(s => allStarNames.push(s.ten));
  });

  const interpList = await Interpretation.find({
    $or: [
      { type: 'cung', cung: { $in: CUNG_NAMES } },
      { type: 'sao', sao: { $in: allStarNames } },
      { type: 'sao_cung', cung: { $in: CUNG_NAMES }, sao: { $in: allStarNames } },
      { type: { $in: ['bo_sao_phoi', 'cach_cuc'] } }
    ]
  }).lean();

  // Assign compiled texts in-memory
  cungResults.forEach(cung => {
    const cungName = cung.name;
    const textParts = [];

    // Overall Cung description
    const cungInterps = interpList.filter(item => item.type === 'cung' && item.cung.toLowerCase() === cungName.toLowerCase());
    if (cungInterps.length > 0) {
      textParts.push(`<h4>Ý nghĩa cung ${cungName}</h4><p>${cungInterps[0].content}</p>`);
    }

    // Main stars in cung
    cung.saoChinhList.forEach(sao => {
      let starCungInterp = interpList.find(item => 
        item.type === 'sao_cung' && 
        item.cung.toLowerCase() === cungName.toLowerCase() && 
        item.sao.toLowerCase() === sao.ten.toLowerCase() &&
        item.trangThai === sao.trangThai
      );
      
      if (!starCungInterp) {
        starCungInterp = interpList.find(item => 
          item.type === 'sao_cung' && 
          item.cung.toLowerCase() === cungName.toLowerCase() && 
          item.sao.toLowerCase() === sao.ten.toLowerCase() &&
          !item.trangThai
        );
      }

      if (starCungInterp) {
        textParts.push(`<h4>Sao ${sao.ten} tại cung ${cungName} (${sao.trangThai || 'Bình hòa'})</h4><p>${starCungInterp.content}</p>`);
      } else {
        const starInterp = interpList.find(item => item.type === 'sao' && item.sao.toLowerCase() === sao.ten.toLowerCase());
        if (starInterp) {
          textParts.push(`<h4>Ý nghĩa sao ${sao.ten}</h4><p>${starInterp.content}</p>`);
        }
      }
    });

    // Auxiliary & Hóa stars in cung
    cung.saoPhuList.concat(cung.hoaTinhList).forEach(sao => {
      const starCungInterp = interpList.find(item => 
        item.type === 'sao_cung' && 
        item.cung.toLowerCase() === cungName.toLowerCase() && 
        item.sao.toLowerCase() === sao.ten.toLowerCase()
      );
      if (starCungInterp) {
        textParts.push(`<h4>Sao ${sao.ten} tại cung ${cungName}</h4><p>${starCungInterp.content}</p>`);
      }
    });

    cung.interpretation = textParts.join('\n');
  });

  // Calculate Đại Vận & Lưu Niên labels
  const dvMenhIdx = cungResults.findIndex(c => tuoi >= c.daiHan && tuoi < c.daiHan + 10);
  const dvMenhGridIdx = dvMenhIdx !== -1 ? cungResults[dvMenhIdx].gridIdx : 0;
  const birthHourIdx = GIO_CHI[gioSinh]?.index || 0;
  const lnMenhGridIdx = (dvMenhGridIdx - birthHourIdx + 12) % 12;
  const lnMenhIdx = cungResults.findIndex(c => c.gridIdx === lnMenhGridIdx);

  const DV_NAMES = ['MỆNH', 'PHỤ', 'PHÚC', 'ĐIỀN', 'QUAN', 'NÔ', 'DI', 'TẬT', 'TÀI', 'TỬ', 'PHỐI', 'HUYNH'];
  const LN_NAMES = ['MỆNH', 'PHỤ', 'PHÚC', 'ĐIỀN', 'QUAN', 'NÔ', 'DI', 'TẬT', 'TÀI', 'TỬ', 'PHỐI', 'HUYNH'];

  const isClockwise = amDuong.includes('Dương Nam') || amDuong.includes('Âm Nữ');

  for (let idx = 0; idx < 12; idx++) {
    let dvDist;
    if (isClockwise) {
      dvDist = (idx - (dvMenhIdx !== -1 ? dvMenhIdx : 0) + 12) % 12;
    } else {
      dvDist = ((dvMenhIdx !== -1 ? dvMenhIdx : 0) - idx + 12) % 12;
    }
    cungResults[idx].dvLabel = `ĐV.${DV_NAMES[dvDist]}`;

    const lnDist = (idx - (lnMenhIdx !== -1 ? lnMenhIdx : 0) + 12) % 12;
    cungResults[idx].lnLabel = `LN.${LN_NAMES[lnDist]}`;
  }

  // Find Lai nhân cung
  const laiNhanCungObj = cungResults.find(c => c.canName === tc);
  const laiNhanCung = laiNhanCungObj ? laiNhanCungObj.name : 'Mệnh';

  const menhCucRelation = getMenhCucQuanHe(nguHanh, laso.Info.Cuc);

  // 3. Đối chiếu Bộ sao Phối (Mệnh - Tài Bạch - Quan Lộc - Thiên Di) cho Quán Tử Vi
  const boSaoRules = interpList.filter(item => item.type === 'bo_sao_phoi' || item.type === 'cach_cuc');
  const quanTuViResults = matchBoSaoPhoi(cungResults, boSaoRules);

  return {
    hoTen,
    gioiTinh,
    ngaySinh: sDay,
    thangSinh: sMonth,
    namSinh: sYear,
    gioSinh,
    isLunar: !!isLunar,
    namXem: namXemInt,
    thangXem: thangXem ? parseInt(thangXem) : month,
    lunarDay: lDay,
    lunarMonth: lMonth,
    lunarMonthCanChi,
    lunarDayCanChi,
    menhCucRelation,
    canChi: `${tc} ${dc}`,
    thienCan: tc,
    diaChi: dc,
    tcIdx,
    dcIdx,
    conGiap: { name: dc, emoji: DC_EMO[dcIdx] || '🐉', index: dcIdx },
    napAm,
    nguHanh,
    nguHanhColor: NHC[nguHanh] || '#D4AF37',
    cuc,
    gioChiName,
    gioHour,
    amDuong,
    namXemCanChi,
    tuoi,
    chuMenh,
    chuThan,
    laiNhanCung,
    canXuong,
    tenCungThan,
    cungMenhDCIdx,
    cungMenhGridIdx,
    cungResults,
    quanTuViResults,
    advice: [`Bản mệnh ${nguHanh}, ${cuc.name}. Cân xương: ${canXuong}.`],
    overallRating: Math.round(cungResults.reduce((s, c) => s + c.rating, 0) / cungResults.length * 10) / 10,
  };
}

const GRID_DIACHI_LIST = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];

/**
 * Thuật toán đối chiếu bộ sao Quán Tử Vi:
 * Đọc 12 cung -> lấy nhóm kiểm tra chính Mệnh (x1), Tài Bạch (x9), Quan Lộc (x5), Thiên Di (x7)
 * -> đối chiếu quy tắc bộ sao phối -> trả về nội dung tương ứng.
 */
function matchBoSaoPhoi(cungResults, boSaoRules = []) {
  if (!Array.isArray(cungResults) || cungResults.length === 0) return [];

  const mainCheckCodes = ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'];
  const cungsByCode = {};
  const starsByCode = {};

  cungResults.forEach((c) => {
    const varInfo = CUNG_VARS[c.name] || {};
    const cCode = c.cungCode || varInfo.code;
    const diaChi = c.diaChi || GRID_DIACHI_LIST[c.gridIdx] || '';
    if (!cCode) return;

    cungsByCode[cCode] = { ...c, cungCode: cCode, diaChi };
    const collected = [];
    const seenInCung = new Set();

    const pushStar = (s, defaultGroup) => {
      if (!s || !s.ten) return;
      if (s.ten === c.trangSinh) return; // Loại bỏ Tràng Sinh khỏi bộ sao phối
      if (s.isLuu) return; // Chỉ xét sao cố định bản mệnh khi đối chiếu bộ sao phối
      const sCode = s.code || toStarCode(s.ten);
      if (!sCode || seenInCung.has(sCode)) return;
      seenInCung.add(sCode);
      collected.push({
        code: sCode,
        ten: s.ten,
        trangThai: s.trangThai || '',
        nhomSao: s.nhomSao || defaultGroup,
        cungCode: cCode,
        cungName: c.name,
        diaChi,
      });
    };

    (c.saoChinhList || []).forEach(s => pushStar(s, 'chinh'));
    (c.saoPhuList || []).forEach(s => pushStar(s, CAT_TINH_CODES.has(s.code || toStarCode(s.ten)) ? 'cat' : 'hung'));
    (c.hoaTinhList || []).forEach(s => pushStar(s, s.loai === 'hoa-ky' ? 'hung' : 'cat'));

    starsByCode[cCode] = collected;
  });

  const menhCung = cungsByCode.MENH;
  const menhTamHop = getTamHopByDiaChi(menhCung?.diaChi);
  const results = [];

  // 1. Đối chiếu các quy tắc Bộ sao Phối / Cách cục từ CMS
  boSaoRules.forEach((rule) => {
    if (rule.tamHopGroup && menhTamHop?.key !== rule.tamHopGroup) return;

    const targetCungs = (Array.isArray(rule.cungCodes) && rule.cungCodes.length > 0)
      ? rule.cungCodes
      : mainCheckCodes;

    const requiredStars = (Array.isArray(rule.saoCodes) && rule.saoCodes.length > 0)
      ? rule.saoCodes
      : extractStarCodesFromText(rule.boSaoPhoi || rule.tenCachCuc);

    if (requiredStars.length === 0) return;

    const pool = targetCungs.flatMap(cc => starsByCode[cc] || []);
    const matchedStars = [];
    const matchedCungs = new Set();

    const allMatched = requiredStars.every((reqCode) => {
      const hit = pool.find(s => s.code === reqCode);
      if (hit) {
        matchedStars.push(`${hit.ten} (${hit.cungName})`);
        matchedCungs.add(hit.cungName);
        return true;
      }
      return false;
    });

    if (allMatched) {
      results.push({
        id: rule._id ? String(rule._id) : '',
        boSaoPhoi: rule.boSaoPhoi || rule.tenCachCuc || matchedStars.join(' + '),
        matchedStars,
        matchedCungs: Array.from(matchedCungs),
        tamHopGroup: menhTamHop?.label || '',
        content: rule.content,
        source: rule.source || 'Quán Tử Vi CMS',
        isCustomRule: true,
      });
    }
  });

  // 2. Luôn tạo dòng tổng hợp thực tế 4 cung Mệnh – Tài Bạch – Quan Lộc – Thiên Di của lá số
  const mainCungsSummary = mainCheckCodes
    .map(cc => {
      const c = cungsByCode[cc];
      if (!c) return null;
      const allS = starsByCode[cc] || [];
      const chinh = allS.filter(s => s.nhomSao === 'chinh').map(s => `${s.ten}${s.trangThai ? ` (${s.trangThai})` : ''}`);
      const cat = allS.filter(s => s.nhomSao === 'cat' && CAT_TINH_CORE.some(k => k.code === s.code)).map(s => s.ten);
      const hung = allS.filter(s => s.nhomSao === 'hung' && HUNG_TINH_CORE.some(k => k.code === s.code)).map(s => s.ten);
      return {
        cungCode: cc,
        bienCode: c.bienCode || CUNG_VARS[c.name]?.bien || '',
        cungName: c.name,
        diaChi: c.diaChi,
        chinh,
        cat,
        hung,
        interpretation: c.interpretation || '',
      };
    })
    .filter(Boolean);

  if (mainCungsSummary.length > 0) {
    const labelLines = mainCungsSummary.map((item) => {
      const parts = [];
      if (item.chinh.length) parts.push(`Chính tinh: ${item.chinh.join(', ')}`);
      else parts.push('Vô Chính Diệu');
      if (item.cat.length) parts.push(`Cát: ${item.cat.join(', ')}`);
      if (item.hung.length) parts.push(`Hung: ${item.hung.join(', ')}`);
      return `${item.cungName} [${item.diaChi}]: ${parts.join(' · ')}`;
    });

    const totalCat = mainCungsSummary.reduce((acc, x) => acc + x.cat.length, 0);
    const totalHung = mainCungsSummary.reduce((acc, x) => acc + x.hung.length, 0);
    const overviewHtml = [
      `<p><strong>Nhóm Tam phương Tứ chính Mệnh – Tài – Quan – Di</strong> thuộc bộ Địa Chi <strong>${menhTamHop?.label || '—'}</strong>.</p>`,
      `<p>Trong 4 cung kiểm tra chính hiện hội tụ <strong>${totalCat} Cát tinh cốt lõi</strong> (Tả/Hữu/Xương/Khúc/Khôi/Việt) và <strong>${totalHung} Hung tinh cốt lõi</strong> (Kình/Đà/Hỏa/Linh/Không/Kiếp).</p>`,
      ...mainCungsSummary.map(item =>
        item.interpretation
          ? `<div class="qtv-cung-block"><h5>Cung ${item.cungName} (${item.diaChi})</h5>${item.interpretation}</div>`
          : `<p><strong>Cung ${item.cungName} (${item.diaChi}):</strong> ${item.chinh.length ? item.chinh.join(', ') : 'Vô Chính Diệu'}.</p>`
      )
    ].join('');

    results.push({
      id: 'summary-menh-tai-quan-di',
      boSaoPhoi: `Tổng hợp 4 cung Mệnh – Tài – Quan – Di (${menhTamHop?.label || ''})`,
      matchedStars: labelLines,
      matchedCungs: ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Thiên Di'],
      tamHopGroup: menhTamHop?.label || '',
      content: overviewHtml,
      source: 'Đối chiếu Tam phương Tứ chính',
      isCustomRule: false,
      isDefaultSummary: true,
    });
  }

  return results;
}

// ===== CONTROLLERS =====

/** POST /api/tuvi/calculate - Tính tử vi */
export const calculate = async (req, res, next) => {
  try {
    const { hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem, birthHour, birthMin } = req.body;

    if (!hoTen || !gioiTinh || !ngaySinh || !thangSinh || !namSinh || !gioSinh)
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });

    // 1. Tính toán lá số chuẩn & ghép luận giải CMS
    const result = await calcTuVi({ hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem, birthHour, birthMin });

    // 2. Lấy dữ liệu chi tiết từ Database
    const db = await TuViDatabase.findOne();
    let detailed = null;
    if (db && db.con_giap) {
      detailed = db.con_giap.find(item => item.ten === result.conGiap.name);
    }

    // 3. Bổ sung thông tin chi tiết con giáp
    const finalResult = {
      ...result,
      userId: req.user ? req.user._id : undefined,
      detailedAnalysis: detailed ? {
        sacThai: detailed.sac_thai,
        tinhCach: detailed.tinh_cach,
        diemManh: detailed.diem_manh,
        diemYeu: detailed.diem_yeu,
        suNghiep: detailed.su_nghiep,
        tinhCam: detailed.tinh_cam,
        sucKhoe: detailed.suc_khoe,
        taiLoc: detailed.tai_loc,
        namTot: detailed.nam_tot,
        thangTot: detailed.thang_tot,
        soMayMan: detailed.so_may_man,
        mauMayMan: detailed.mau_may_man,
        vanHan2026: detailed.van_han_nam_2026,
      } : null
    };

    const saved = await TuViResult.create(finalResult);
    const responseData = saved.toObject();
    if (req.user?.role !== 'admin') {
      delete responseData.quanTuViResults;
    }

    res.status(200).json({ success: true, message: 'Tính toán thành công!', data: responseData });
  } catch (e) { next(e); }
};

/** GET /api/tuvi/:id - Lấy kết quả */
export const getResult = async (req, res, next) => {
  try {
    const r = await TuViResult.findById(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    r.viewCount += 1;
    await r.save();

    const responseData = r.toObject();
    if (req.user?.role === 'admin') {
      const boSaoRules = await Interpretation.find({ type: { $in: ['bo_sao_phoi', 'cach_cuc'] } }).lean();
      responseData.quanTuViResults = matchBoSaoPhoi(responseData.cungResults, boSaoRules);
    } else {
      delete responseData.quanTuViResults;
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (e) { next(e); }
};

/** GET /api/tuvi/history - Lịch sử user */
export const getHistory = async (req, res, next) => {
  try {
    const p = parseInt(req.query.page) || 1, l = parseInt(req.query.limit) || 10;
    const [results, total] = await Promise.all([
      TuViResult.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).select('-cungResults -advice'),
      TuViResult.countDocuments({ userId: req.user._id }),
    ]);
    res.status(200).json({ success: true, data: results, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } });
  } catch (e) { next(e); }
};

/** DELETE /api/tuvi/:id - Xóa kết quả */
export const deleteResult = async (req, res, next) => {
  try {
    const r = await TuViResult.findOne({ _id: req.params.id, userId: req.user._id });
    if (!r) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    await r.deleteOne();
    res.status(200).json({ success: true, message: 'Đã xóa.' });
  } catch (e) { next(e); }
};

/** GET /api/tuvi/stats - Thống kê (Admin) */
export const getStats = async (req, res, next) => {
  try {
    const [total, recent, topNH] = await Promise.all([
      TuViResult.countDocuments(),
      TuViResult.find().sort({ createdAt: -1 }).limit(5).select('hoTen nguHanh overallRating createdAt'),
      TuViResult.aggregate([{ $group: { _id: '$nguHanh', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);
    res.status(200).json({ success: true, data: { total, recent, topNH } });
  } catch (e) { next(e); }
};

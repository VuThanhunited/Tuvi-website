import TuViResult from '../models/TuViResult.js';
import TuViDatabase from '../models/TuViDatabase.js';

// ===== THIÊN CAN / ĐỊA CHI =====
const THIEN_CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const TC_SHORT  = ['G','Ất','B','Đ','M','K','C','T','N','Q'];
const DIA_CHI   = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const DC_EMO    = ['🐀','🐂','🐯','🐰','🐲','🐍','🐴','🐐','🐒','🐓','🐕','🐷'];
const NHC = { Kim:'#9e9e9e', Thủy:'#1E90FF', Hỏa:'#FF4500', Thổ:'#DAA520', Mộc:'#2E8B57' };

// Ngũ hành của địa chi (dùng cho màu sắc cung)
const DC_HANH = ['Thủy','Thổ','Mộc','Mộc','Thổ','Hỏa','Hỏa','Thổ','Kim','Kim','Thổ','Thủy'];
// Âm/Dương của địa chi (Tý+, Sửu-, Dần+, Mão-, ...)
const DC_AM_DUONG = ['+','-','+','-','+','-','+','-','+','-','+','-'];

// Thiên can âm/dương
const TC_AM_DUONG = ['+','-','+','-','+','-','+','-','+','-']; // Giáp+, Ất-, ...

// Nạp âm (60 hoa giáp)
const NAP_AM = [
  'Hải Trung Kim','Hải Trung Kim','Lô Trung Hỏa','Lô Trung Hỏa',
  'Đại Lâm Mộc','Đại Lâm Mộc','Lộ Bàng Thổ','Lộ Bàng Thổ',
  'Kiếm Phong Kim','Kiếm Phong Kim','Sơn Đầu Hỏa','Sơn Đầu Hỏa',
  'Giản Hạ Thủy','Giản Hạ Thủy','Thành Đầu Thổ','Thành Đầu Thổ',
  'Bạch Lạp Kim','Bạch Lạp Kim','Dương Liễu Mộc','Dương Liễu Mộc',
  'Tuyền Trung Thủy','Tuyền Trung Thủy','Ốc Thượng Thổ','Ốc Thượng Thổ',
  'Phích Lịch Hỏa','Phích Lịch Hỏa','Tùng Bách Mộc','Tùng Bách Mộc',
  'Trường Lưu Thủy','Trường Lưu Thủy','Sa Trung Kim','Sa Trung Kim',
  'Sơn Hạ Hỏa','Sơn Hạ Hỏa','Bình Địa Mộc','Bình Địa Mộc',
  'Bích Thượng Thổ','Bích Thượng Thổ','Kim Bạch Kim','Kim Bạch Kim',
  'Phú Đăng Hỏa','Phú Đăng Hỏa','Thiên Hà Thủy','Thiên Hà Thủy',
  'Thái Dịch Thổ','Thái Dịch Thổ','Thoa Xuyến Kim','Thoa Xuyến Kim',
  'Tang Đố Mộc','Tang Đố Mộc','Đại Khe Thủy','Đại Khe Thủy',
  'Sa Trung Thổ','Sa Trung Thổ','Thiên Thượng Hỏa','Thiên Thượng Hỏa',
  'Thạch Lựu Mộc','Thạch Lựu Mộc','Đại Hải Thủy','Đại Hải Thủy',
];

// 12 Cung tử vi (thứ tự từ Mệnh)
const CUNG_NAMES = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
const CUNG_ICONS = ['👤','👨‍👩‍👧','🙏','🏠','💼','🤝','✈️','🏥','💰','👶','💑','👫'];

// Cục theo ngũ hành mệnh
const CUC_MAP = {
  Thủy:{name:'Thủy Nhị Cục',value:2},
  Mộc:{name:'Mộc Tam Cục',value:3},
  Kim:{name:'Kim Tứ Cục',value:4},
  Thổ:{name:'Thổ Ngũ Cục',value:5},
  Hỏa:{name:'Hỏa Lục Cục',value:6}
};

// Giờ sinh → Địa chi
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

// ===== BẢNG SAO CHỦ =====
// Tử vi an theo cục và ngày sinh
// Đây là bảng an sao chính theo phương pháp truyền thống
const SAO_CHINH = [
  'Tử Vi','Thiên Cơ','Thái Dương','Vũ Khúc','Thiên Đồng',
  'Liêm Trinh','Thiên Phủ','Thái Âm','Tham Lang','Cự Môn',
  'Thiên Tướng','Thiên Lương','Thất Sát','Phá Quân'
];

// Trạng thái của sao chính theo cung (vị trí của sao với từng cung)
// M=Miếu, V=Vượng, Đ=Đắc, B=Bình, H=Hãm
const TRANG_THAI = ['M','V','Đ','B','H'];

// Sao phụ thường gặp
const SAO_PHU_LIST = [
  'Văn Xương','Văn Khúc','Tả Phù','Hữu Bật','Thiên Khôi','Thiên Việt',
  'Lộc Tồn','Thiên Mã','Hỏa Tinh','Linh Tinh','Kình Dương','Đà La',
  'Địa Không','Địa Kiếp','Thiên Hình','Thiên Diêu','Hồng Loan','Thiên Hỉ',
  'Thiên Quan','Thiên Phúc','Long Đức','Phượng Các','Thiên Thọ','Thiên Đức',
  'Thiên Nguyệt','Thiên Giải','Tuần Triệt','Thai Phụ','Phong Cáo',
  'Quốc Ấn','Đường Phù','Thiên Riêu','Thiên Y','Bạch Hổ','Thiên Không'
];

// Hóa tinh 4 chính cục
const HOA_TINH_TC = {
  0: { loc:'Liêm Trinh', quyen:'Phá Quân', khoa:'Vũ Khúc', ky:'Thái Dương' }, // Giáp
  1: { loc:'Thiên Cơ', quyen:'Thiên Lương', khoa:'Tử Vi', ky:'Thái Âm' },      // Ất
  2: { loc:'Thiên Đồng', quyen:'Thiên Cơ', khoa:'Văn Xương', ky:'Liêm Trinh' }, // Bính
  3: { loc:'Thái Âm', quyen:'Thiên Đồng', khoa:'Thiên Cơ', ky:'Cự Môn' },      // Đinh
  4: { loc:'Tham Lang', quyen:'Thái Âm', khoa:'Hữu Bật', ky:'Thiên Cơ' },      // Mậu
  5: { loc:'Vũ Khúc', quyen:'Tham Lang', khoa:'Thiên Lương', ky:'Văn Khúc' },  // Kỷ
  6: { loc:'Thái Dương', quyen:'Vũ Khúc', khoa:'Thái Âm', ky:'Thiên Đồng' },   // Canh
  7: { loc:'Cự Môn', quyen:'Thái Dương', khoa:'Văn Khúc', ky:'Văn Xương' },    // Tân
  8: { loc:'Thiên Lương', quyen:'Tử Vi', khoa:'Tả Phù', ky:'Vũ Khúc' },        // Nhâm
  9: { loc:'Phá Quân', quyen:'Thiên Lương', khoa:'Thái Âm', ky:'Tham Lang' },  // Quý
};

// Cân xương tính số - bảng tra
const CAN_XUONG_TABLE = {
  // Theo năm sinh (thiên can)
  tc: { 0:0.5, 1:0.6, 2:0.7, 3:0.8, 4:0.9, 5:1.0, 6:0.9, 7:0.8, 8:0.7, 9:0.6 },
  // Theo tháng sinh
  thang: [0.4,0.5,0.6,0.7,0.8,0.9,1.0,0.9,0.8,0.7,0.6,0.5],
  // Theo ngày sinh (nhóm)
  ngay: [0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.4,0.5],
  // Theo giờ sinh
  gio: { 0:0.4, 1:0.5, 2:0.6, 3:0.7, 4:0.8, 5:0.9, 6:1.0, 7:0.9, 8:0.8, 9:0.7, 10:0.6, 11:0.5 }
};

// ===== HELPERS =====
function getNguHanh(napAm) {
  if (napAm.includes('Kim')) return 'Kim';
  if (napAm.includes('Thủy')) return 'Thủy';
  if (napAm.includes('Hỏa')) return 'Hỏa';
  if (napAm.includes('Thổ')) return 'Thổ';
  if (napAm.includes('Mộc')) return 'Mộc';
  return 'Thổ';
}

// Tính cân xương (đơn giản hóa)
function tinhCanXuong(tcIdx, thang, ngay, gioIdx) {
  const luong = (tcIdx + thang + ngay + gioIdx) % 16;
  const luongVal = Math.floor(luong / 16 * 10) + 1; // 1-10 lượng
  const chiVal = Math.floor(Math.random() * 9) + 1;  // 1-9 chỉ
  return `${Math.min(luongVal, 8)} lượng ${chiVal} chỉ`;
}

// An cung Mệnh theo tháng sinh và giờ sinh
function anCungMenh(thang, gioChiIdx) {
  // Tháng sinh đối chiếu với giờ sinh để xác định cung Mệnh
  // Cung Mệnh an ở địa chi: (thang + gioChiIdx) mod 12
  // Theo phương pháp truyền thống: Mệnh = Dần + (thang - 1) - gioChiIdx (mod 12)
  let menh = (2 + (thang - 1) - gioChiIdx + 60) % 12; // Bắt đầu từ Dần (index 2)
  return menh; // index trong DIA_CHI
}

// An sao chính theo cục và ngày sinh (phiên bản đơn giản)
function anSaoChinhCung(cucValue, ngay, cungMenhIdx) {
  // Tử Vi an theo công thức: vị trí Tử Vi = (ngay - 1) / cuc (mod 12)
  const tuViPos = Math.floor((ngay - 1) / cucValue) % 12;
  
  // Các sao chính an theo vị trí tương đối với Tử Vi
  const SAO_OFFSET = {
    'Tử Vi': 0,
    'Thiên Cơ': -1,
    'Thái Dương': 2,
    'Vũ Khúc': 3,
    'Thiên Đồng': 4,
    'Liêm Trinh': 7,
    'Thiên Phủ': 0, // Phủ an từ Thân theo Tử Vi
    'Thái Âm': 2,
    'Tham Lang': 3,
    'Cự Môn': 4,
    'Thiên Tướng': 5,
    'Thiên Lương': 6,
    'Thất Sát': 9,
    'Phá Quân': 12 - 3
  };

  // Vị trí tuyệt đối của từng sao chính trong 12 cung
  const saoChinh = {};
  for (const [ten, offset] of Object.entries(SAO_OFFSET)) {
    let pos;
    if (ten === 'Thiên Phủ') {
      // Thiên Phủ đối xứng với Tử Vi qua Tý-Ngọ
      pos = (12 - tuViPos + 4) % 12;
    } else if (['Thái Âm','Tham Lang','Cự Môn','Thiên Tướng','Thiên Lương','Thất Sát','Phá Quân'].includes(ten)) {
      // Nhóm Phủ an theo Thiên Phủ
      const phuPos = (12 - tuViPos + 4) % 12;
      const phuOffset = { 'Thái Âm':1,'Tham Lang':2,'Cự Môn':3,'Thiên Tướng':4,'Thiên Lương':5,'Thất Sát':8,'Phá Quân':11 };
      pos = (phuPos + phuOffset[ten]) % 12;
    } else {
      pos = (tuViPos + offset + 12) % 12;
    }
    saoChinh[ten] = pos;
  }

  // Chuyển về cung (0=Tý, 1=Sửu... nhưng cung Mệnh bắt đầu từ vị trí khác)
  // Tính vị trí sao trong grid cung (pos-0 = Dần, pos-1 = Mão, ...)
  // Grid positions: 0=Dần, 1=Mão, 2=Thìn, 3=Tỵ, 4=Ngọ, 5=Mùi, 6=Thân, 7=Dậu, 8=Tuất, 9=Hợi, 10=Tý, 11=Sửu
  const DC_TO_GRID = { 2:0, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 0:10, 1:11 };
  
  const gridSaoChinh = {};
  for (const [ten, dcIdx] of Object.entries(saoChinh)) {
    gridSaoChinh[ten] = DC_TO_GRID[dcIdx];
  }
  
  return gridSaoChinh;
}

// Trạng thái sao theo cung (M/V/Đ/B/H)
function getTrangThai(saoName, cungDCIdx) {
  // Bảng trạng thái đơn giản hóa
  const TRANG_THAI_MAP = {
    'Tử Vi': ['M','V','Đ','B','H','B','Đ','V','M','V','Đ','B'],
    'Thiên Cơ': ['H','B','Đ','V','M','V','Đ','B','H','B','Đ','V'],
    'Thái Dương': ['H','H','B','Đ','V','M','M','V','Đ','B','H','H'],
    'Vũ Khúc': ['B','Đ','V','M','V','Đ','B','H','H','B','Đ','V'],
    'Thiên Đồng': ['Đ','V','M','V','Đ','B','H','H','B','Đ','V','M'],
    'Liêm Trinh': ['V','B','V','Đ','B','H','V','B','V','M','B','H'],
    'Thiên Phủ': ['V','M','V','Đ','B','H','B','Đ','V','M','V','Đ'],
    'Thái Âm': ['H','B','Đ','V','M','V','Đ','B','H','H','B','Đ'],
    'Tham Lang': ['V','Đ','B','H','B','Đ','V','M','V','Đ','B','H'],
    'Cự Môn': ['B','H','B','Đ','V','M','V','Đ','B','H','H','B'],
    'Thiên Tướng': ['Đ','B','H','H','B','Đ','V','M','V','Đ','B','H'],
    'Thiên Lương': ['M','V','Đ','B','H','B','Đ','V','M','V','Đ','B'],
    'Thất Sát': ['M','V','Đ','B','H','B','M','V','Đ','B','H','B'],
    'Phá Quân': ['H','B','Đ','V','M','V','M','V','Đ','B','H','B'],
  };
  const table = TRANG_THAI_MAP[saoName];
  if (!table) return 'B';
  return table[cungDCIdx % 12];
}

// Màu sao theo trạng thái
function getMauSao(trangThai) {
  if (trangThai === 'M' || trangThai === 'V') return 'do'; // đỏ
  if (trangThai === 'Đ' || trangThai === 'B') return 'xam'; // xám
  return 'ham'; // hãm - tím/xám nhạt
}

// An sao phụ (các sao tiểu hạn, phi tinh...)
function anSaoPhu(tcIdx, dcIdx, gioChiIdx, thang, ngay, gioiTinh) {
  // Bảng an sao phụ đơn giản theo công thức truyền thống
  const DC_TO_GRID = { 2:0, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 0:10, 1:11 };
  
  const saoPhu = {}; // { cungIdx: [{ ten, trangThai, loai }] }
  for (let i = 0; i < 12; i++) saoPhu[i] = [];

  // Văn Xương: an theo giờ sinh (Tuất trở về)
  const vanXuongDC = (10 - gioChiIdx + 12) % 12;
  const vanXuongGrid = DC_TO_GRID[vanXuongDC];
  saoPhu[vanXuongGrid].push({ ten: 'Văn Xương', loai: 'van', trangThai: 'B' });

  // Văn Khúc: an theo giờ sinh (Thìn trở đi)
  const vanKhucDC = (4 + gioChiIdx) % 12;
  const vanKhucGrid = DC_TO_GRID[vanKhucDC];
  saoPhu[vanKhucGrid].push({ ten: 'Văn Khúc', loai: 'van', trangThai: 'B' });

  // Kình Dương: an theo thiên can
  const kinhDuongDC_MAP = [3,4,6,7,9,10,0,1,3,4]; // theo TC index
  const kinhDuongDC = kinhDuongDC_MAP[tcIdx % 10];
  saoPhu[DC_TO_GRID[kinhDuongDC]].push({ ten: 'Kình Dương', loai: 'sat', trangThai: 'H' });

  // Đà La: trước Kình 1 cung
  const daladc = (kinhDuongDC - 1 + 12) % 12;
  saoPhu[DC_TO_GRID[daladc]].push({ ten: 'Đà La', loai: 'sat', trangThai: 'H' });

  // Lộc Tồn: an theo thiên can
  const locTonDC_MAP = [2,3,5,6,8,9,11,0,2,3];
  const locTonDC = locTonDC_MAP[tcIdx % 10];
  saoPhu[DC_TO_GRID[locTonDC]].push({ ten: 'Lộc Tồn', loai: 'loc', trangThai: 'M' });

  // Thiên Mã: an theo năm sinh (địa chi)
  const thienmaDC_MAP = { 0:9, 1:6, 2:3, 3:0, 4:9, 5:6, 6:3, 7:0, 8:9, 9:6, 10:3, 11:0 };
  const thienMaDC = thienmaDC_MAP[dcIdx % 12] ?? 0;
  saoPhu[DC_TO_GRID[thienMaDC]].push({ ten: 'Thiên Mã', loai: 'tro', trangThai: 'B' });

  // Hỏa Tinh: theo giờ sinh và năm sinh
  const hoaTinhBase = [2,3,1,10,9,10,3,2,1,10,9,10];
  const hoaTinhDC = (hoaTinhBase[dcIdx % 12] + gioChiIdx) % 12;
  saoPhu[DC_TO_GRID[hoaTinhDC]].push({ ten: 'Hỏa Tinh', loai: 'sat', trangThai: 'H' });

  // Linh Tinh: theo giờ sinh và năm sinh
  const linhTinhBase = [10,9,10,3,2,3,10,9,10,3,2,3];
  const linhTinhDC = (linhTinhBase[dcIdx % 12] + gioChiIdx) % 12;
  saoPhu[DC_TO_GRID[linhTinhDC]].push({ ten: 'Linh Tinh', loai: 'sat', trangThai: 'H' });

  // Thiên Khôi: theo thiên can
  const khoi_MAP = [1,0,11,9,11,9,1,0,3,3];
  saoPhu[DC_TO_GRID[khoi_MAP[tcIdx % 10]]].push({ ten: 'Thiên Khôi', loai: 'quy', trangThai: 'M' });

  // Thiên Việt: theo thiên can
  const viet_MAP = [7,8,9,11,9,11,7,8,5,5];
  saoPhu[DC_TO_GRID[viet_MAP[tcIdx % 10]]].push({ ten: 'Thiên Việt', loai: 'quy', trangThai: 'M' });

  // Hồng Loan: an từ Mão trở về theo năm sinh
  const hongLoanDC = (3 - dcIdx * 2 + 120) % 12;
  saoPhu[DC_TO_GRID[hongLoanDC]].push({ ten: 'Hồng Loan', loai: 'dao', trangThai: 'B' });

  // Thiên Hỉ: đối cung Hồng Loan
  const thienHiDC = (hongLoanDC + 6) % 12;
  saoPhu[DC_TO_GRID[thienHiDC]].push({ ten: 'Thiên Hỉ', loai: 'dao', trangThai: 'B' });

  // Địa Không: an từ Hợi trở về theo giờ sinh
  const diaKhongDC = (11 - gioChiIdx + 12) % 12;
  saoPhu[DC_TO_GRID[diaKhongDC]].push({ ten: 'Địa Không', loai: 'sat', trangThai: 'H' });

  // Địa Kiếp: an từ Hợi trở tới theo giờ sinh
  const diaKiepDC = (11 + gioChiIdx) % 12;
  saoPhu[DC_TO_GRID[diaKiepDC]].push({ ten: 'Địa Kiếp', loai: 'sat', trangThai: 'H' });

  // Tả Phù: an từ Thìn theo tháng
  const taPhuDC = (4 + thang - 1) % 12;
  saoPhu[DC_TO_GRID[taPhuDC]].push({ ten: 'Tả Phù', loai: 'phu', trangThai: 'B' });

  // Hữu Bật: an từ Tuất trở về theo tháng
  const huuBatDC = (10 - (thang - 1) + 12) % 12;
  saoPhu[DC_TO_GRID[huuBatDC]].push({ ten: 'Hữu Bật', loai: 'phu', trangThai: 'B' });

  return saoPhu;
}

// Tính Hóa tinh cho từng cung
function tinhHoaTinh(tcIdx, saoChinhGrid, cungMenhDCIdx) {
  const hoaMap = HOA_TINH_TC[tcIdx % 10] || HOA_TINH_TC[0];
  // Xác định cung nào chứa sao Hóa Lộc/Quyền/Khoa/Kỵ
  const result = {};
  for (let i = 0; i < 12; i++) result[i] = [];

  // Tìm cung chứa sao lộc/quyền/khoa/kỵ
  for (const [saoName, gridIdx] of Object.entries(saoChinhGrid)) {
    if (saoName === hoaMap.loc) result[gridIdx].push({ ten: 'Hóa Lộc', loai: 'hoa-loc' });
    if (saoName === hoaMap.quyen) result[gridIdx].push({ ten: 'Hóa Quyền', loai: 'hoa-quyen' });
    if (saoName === hoaMap.khoa) result[gridIdx].push({ ten: 'Hóa Khoa', loai: 'hoa-khoa' });
    if (saoName === hoaMap.ky) result[gridIdx].push({ ten: 'Hóa Kỵ', loai: 'hoa-ky' });
  }

  // Thêm Hóa tinh từ sao phụ (Văn Xương/Văn Khúc)
  // (đã xử lý trong saoChinhGrid nếu có)
  return result;
}

// Xác định "Tự Hóa" khi sao Hóa rơi vào cùng cung với sao gốc
function checkTuHoa(cungIdx, hoaTinhGrid, saoChinhGrid) {
  const hoaInCung = hoaTinhGrid[cungIdx] || [];
  // Tự Hóa là khi sao Hóa rơi vào chính cung chứa sao gốc
  return hoaInCung;
}

// An cung theo grid position
// Grid: 0=Dần, 1=Mão, 2=Thìn, 3=Tỵ, 4=Ngọ, 5=Mùi, 6=Thân, 7=Dậu, 8=Tuất, 9=Hợi, 10=Tý, 11=Sửu
const GRID_TO_DC = [2,3,4,5,6,7,8,9,10,11,0,1]; // grid index → địa chi index
const GRID_DC_NAME = ['Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi','Tý','Sửu'];
const GRID_TC_CHARS = ['M','K','C','T','N','Q','G','Ấ','B','Đ','M','K']; // viết tắt thiên can của mỗi cung

// Ngũ hành của địa chi trong grid
const GRID_HANH = ['Mộc','Mộc','Thổ','Hỏa','Hỏa','Thổ','Kim','Kim','Thổ','Thủy','Thủy','Thổ'];
const GRID_AM_DUONG = ['+','-','+','-','+','-','+','-','+','-','+','-'];

// Màu ngũ hành
const HANH_COLOR = {
  Kim: '#9e9e9e',
  Mộc: '#2E8B57',
  Thủy: '#1565C0',
  Hỏa: '#c62828',
  Thổ: '#DAA520'
};

// Xác định thiên can của mỗi cung dựa vào năm sinh
function getCungCanChi(cungGridIdx, namSinh) {
  // Địa chi của cung
  const dcIdx = GRID_TO_DC[cungGridIdx];
  const dcName = DIA_CHI[dcIdx];
  const dcAmDuong = DC_AM_DUONG[dcIdx];
  const dcHanh = DC_HANH[dcIdx];

  // Thiên can của cung (phụ thuộc vào năm sinh và vị trí cung)
  // Công thức: can cung = (can năm * 2 + cung grid) mod 10
  const tcIdx = ((namSinh - 4) % 10 + 10) % 10;
  const cungTCIdx = (tcIdx * 2 + cungGridIdx) % 10;
  const cungTC = THIEN_CAN[cungTCIdx];
  const cungTCShort = TC_SHORT[cungTCIdx];
  const cungTCAmDuong = TC_AM_DUONG[cungTCIdx];

  // Ngũ hành của địa chi trong grid
  const hanhDC = GRID_HANH[cungGridIdx];
  const amDuong = GRID_AM_DUONG[cungGridIdx];

  return {
    dcName, dcIdx, dcAmDuong, dcHanh,
    tcName: cungTC, tcShort: cungTCShort, tcAmDuong: cungTCAmDuong,
    hanhDC, amDuong,
    displayCanChi: `${cungTCShort}.${dcName}`,
    hanhDisplay: `${amDuong}${hanhDC}`,
    hanhColor: HANH_COLOR[hanhDC] || '#666'
  };
}

// Hóa Kỵ và Hóa Lộc từ cung này ảnh hưởng đến cung nào
// (Hóa tinh của lưu niên/đại vận)
function getHoaTinhCung(cungIdx, namXem, cungNames) {
  const namXemTC = ((namXem - 4) % 10 + 10) % 10;
  const hoaNamXem = HOA_TINH_TC[namXemTC] || HOA_TINH_TC[0];
  
  // Tìm xem Hóa Lộc/Quyền/Khoa/Kỵ của năm xem ảnh hưởng đến cung nào
  // Trả về danh sách Hóa tinh của cung này trong năm xem
  const result = [];
  // Logic đơn giản: mỗi Hóa tinh ảnh hưởng đến cung theo chu kỳ
  const hoaNames = ['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'];
  const cuNgIdx = cungIdx % 4;
  // Thêm thông tin Hóa tinh năm xem vào cung
  result.push({ ten: hoaNames[cuNgIdx], cung: cungNames[(cungIdx + 3) % 12], loai: ['hoa-loc','hoa-quyen','hoa-khoa','hoa-ky'][cuNgIdx] });
  return result;
}

// ===== MAIN CALCULATION =====
function calcTuVi({ hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem }) {
  const year = parseInt(namSinh);
  const month = parseInt(thangSinh);
  const day = parseInt(ngaySinh);
  const namXemInt = parseInt(namXem) || year + 26;

  // Can Chi năm sinh
  const tcIdx = ((year - 4) % 10 + 10) % 10;
  const dcIdx = ((year - 4) % 12 + 12) % 12;
  const tc = THIEN_CAN[tcIdx];
  const dc = DIA_CHI[dcIdx];

  // Nạp âm và ngũ hành mệnh
  const na60Idx = ((year - 4) % 60 + 60) % 60;
  const napAm = NAP_AM[na60Idx];
  const nguHanh = getNguHanh(napAm);
  const cuc = CUC_MAP[nguHanh] || { name: 'Hỏa Lục Cục', value: 6 };

  // Giờ sinh
  const gioChi = GIO_CHI[gioSinh] || { chi: 'Tý', index: 0 };
  const gioChiIdx = gioChi.index;

  // Tuổi trong năm xem
  const tuoi = namXemInt - year + 1;

  // Can Chi năm xem
  const namXemTC_idx = ((namXemInt - 4) % 10 + 10) % 10;
  const namXemDC_idx = ((namXemInt - 4) % 12 + 12) % 12;
  const namXemCanChi = `${THIEN_CAN[namXemTC_idx]} ${DIA_CHI[namXemDC_idx]} (${namXemInt})`;

  // An cung Mệnh (địa chi index)
  const cungMenhDCIdx = anCungMenh(month, gioChiIdx);
  const GRID_TO_DC_MAP = [2,3,4,5,6,7,8,9,10,11,0,1];
  // Grid index của cung Mệnh
  const DC_TO_GRID_MAP = { 2:0, 3:1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 0:10, 1:11 };
  const cungMenhGridIdx = DC_TO_GRID_MAP[cungMenhDCIdx] ?? 0;

  // An sao chính
  const saoChinhGrid = anSaoChinhCung(cuc.value, day, cungMenhDCIdx);

  // An sao phụ
  const saoPhuGrid = anSaoPhu(tcIdx, dcIdx, gioChiIdx, month, day, gioiTinh);

  // Tính Hóa tinh
  const hoaTinhGrid = tinhHoaTinh(tcIdx, saoChinhGrid, cungMenhDCIdx);

  // Âm dương: nam dương/nam âm tùy theo năm sinh
  const isNam = gioiTinh === 'nam';
  const isDuong = tcIdx % 2 === 0; // Can dương: Giáp,Bính,Mậu,Canh,Nhâm
  let amDuong;
  if (isNam) {
    amDuong = isDuong ? 'Dương Nam' : 'Âm Nam';
  } else {
    amDuong = isDuong ? 'Âm Nữ' : 'Dương Nữ';
  }

  // Chủ Mệnh (sao chính ở cung Mệnh)
  let chuMenh = 'Liêm Trinh'; // mặc định
  for (const [saoName, gridIdx] of Object.entries(saoChinhGrid)) {
    if (gridIdx === cungMenhGridIdx) {
      chuMenh = saoName;
      break;
    }
  }

  // Chủ Thân (sao ở giờ sinh)
  const chuThanMap = {
    0:'Thiên Tướng', 1:'Thiên Cơ', 2:'Tử Vi', 3:'Văn Xương',
    4:'Thiên Đồng', 5:'Vũ Khúc', 6:'Thái Dương', 7:'Hỏa Tinh',
    8:'Thiên Phủ', 9:'Thái Âm', 10:'Thiên Lương', 11:'Linh Tinh'
  };
  const chuThan = chuThanMap[gioChiIdx] || 'Văn Xương';

  // Lai Nhân Cung (cung có Lộc Tồn hoặc Hóa Lộc - cung Phúc Đức/Điền Trạch)
  const laiNhanCung = CUNG_NAMES[(cungMenhGridIdx + 3) % 12]; // Điền Trạch hoặc tương tự

  // Cân xương
  const canXuong = tinhCanXuong(tcIdx, month, day, gioChiIdx);

  // 12 Cung kết quả
  const cungResults = [];
  for (let i = 0; i < 12; i++) {
    const gridIdx = (cungMenhGridIdx + i) % 12;
    const cungName = CUNG_NAMES[i];
    const daiHan = cuc.value + i * 10;
    const thangHan = ((i + month) % 12) + 1;

    // Thiên can / địa chi của cung này
    const canChi = getCungCanChi(gridIdx, year);

    // Sao chính trong cung này
    const saoChinhTrongCung = [];
    for (const [saoName, saoGridIdx] of Object.entries(saoChinhGrid)) {
      if (saoGridIdx === gridIdx) {
        const tt = getTrangThai(saoName, canChi.dcIdx);
        saoChinhTrongCung.push({
          ten: saoName,
          trangThai: tt,
          mau: getMauSao(tt),
          amDuong: canChi.amDuong
        });
      }
    }

    // Sao phụ trong cung này
    const saoPhuTrongCung = (saoPhuGrid[gridIdx] || []).slice(0, 6); // Giới hạn 6 sao

    // Hóa tinh trong cung này
    const hoaTinhTrongCung = hoaTinhGrid[gridIdx] || [];

    // Hóa tinh của năm xem trong cung này (đơn giản hóa)
    const namXemHoa = getHoaTinhCung(i, namXemInt, CUNG_NAMES);

    // Rating tổng hợp
    const seed = year * 10000 + month * 100 + day + gioChiIdx * 7 + i * 13 + (isNam ? 1 : 0);
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    const rating = Math.floor((x - Math.floor(x)) * 5) + 1;

    cungResults.push({
      gridIdx,
      name: cungName,
      icon: CUNG_ICONS[i],
      daiHan,
      thangHan,
      canChi: canChi.displayCanChi,
      hanhDisplay: canChi.hanhDisplay,
      hanhColor: canChi.hanhColor,
      hanhDC: canChi.hanhDC,
      isMenh: i === 0,
      isMinh: gridIdx === ((cungMenhGridIdx + 6) % 12), // Cung Thân (đối diện Mệnh)
      saoChinhList: saoChinhTrongCung,
      saoPhuList: saoPhuTrongCung,
      hoaTinhList: hoaTinhTrongCung,
      namXemHoaTinh: namXemHoa,
      rating,
    });
  }

  // Cung Thân (Thân lập ở đâu)
  const cungThanDCIdx = (gioChiIdx + month - 1 + 12) % 12;
  const cungThanGridIdx = DC_TO_GRID_MAP[cungThanDCIdx] ?? 0;
  // Tìm tên cung Thân
  const cungThanRelIdx = (cungThanGridIdx - cungMenhGridIdx + 12) % 12;
  const tenCungThan = CUNG_NAMES[cungThanRelIdx];

  return {
    hoTen,
    gioiTinh,
    ngaySinh: day,
    thangSinh: month,
    namSinh: year,
    gioSinh,
    isLunar: isLunar || false,
    namXem: namXemInt,
    thangXem: thangXem ? parseInt(thangXem) : month,
    canChi: `${tc} ${dc}`,
    thienCan: tc,
    diaChi: dc,
    tcIdx,
    dcIdx,
    conGiap: { name: dc, emoji: DC_EMO[dcIdx], index: dcIdx },
    napAm,
    nguHanh,
    nguHanhColor: NHC[nguHanh] || '#D4AF37',
    cuc,
    gioChiName: gioChi.chi,
    gioHour: gioSinh,
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
    advice: [`Bản mệnh ${nguHanh}, ${cuc.name}. Cân xương: ${canXuong}.`],
    overallRating: Math.round(cungResults.reduce((s, c) => s + c.rating, 0) / cungResults.length * 10) / 10,
  };
}

// ===== CONTROLLERS =====

/** POST /api/tuvi/calculate - Tính tử vi */
export const calculate = async (req, res, next) => {
  try {
    const { hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem } = req.body;

    if (!hoTen || !gioiTinh || !ngaySinh || !thangSinh || !namSinh || !gioSinh)
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });

    // 1. Tính toán đầy đủ
    const result = calcTuVi({ hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, thangXem });

    // 2. Lấy dữ liệu chi tiết từ Database
    const db = await TuViDatabase.findOne();
    let detailed = null;
    if (db && db.con_giap) {
      detailed = db.con_giap.find(item => item.ten === result.conGiap.name);
    }

    // 3. Bổ sung thông tin từ database
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

    res.status(200).json({ success: true, message: 'Tính toán thành công!', data: saved });
  } catch (e) { next(e); }
};

/** GET /api/tuvi/:id - Lấy kết quả */
export const getResult = async (req, res, next) => {
  try {
    const r = await TuViResult.findById(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Không tìm thấy.' });
    r.viewCount += 1; await r.save();
    res.status(200).json({ success: true, data: r });
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

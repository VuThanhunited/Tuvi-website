/**
 * TU VI CALCULATOR - Core Vietnamese Astrology Engine
 * Tính toán tử vi cổ học Việt Nam
 */

// ========== THIÊN CAN & ĐỊA CHI ==========
const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const CON_GIAP_EMOJI = ['🐀', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐐', '🐒', '🐓', '🐕', '🐷'];

// ========== NGŨ HÀNH ==========
const NGU_HANH = ['Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc'];
const NGU_HANH_COLORS = {
  'Kim': '#C0C0C0',
  'Thủy': '#1E90FF',
  'Hỏa': '#FF4500',
  'Thổ': '#DAA520',
  'Mộc': '#2E8B57',
};

// ========== NẠP ÂM (60 Giáp Tý) ==========
const NAP_AM = [
  'Hải Trung Kim', 'Hải Trung Kim',     // Giáp Tý, Ất Sửu
  'Lô Trung Hỏa', 'Lô Trung Hỏa',     // Bính Dần, Đinh Mão
  'Đại Lâm Mộc', 'Đại Lâm Mộc',       // Mậu Thìn, Kỷ Tỵ
  'Lộ Bàng Thổ', 'Lộ Bàng Thổ',       // Canh Ngọ, Tân Mùi
  'Kiếm Phong Kim', 'Kiếm Phong Kim',   // Nhâm Thân, Quý Dậu
  'Sơn Đầu Hỏa', 'Sơn Đầu Hỏa',     // Giáp Tuất, Ất Hợi
  'Giản Hạ Thủy', 'Giản Hạ Thủy',     // Bính Tý, Đinh Sửu
  'Thành Đầu Thổ', 'Thành Đầu Thổ',   // Mậu Dần, Kỷ Mão
  'Bạch Lạp Kim', 'Bạch Lạp Kim',     // Canh Thìn, Tân Tỵ
  'Dương Liễu Mộc', 'Dương Liễu Mộc', // Nhâm Ngọ, Quý Mùi
  'Tuyền Trung Thủy', 'Tuyền Trung Thủy', // Giáp Thân, Ất Dậu
  'Ốc Thượng Thổ', 'Ốc Thượng Thổ',   // Bính Tuất, Đinh Hợi
  'Phích Lịch Hỏa', 'Phích Lịch Hỏa', // Mậu Tý, Kỷ Sửu
  'Tùng Bách Mộc', 'Tùng Bách Mộc',   // Canh Dần, Tân Mão
  'Trường Lưu Thủy', 'Trường Lưu Thủy', // Nhâm Thìn, Quý Tỵ
  'Sa Trung Kim', 'Sa Trung Kim',       // Giáp Ngọ, Ất Mùi
  'Sơn Hạ Hỏa', 'Sơn Hạ Hỏa',       // Bính Thân, Đinh Dậu
  'Bình Địa Mộc', 'Bình Địa Mộc',     // Mậu Tuất, Kỷ Hợi
  'Bích Thượng Thổ', 'Bích Thượng Thổ', // Canh Tý, Tân Sửu
  'Kim Bạch Kim', 'Kim Bạch Kim',       // Nhâm Dần, Quý Mão
  'Phú Đăng Hỏa', 'Phú Đăng Hỏa',   // Giáp Thìn, Ất Tỵ
  'Thiên Hà Thủy', 'Thiên Hà Thủy',   // Bính Ngọ, Đinh Mùi
  'Thái Dịch Thổ', 'Thái Dịch Thổ',   // Mậu Thân, Kỷ Dậu
  'Thoa Xuyến Kim', 'Thoa Xuyến Kim', // Canh Tuất, Tân Hợi
  'Tang Đố Mộc', 'Tang Đố Mộc',       // Nhâm Tý, Quý Sửu
  'Đại Khe Thủy', 'Đại Khe Thủy',     // Giáp Dần, Ất Mão
  'Sa Trung Thổ', 'Sa Trung Thổ',     // Bính Thìn, Đinh Tỵ
  'Thiên Thượng Hỏa', 'Thiên Thượng Hỏa', // Mậu Ngọ, Kỷ Mùi
  'Thạch Lựu Mộc', 'Thạch Lựu Mộc',   // Canh Thân, Tân Dậu
  'Đại Hải Thủy', 'Đại Hải Thủy',     // Nhâm Tuất, Quý Hợi
];

// ========== 12 CUNG ==========
const CUNG_NAMES = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch',
  'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách',
  'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

const CUNG_ICONS = [
  '👤', '👨‍👩‍👧', '🙏', '🏠',
  '💼', '🤝', '✈️', '🏥',
  '💰', '👶', '💑', '👫'
];

const CUNG_DESCRIPTIONS = {
  'Mệnh': 'Cung Mệnh phản ánh bản chất, tính cách và số phận chung của bạn. Đây là cung quan trọng nhất trong lá số tử vi.',
  'Phụ Mẫu': 'Cung Phụ Mẫu nói về mối quan hệ với cha mẹ, sự kế thừa gia đình và phúc ấm tổ tiên.',
  'Phúc Đức': 'Cung Phúc Đức cho biết phúc đức tổ tiên, khả năng hưởng phúc và duyên phận tu hành.',
  'Điền Trạch': 'Cung Điền Trạch nói về nhà cửa, đất đai, bất động sản và tài sản cố định.',
  'Quan Lộc': 'Cung Quan Lộc phản ánh sự nghiệp, con đường công danh và vận may trong công việc.',
  'Nô Bộc': 'Cung Nô Bộc nói về quan hệ bạn bè, đồng nghiệp, cấp dưới và các mối quan hệ xã hội.',
  'Thiên Di': 'Cung Thiên Di cho biết vận may khi ra ngoài, du lịch, di chuyển và hoạt động ngoại giao.',
  'Tật Ách': 'Cung Tật Ách phản ánh sức khỏe, bệnh tật và những tai ương có thể gặp.',
  'Tài Bạch': 'Cung Tài Bạch nói về tài chính, thu nhập, khả năng kiếm tiền và quản lý tài sản.',
  'Tử Tức': 'Cung Tử Tức phản ánh con cái, khả năng sinh sản và mối quan hệ với thế hệ sau.',
  'Phu Thê': 'Cung Phu Thê nói về hôn nhân, tình duyên, mối quan hệ vợ chồng.',
  'Huynh Đệ': 'Cung Huynh Đệ phản ánh mối quan hệ anh chị em, bạn bè thân thiết.'
};

// ========== TÍNH THIÊN CAN & ĐỊA CHI ==========
export function getThienCan(year) {
  return THIEN_CAN[(year - 4) % 10];
}

export function getDiaChi(year) {
  return DIA_CHI[(year - 4) % 12];
}

export function getConGiap(year) {
  const index = (year - 4) % 12;
  return {
    name: DIA_CHI[index],
    emoji: CON_GIAP_EMOJI[index],
    index: index,
  };
}

export function getCanChi(year) {
  return `${getThienCan(year)} ${getDiaChi(year)}`;
}

// ========== TÍNH NẠP ÂM (MỆNH) ==========
export function getNapAm(year) {
  const index = (year - 4) % 60;
  return NAP_AM[index];
}

export function getNguHanh(napAm) {
  if (napAm.includes('Kim')) return 'Kim';
  if (napAm.includes('Thủy')) return 'Thủy';
  if (napAm.includes('Hỏa')) return 'Hỏa';
  if (napAm.includes('Thổ')) return 'Thổ';
  if (napAm.includes('Mộc')) return 'Mộc';
  return 'Không xác định';
}

export function getNguHanhColor(nguHanh) {
  return NGU_HANH_COLORS[nguHanh] || '#D4AF37';
}

// ========== TÍNH CỤC & ÂM DƯƠNG ==========
const CUC_MAP = {
  'Thủy': { name: 'Thủy Nhị Cục', value: 2, hanh: 'Thủy' },
  'Mộc': { name: 'Mộc Tam Cục', value: 3, hanh: 'Mộc' },
  'Kim': { name: 'Kim Tứ Cục', value: 4, hanh: 'Kim' },
  'Thổ': { name: 'Thổ Ngũ Cục', value: 5, hanh: 'Thổ' },
  'Hỏa': { name: 'Hỏa Lục Cục', value: 6, hanh: 'Hỏa' },
};

export function getCuc(nguHanh) {
  return CUC_MAP[nguHanh] || { name: 'Không xác định', value: 0, hanh: 'Kim' };
}

export function getAmDuong(year, gender) {
  // Can: Giáp, Bính, Mậu, Canh, Nhâm là Dương (index chẵn)
  // Can: Ất, Đinh, Kỷ, Tân, Quý là Âm (index lẻ)
  const canIndex = (year - 4) % 10;
  const isDuong = canIndex % 2 === 0;
  
  if (gender === 'nam') {
    return isDuong ? 'Dương Nam' : 'Âm Nam';
  } else {
    return isDuong ? 'Dương Nữ' : 'Âm Nữ';
  }
}

export function getAmDuongLy(year, gender) {
  const canIndex = (year - 4) % 10;
  const isDuong = canIndex % 2 === 0;
  if ((gender === 'nam' && isDuong) || (gender === 'nu' && !isDuong)) {
    return 'Âm Dương thuận lý';
  }
  return 'Âm Dương nghịch lý';
}

export function getMenhCuc(menh, cucHanh) {
  // Tương sinh: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc
  // Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc
  const sinh = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
  const khac = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
  
  if (menh === cucHanh) return 'Mệnh Cục bình hòa';
  if (sinh[menh] === cucHanh) return 'Mệnh sinh Cục';
  if (sinh[cucHanh] === menh) return 'Cục sinh Mệnh';
  if (khac[menh] === cucHanh) return 'Mệnh khắc Cục';
  if (khac[cucHanh] === menh) return 'Cục khắc Mệnh';
  return 'Không rõ';
}

// ========== GIỜ SINH → CHI GIỜ ==========
const GIO_CHI_MAP = {
  '23-1': { chi: 'Tý', index: 0 },
  '1-3': { chi: 'Sửu', index: 1 },
  '3-5': { chi: 'Dần', index: 2 },
  '5-7': { chi: 'Mão', index: 3 },
  '7-9': { chi: 'Thìn', index: 4 },
  '9-11': { chi: 'Tỵ', index: 5 },
  '11-13': { chi: 'Ngọ', index: 6 },
  '13-15': { chi: 'Mùi', index: 7 },
  '15-17': { chi: 'Thân', index: 8 },
  '17-19': { chi: 'Dậu', index: 9 },
  '19-21': { chi: 'Tuất', index: 10 },
  '21-23': { chi: 'Hợi', index: 11 },
};

export function getGioChi(gioSinh) {
  return GIO_CHI_MAP[gioSinh] || { chi: 'Không rõ', index: 0 };
}

// ========== TÍNH TOÁN 12 CUNG ==========
function generateCungRating(seed) {
  // Deterministic "random" based on seed for consistent results
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return Math.floor((x - Math.floor(x)) * 5) + 1;
}

function getRatingLabel(rating) {
  if (rating === 5) return { text: 'Tuyệt vời', color: '#27AE60' };
  if (rating === 4) return { text: 'Tốt', color: '#2ECC71' };
  if (rating === 3) return { text: 'Bình thường', color: '#F39C12' };
  if (rating === 2) return { text: 'Yếu', color: '#E67E22' };
  return { text: 'Kém', color: '#E74C3C' };
}

function generateCungInterpretation(cungName, rating, gender, nguHanh) {
  const genderText = gender === 'nam' ? 'nam' : 'nữ';
  
  const interpretations = {
    'Mệnh': {
      5: `Cung Mệnh cực kỳ tốt đẹp. Bạn là người ${genderText} có mệnh ${nguHanh} vô cùng mạnh mẽ. Tính cách bạn nổi bật, có tài lãnh đạo và khả năng thu hút người khác. Con đường đời rộng mở, nhiều quý nhân phù trợ. Bạn có tố chất lãnh đạo bẩm sinh và luôn được mọi người kính trọng. Sự nghiệp phát triển thuận lợi, cuộc sống viên mãn.`,
      4: `Cung Mệnh khá tốt. Bạn là người ${genderText} có bản mệnh ${nguHanh} ổn định, tính cách trầm tĩnh, biết cách ứng xử. Đường đời có nhiều cơ hội phát triển, tuy đôi lúc gặp trở ngại nhưng đều vượt qua được. Quý nhân xuất hiện đúng lúc, giúp bạn vượt qua khó khăn.`,
      3: `Cung Mệnh ở mức trung bình. Bạn là người ${genderText} mệnh ${nguHanh}, có tính cách cân bằng. Cuộc đời bạn trải qua nhiều thăng trầm nhưng luôn giữ được sự bình tĩnh. Cần chú ý phát triển bản thân và mở rộng các mối quan hệ để có thêm cơ hội.`,
      2: `Cung Mệnh cần lưu ý. Bạn là người ${genderText} mệnh ${nguHanh}, có thể gặp một số trở ngại trong cuộc sống. Tuy nhiên, nếu biết cách tu tâm dưỡng tính và nỗ lực phấn đấu, vận mệnh sẽ dần cải thiện. Hãy kiên nhẫn và tin vào bản thân.`,
      1: `Cung Mệnh gặp nhiều thử thách. Bạn là người ${genderText} mệnh ${nguHanh}, cuộc đời có nhiều sóng gió. Nhưng đây cũng là cơ hội để rèn luyện bản lĩnh. Hãy tu thân, tích đức và luôn hướng thiện để cải vận.`,
    },
    'default': {
      5: `${cungName} rất tốt đẹp. Đây là lĩnh vực bạn có nhiều may mắn và thuận lợi. Mệnh ${nguHanh} của bạn hỗ trợ tốt cho cung này. Bạn sẽ gặp nhiều điều tích cực và thành công trong lĩnh vực này.`,
      4: `${cungName} khá tốt. Bạn có vận may trong lĩnh vực này, với mệnh ${nguHanh} mang lại nhiều cơ hội. Cần tiếp tục phát huy để đạt được kết quả tốt nhất.`,
      3: `${cungName} ở mức trung bình. Lĩnh vực này không quá nổi bật nhưng cũng không quá kém. Với mệnh ${nguHanh}, bạn cần nỗ lực thêm để cải thiện.`,
      2: `${cungName} cần chú ý. Lĩnh vực này có thể gặp một số khó khăn. Với mệnh ${nguHanh}, bạn cần cẩn thận và có kế hoạch rõ ràng.`,
      1: `${cungName} gặp nhiều thử thách. Đây là lĩnh vực bạn cần đặc biệt lưu ý và chuẩn bị tâm lý tốt. Hãy kiên nhẫn vượt qua.`,
    }
  };

  const pool = interpretations[cungName] || interpretations['default'];
  return pool[rating] || pool[3];
}

// ========== MAIN CALCULATION ==========
export function calculateTuVi({ hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar }) {
  const year = parseInt(namSinh);
  const month = parseInt(thangSinh);
  const day = parseInt(ngaySinh);

  // Basic info
  const thienCan = getThienCan(year);
  const diaChi = getDiaChi(year);
  const canChi = `${thienCan} ${diaChi}`;
  const conGiap = getConGiap(year);
  const napAm = getNapAm(year);
  const nguHanh = getNguHanh(napAm);
  const nguHanhColor = getNguHanhColor(nguHanh);
  const cuc = getCuc(nguHanh);
  const gioChi = getGioChi(gioSinh);
  const amDuong = getAmDuong(year, gioiTinh);
  const amDuongLy = getAmDuongLy(year, gioiTinh);
  const menhCuc = getMenhCuc(nguHanh, cuc.hanh);

  // Generate seed from all inputs for deterministic results
  const seed = year * 10000 + month * 100 + day + gioChi.index * 7 + (gioiTinh === 'nam' ? 1 : 0);

  // Calculate 12 cung
  const cungResults = CUNG_NAMES.map((name, i) => {
    const rating = generateCungRating(seed + i * 13 + 7);
    const label = getRatingLabel(rating);
    const interpretation = generateCungInterpretation(name, rating, gioiTinh, nguHanh);

    return {
      name,
      icon: CUNG_ICONS[i],
      rating,
      label: label.text,
      labelColor: label.color,
      interpretation,
    };
  });

  // Generate advice
  const advice = generateAdvice(nguHanh, gioiTinh, cungResults);

  return {
    // Personal info
    hoTen,
    gioiTinh,
    ngaySinh: `${day}/${month}/${year}`,
    gioSinh: gioChi.chi,
    isLunar,
    
    // Astrology info
    canChi,
    thienCan,
    diaChi,
    conGiap,
    napAm,
    nguHanh,
    nguHanhColor,
    cuc,
    amDuong,
    amDuongLy,
    menhCuc,
    
    // 12 Cung
    cungResults,
    
    // Advice
    advice,
    
    // Overall rating
    overallRating: Math.round(cungResults.reduce((sum, c) => sum + c.rating, 0) / cungResults.length * 10) / 10,
  };
}

function generateAdvice(nguHanh, gender, cungResults) {
  const weakCungs = cungResults.filter(c => c.rating <= 2).map(c => c.name);
  const strongCungs = cungResults.filter(c => c.rating >= 4).map(c => c.name);

  const adviceList = [];

  // Ngu hanh advice
  const nguHanhAdvice = {
    'Kim': 'Mệnh Kim nên mặc trang phục màu trắng, bạc. Hướng tốt: Tây, Tây Bắc. Số may mắn: 4, 9.',
    'Thủy': 'Mệnh Thủy nên mặc trang phục màu đen, xanh dương. Hướng tốt: Bắc. Số may mắn: 1, 6.',
    'Hỏa': 'Mệnh Hỏa nên mặc trang phục màu đỏ, cam, hồng. Hướng tốt: Nam. Số may mắn: 2, 7.',
    'Thổ': 'Mệnh Thổ nên mặc trang phục màu vàng, nâu. Hướng tốt: Trung tâm, Đông Bắc. Số may mắn: 0, 5.',
    'Mộc': 'Mệnh Mộc nên mặc trang phục màu xanh lá. Hướng tốt: Đông, Đông Nam. Số may mắn: 3, 8.',
  };

  adviceList.push(nguHanhAdvice[nguHanh] || '');

  if (strongCungs.length > 0) {
    adviceList.push(`Phát huy thế mạnh trong lĩnh vực: ${strongCungs.join(', ')}.`);
  }

  if (weakCungs.length > 0) {
    adviceList.push(`Chú ý cải thiện lĩnh vực: ${weakCungs.join(', ')}. Nên tu tâm dưỡng tính và cẩn thận hơn.`);
  }

  adviceList.push('Luôn giữ tâm tích cực, làm việc thiện để tích đức cho bản thân và gia đình.');
  adviceList.push('Nên tham khảo thêm ý kiến chuyên gia tử vi để có cái nhìn toàn diện hơn.');

  return adviceList.filter(a => a.length > 0);
}

export { CUNG_NAMES, NGU_HANH_COLORS };

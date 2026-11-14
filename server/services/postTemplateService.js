/**
 * postTemplateService.js
 * Engine tự động format dữ liệu từ website → nội dung bài post Facebook chuẩn
 */

const SITE_URL = process.env.CLIENT_URL || 'https://tuviviet.com';

// ── Emoji helpers ──────────────────────────────────────────
const CUNG_EMOJI = {
  'Mệnh': '⭐', 'Phụ Mẫu': '👴', 'Phúc Đức': '🙏', 'Điền Trạch': '🏠',
  'Quan Lộc': '💼', 'Nô Bộc': '🤝', 'Thiên Di': '✈️', 'Tật Ách': '⚕️',
  'Tài Bạch': '💰', 'Tử Tức': '👶', 'Phu Thê': '💑', 'Huynh Đệ': '👫',
};
const SAO_EMOJI = {
  'Tử Vi': '👑', 'Thiên Phủ': '🏛️', 'Thái Dương': '☀️', 'Thái Âm': '🌙',
  'Thiên Đồng': '😊', 'Thiên Lương': '⚖️', 'Thiên Cơ': '🧠', 'Vũ Khúc': '⚔️',
  'Tham Lang': '🐺', 'Cự Môn': '🗣️', 'Liêm Trinh': '🔥', 'Phá Quân': '💥',
  'Thất Sát': '🗡️', 'Thiên Tướng': '🛡️', 'Hóa Lộc': '💸', 'Hóa Quyền': '👊',
  'Hóa Khoa': '📚', 'Hóa Kỵ': '⚠️',
};
const CON_GIAP_EMOJI = {
  'Tý': '🐭', 'Sửu': '🐮', 'Dần': '🐯', 'Mão': '🐰',
  'Thìn': '🐉', 'Tỵ': '🐍', 'Ngọ': '🐴', 'Mùi': '🐑',
  'Thân': '🐵', 'Dậu': '🐔', 'Tuất': '🐶', 'Hợi': '🐷',
};

const emoji = (map, key) => map[key] || '✨';
const hashtag = (...tags) => tags.map(t => `#${t.replace(/\s+/g, '')}`).join(' ');

// ── 1. Từ Luận Giải ───────────────────────────────────────
export const generateFromInterpretation = (interp) => {
  const saoIcon = emoji(SAO_EMOJI, interp.sao);
  const cungIcon = emoji(CUNG_EMOJI, interp.cung);

  let header = '';
  if (interp.type === 'cach_cuc') {
    header = `🏆 Cách Cục: ${interp.tenCachCuc || ''}`;
  } else if (interp.sao && interp.cung) {
    header = `${saoIcon} ${interp.sao} ${cungIcon} tại cung ${interp.cung}`;
    if (interp.trangThai) {
      const ttMap = { M: '(Miếu)', V: '(Vượng)', Đ: '(Đắc)', B: '(Bình)', H: '(Hãm)' };
      header += ` ${ttMap[interp.trangThai] || ''}`;
    }
  } else if (interp.sao) {
    header = `${saoIcon} Ý nghĩa sao ${interp.sao}`;
  } else if (interp.cung) {
    header = `${cungIcon} Cung ${interp.cung} trong Tử Vi`;
  }

  const tags = hashtag('tửvi', 'tuvivi', 'luậngiải', 'phongthủy');
  const source = interp.source ? `\n📖 Nguồn: ${interp.source}` : '';

  return `${header}\n${'─'.repeat(30)}\n\n${interp.content}${source}\n\n${tags}`;
};

// ── 2. Từ Bài Viết / Blog ─────────────────────────────────
export const generateFromArticle = (article) => {
  const catEmoji = {
    'tu-vi': '🔮', 'phong-thuy': '🌿', 'xem-ngay': '📅',
    'xem-tuoi': '🎂', 'van-khan': '🙏', 'kien-thuc': '📚', 'khac': '📝',
  };
  const icon = catEmoji[article.category] || '📰';
  const excerpt = article.excerpt || (article.content || '').replace(/<[^>]+>/g, '').substring(0, 200) + '...';
  const url = article.slug ? `${SITE_URL}/bai-viet/${article.slug}` : SITE_URL;

  const tagList = (article.tags || []).slice(0, 4).map(t => `#${t.replace(/\s+/g, '')}`).join(' ');
  const baseTags = hashtag('tuvivi', 'kienthuc', 'phongthuy');

  return `${icon} ${article.title}\n${'─'.repeat(30)}\n\n${excerpt}\n\n🔗 Đọc bài đầy đủ tại:\n${url}\n\n${tagList} ${baseTags}`;
};

// ── 3. Từ Con Giáp / Vận Hạn ─────────────────────────────
export const generateFromConGiap = (conGiap, month) => {
  const monthNum = month || new Date().getMonth() + 1;
  const icon = emoji(CON_GIAP_EMOJI, conGiap.chi);
  const vanHanThang = conGiap.van_han_theo_thang?.find(v => v.thang === monthNum);
  const vanHanNam = conGiap.van_han_nam_2026;

  let body = '';

  if (vanHanThang) {
    body += `📊 Tổng quan: ${vanHanThang.luan || ''}\n`;
    if (vanHanThang.tien_tai) body += `💰 Tài lộc: ${vanHanThang.tien_tai}\n`;
    if (vanHanThang.su_nghiep) body += `💼 Sự nghiệp: ${vanHanThang.su_nghiep}\n`;
    if (vanHanThang.tinh_cam) body += `💕 Tình cảm: ${vanHanThang.tinh_cam}\n`;
  } else if (vanHanNam) {
    body += `📊 Tổng quan năm 2026: ${vanHanNam.tong_quan || ''}\n`;
    if (vanHanNam.tien_tai) body += `💰 Tài lộc: ${vanHanNam.tien_tai}\n`;
    if (vanHanNam.su_nghiep) body += `💼 Sự nghiệp: ${vanHanNam.su_nghiep}\n`;
    if (vanHanNam.tinh_cam) body += `💕 Tình cảm: ${vanHanNam.tinh_cam}\n`;
    if (vanHanNam.suc_khoe) body += `🏥 Sức khỏe: ${vanHanNam.suc_khoe}\n`;
  }

  const soMayMan = conGiap.so_may_man?.slice(0, 3).join(', ') || '';
  const mauMayMan = conGiap.mau_may_man?.slice(0, 2).join(', ') || '';
  const lucky = soMayMan || mauMayMan
    ? `\n🍀 Con số may mắn: ${soMayMan}${mauMayMan ? ` | Màu: ${mauMayMan}` : ''}`
    : '';

  const period = vanHanThang ? `Tháng ${monthNum}/2026` : 'Năm 2026';
  const chiTag = hashtag(`tuổi${conGiap.chi}`, `tuvituoi${conGiap.chi}`, 'tửvi2026', 'vậnhạn');

  return `${icon} Tử Vi ${period} — Tuổi ${conGiap.ten} (${conGiap.chi})\n${'─'.repeat(35)}\n\n${body.trim()}${lucky}\n\n${chiTag} #tuvivi #phongthuy`;
};

// ── 4. Từ Thảo Luận Cộng Đồng ────────────────────────────
export const generateFromDiscussion = (discussion) => {
  const contentPreview = (discussion.content || '')
    .replace(/<[^>]+>/g, '')
    .substring(0, 300);
  const suffix = (discussion.content || '').length > 300 ? '...' : '';

  return `💬 Câu hỏi từ cộng đồng Tử Vi\n${'─'.repeat(30)}\n\n❓ ${discussion.title}\n\n${contentPreview}${suffix}\n\n👇 Bạn nghĩ sao? Hãy để lại bình luận bên dưới!\n\n${hashtag('hoidap', 'tuvi', 'tuvivi', 'cộngđồng')}`;
};

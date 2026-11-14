import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Clock, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const authHeader = () => ({ Authorization: 'Bearer ' + localStorage.getItem('token') });

// ── Template generators (mirror của postTemplateService.js phía server) ──
const CUNG_EMOJI = { 'Mệnh':'⭐','Phụ Mẫu':'👴','Phúc Đức':'🙏','Điền Trạch':'🏠','Quan Lộc':'💼','Nô Bộc':'🤝','Thiên Di':'✈️','Tật Ách':'⚕️','Tài Bạch':'💰','Tử Tức':'👶','Phu Thê':'💑','Huynh Đệ':'👫' };
const SAO_EMOJI  = { 'Tử Vi':'👑','Thiên Phủ':'🏛️','Thái Dương':'☀️','Thái Âm':'🌙','Thiên Đồng':'😊','Thiên Lương':'⚖️','Thiên Cơ':'🧠','Vũ Khúc':'⚔️','Tham Lang':'🐺','Cự Môn':'🗣️','Liêm Trinh':'🔥','Phá Quân':'💥','Thất Sát':'🗡️','Thiên Tướng':'🛡️','Hóa Lộc':'💸','Hóa Quyền':'👊','Hóa Khoa':'📚','Hóa Kỵ':'⚠️' };
const GIAP_EMOJI = { 'Tý':'🐭','Sửu':'🐮','Dần':'🐯','Mão':'🐰','Thìn':'🐉','Tỵ':'🐍','Ngọ':'🐴','Mùi':'🐑','Thân':'🐵','Dậu':'🐔','Tuất':'🐶','Hợi':'🐷' };
const emo = (map, k) => map[k] || '✨';
const ht = (...tags) => tags.map(t => `#${t.replace(/\s+/g, '')}`).join(' ');

const templates = {
  interpretation: (d) => {
    const icon = emo(SAO_EMOJI, d.sao);
    const cIcon = emo(CUNG_EMOJI, d.cung);
    const ttMap = { M:'(Miếu)', V:'(Vượng)', Đ:'(Đắc)', B:'(Bình)', H:'(Hãm)' };
    let hdr = d.type === 'cach_cuc' ? `🏆 Cách Cục: ${d.tenCachCuc||''}` :
      d.sao && d.cung ? `${icon} ${d.sao} ${cIcon} tại cung ${d.cung} ${ttMap[d.trangThai]||''}`.trim() :
      d.sao ? `${icon} Ý nghĩa sao ${d.sao}` : `${cIcon} Cung ${d.cung} trong Tử Vi`;
    const src = d.source ? `\n📖 Nguồn: ${d.source}` : '';
    return `${hdr}\n${'─'.repeat(28)}\n\n${d.content}${src}\n\n${ht('tửvi','tuvivi','luậngiải','phongthủy')}`;
  },
  article: (d) => {
    const catIco = {'tu-vi':'🔮','phong-thuy':'🌿','xem-ngay':'📅','xem-tuoi':'🎂','van-khan':'🙏','kien-thuc':'📚','khac':'📝'};
    const icon = catIco[d.category] || '📰';
    const exc = d.excerpt || (d.content||'').replace(/<[^>]+>/g,'').substring(0,200)+'...';
    const url = d.slug ? `https://tuviviet.com/bai-viet/${d.slug}` : 'https://tuviviet.com';
    const tagStr = (d.tags||[]).slice(0,3).map(t=>`#${t.replace(/\s+/g,'')}`).join(' ');
    return `${icon} ${d.title}\n${'─'.repeat(28)}\n\n${exc}\n\n🔗 Đọc đầy đủ tại:\n${url}\n\n${tagStr} ${ht('tuvivi','kienthuc','phongthuy')}`;
  },
  conGiap: (d, month) => {
    const icon = emo(GIAP_EMOJI, d.chi);
    const m = parseInt(month) || new Date().getMonth()+1;
    const vt = d.van_han_theo_thang?.find(v=>v.thang===m);
    const vn = d.van_han_nam_2026;
    let body = '';
    if (vt) {
      if (vt.luan) body += `📊 Tổng quan: ${vt.luan}\n`;
      if (vt.tien_tai) body += `💰 Tài lộc: ${vt.tien_tai}\n`;
      if (vt.su_nghiep) body += `💼 Sự nghiệp: ${vt.su_nghiep}\n`;
      if (vt.tinh_cam) body += `💕 Tình cảm: ${vt.tinh_cam}\n`;
    } else if (vn) {
      if (vn.tong_quan) body += `📊 Tổng quan: ${vn.tong_quan}\n`;
      if (vn.tien_tai) body += `💰 Tài lộc: ${vn.tien_tai}\n`;
      if (vn.su_nghiep) body += `💼 Sự nghiệp: ${vn.su_nghiep}\n`;
      if (vn.tinh_cam) body += `💕 Tình cảm: ${vn.tinh_cam}\n`;
      if (vn.suc_khoe) body += `🏥 Sức khỏe: ${vn.suc_khoe}\n`;
    }
    const lucky = d.so_may_man?.length ? `\n🍀 Số may mắn: ${d.so_may_man.slice(0,3).join(', ')}` : '';
    const period = vt ? `Tháng ${m}/2026` : 'Năm 2026';
    return `${icon} Tử Vi ${period} — Tuổi ${d.ten} (${d.chi})\n${'─'.repeat(32)}\n\n${body.trim()}${lucky}\n\n${ht(`tuổi${d.chi}`,`tuvituoi${d.chi}`,'tửvi2026','vậnhạn')} #tuvivi`;
  },
  discussion: (d) => {
    const preview = (d.content||'').replace(/<[^>]+>/g,'').substring(0,280);
    const suffix = (d.content||'').length > 280 ? '...' : '';
    return `💬 Câu hỏi từ cộng đồng Tử Vi\n${'─'.repeat(28)}\n\n❓ ${d.title}\n\n${preview}${suffix}\n\n👇 Bạn nghĩ sao? Chia sẻ bên dưới!\n\n${ht('hoidap','tuvi','tuvivi','cộngđồng')}`;
  },
};

// ── Source tab configs ──
const SOURCES = [
  { key: 'interpretation', label: '🔮 Luận Giải', placeholder: 'Tìm theo tên sao, cung...' },
  { key: 'article',        label: '📰 Bài Viết',  placeholder: 'Tìm theo tiêu đề, tag...' },
  { key: 'conGiap',        label: '🐉 Con Giáp',  placeholder: 'Tuổi Tý, Sửu, Dần...' },
  { key: 'discussion',     label: '💬 Cộng Đồng', placeholder: 'Tìm theo tiêu đề, nội dung...' },
];

const TIME_PRESETS = ['06:00','07:00','09:00','12:00','18:00','20:00','21:00'];

const today = () => new Date().toISOString().split('T')[0];
const currentMonth = () => new Date().getMonth() + 1;

// ── Card renderers ──
function InterpCard({ d, onSelect }) {
  const icon = emo(SAO_EMOJI, d.sao);
  const cIcon = emo(CUNG_EMOJI, d.cung);
  return (
    <div className="cpicker__card" onClick={() => onSelect(d)}>
      <div className="cpicker__card-tag">
        {d.type === 'cach_cuc' ? '🏆 Cách cục' : d.type === 'sao_cung' ? `${icon}${cIcon}` : icon}
      </div>
      <div className="cpicker__card-title">
        {d.tenCachCuc || [d.sao, d.cung ? `/ ${d.cung}` : ''].filter(Boolean).join(' ') || d.type}
        {d.trangThai ? <span className="cpicker__tt">{d.trangThai}</span> : null}
      </div>
      <div className="cpicker__card-preview">{(d.content||'').substring(0,90)}...</div>
      {d.source && <div className="cpicker__card-source">📖 {d.source}</div>}
    </div>
  );
}

function ArticleCard({ d, onSelect }) {
  const catLabel = {'tu-vi':'Tử Vi','phong-thuy':'Phong Thủy','xem-ngay':'Xem Ngày','xem-tuoi':'Xem Tuổi','van-khan':'Văn Khấn','kien-thuc':'Kiến Thức','khac':'Khác'};
  return (
    <div className="cpicker__card" onClick={() => onSelect(d)}>
      <div className="cpicker__card-tag">{catLabel[d.category] || d.category}</div>
      <div className="cpicker__card-title">{d.title}</div>
      <div className="cpicker__card-preview">{d.excerpt || ''}</div>
      {d.tags?.length > 0 && <div className="cpicker__card-tags">{d.tags.slice(0,3).map(t=><span key={t}>#{t}</span>)}</div>}
    </div>
  );
}

function ConGiapCard({ d, month, onSelect }) {
  const icon = emo(GIAP_EMOJI, d.chi);
  const vt = d.van_han_theo_thang?.find(v => v.thang === month);
  return (
    <div className="cpicker__card" onClick={() => onSelect(d)}>
      <div className="cpicker__card-tag">{icon} Tuổi {d.chi}</div>
      <div className="cpicker__card-title">{d.ten} ({d.chi})</div>
      <div className="cpicker__card-preview">
        {vt ? (vt.luan||'').substring(0,80) : (d.van_han_nam_2026?.tong_quan||d.tinh_cach||'').substring(0,80)}...
      </div>
      {vt && <div className="cpicker__card-source">📅 Tháng {month}/2026</div>}
    </div>
  );
}

function DiscussionCard({ d, onSelect }) {
  return (
    <div className="cpicker__card" onClick={() => onSelect(d)}>
      <div className="cpicker__card-tag">💬 Cộng đồng</div>
      <div className="cpicker__card-title">{d.title}</div>
      <div className="cpicker__card-preview">{(d.content||'').replace(/<[^>]+>/g,'').substring(0,90)}...</div>
      <div className="cpicker__card-source">👍 {d.likesCount} · 💬 {d.commentsCount}</div>
    </div>
  );
}

// ── Main Component ──
export default function SchedulePostTab({ onShowStatus }) {
  const [source, setSource]       = useState('interpretation');
  const [search, setSearch]       = useState('');
  const [month, setMonth]         = useState(currentMonth());
  const [results, setResults]     = useState([]);
  const [fetching, setFetching]   = useState(false);
  const [content, setContent]     = useState('');
  const [imageUrl, setImageUrl]   = useState('');
  const [schedDate, setSchedDate] = useState(today());
  const [schedTime, setSchedTime] = useState('08:00');
  const [preview, setPreview]     = useState(false);
  const [loading, setLoading]     = useState(false);

  // ── Fetch content list ──
  const fetchContent = useCallback(async () => {
    setFetching(true);
    try {
      const endpointMap = {
        interpretation: `/admin/content-picker/interpretations?search=${encodeURIComponent(search)}&limit=20`,
        article:        `/admin/content-picker/articles?search=${encodeURIComponent(search)}&limit=20`,
        conGiap:        `/admin/content-picker/con-giap?chi=${encodeURIComponent(search)}&month=${month}`,
        discussion:     `/admin/content-picker/discussions?search=${encodeURIComponent(search)}&limit=20`,
      };
      const res = await axios.get(API_URL + endpointMap[source], { headers: authHeader() });
      if (res.data.success) setResults(res.data.data || []);
    } catch (e) { console.error(e); setResults([]); }
    finally { setFetching(false); }
  }, [source, search, month]);

  // Auto-load on source change
  React.useEffect(() => { fetchContent(); }, [source]);

  // ── Select a card → generate content ──
  const handleSelect = (item) => {
    let generated = '';
    if (source === 'interpretation') generated = templates.interpretation(item);
    else if (source === 'article')   generated = templates.article(item);
    else if (source === 'conGiap')   generated = templates.conGiap(item, month);
    else if (source === 'discussion')generated = templates.discussion(item);
    setContent(generated);
    // Scroll to editor
    document.getElementById('sched-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return onShowStatus(false, 'Vui lòng nhập nội dung bài viết!');
    setLoading(true);
    try {
      const scheduledAt = new Date(`${schedDate}T${schedTime}:00`).toISOString();
      const res = await axios.post(`${API_URL}/admin/scheduled-posts`, {
        content, imageUrl, scheduledAt, sourceType: source,
      }, { headers: authHeader() });
      onShowStatus(res.data.success, res.data.message);
      if (res.data.success) { setContent(''); setImageUrl(''); setPreview(false); }
    } catch (err) {
      onShowStatus(false, err.response?.data?.message || 'Lỗi lên lịch!');
    } finally { setLoading(false); }
  };

  const currentSrc = SOURCES.find(s => s.key === source);

  return (
    <div className="sched-new__layout">

      {/* ══ CỘT TRÁI — Content Browser ══ */}
      <div className="sched-new__browser">
        <div className="sched-new__browser-header">
          <h3>📚 Chọn nội dung từ website</h3>
          <p>Bấm vào card để tự động điền sang editor</p>
        </div>

        {/* Source tabs */}
        <div className="sched-new__source-tabs">
          {SOURCES.map(s => (
            <button key={s.key}
              className={`sched-new__source-tab${source === s.key ? ' active' : ''}`}
              onClick={() => { setSource(s.key); setSearch(''); setResults([]); }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Search + month filter */}
        <div className="sched-new__search-row">
          <input
            type="text"
            placeholder={currentSrc?.placeholder || 'Tìm kiếm...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchContent()}
            className="sched-new__search-input"
          />
          {source === 'conGiap' && (
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="sched-new__month-select">
              {Array.from({length:12},(_,i)=>i+1).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          )}
          <button onClick={fetchContent} className="sched-new__search-btn" disabled={fetching}>
            {fetching ? '⏳' : '🔍'}
          </button>
        </div>

        {/* Results */}
        <div className="sched-new__results">
          {fetching ? (
            <div className="sched-new__loading">
              <div className="sched-new__spinner" />
              Đang tải dữ liệu...
            </div>
          ) : results.length === 0 ? (
            <div className="sched-new__empty">
              <p>Không có kết quả.<br/>Thử tìm kiếm hoặc bỏ trống để xem tất cả.</p>
            </div>
          ) : (
            <div className="sched-new__cards">
              {results.map((item, i) => {
                const key = item._id || item.id || i;
                if (source === 'interpretation') return <InterpCard key={key} d={item} onSelect={handleSelect} />;
                if (source === 'article')        return <ArticleCard key={key} d={item} onSelect={handleSelect} />;
                if (source === 'conGiap')        return <ConGiapCard key={key} d={item} month={month} onSelect={handleSelect} />;
                if (source === 'discussion')     return <DiscussionCard key={key} d={item} onSelect={handleSelect} />;
                return null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══ CỘT PHẢI — Post Editor ══ */}
      <div className="sched-new__editor" id="sched-editor">
        <div className="sched-new__editor-header">
          <h3>✏️ Editor bài đăng</h3>
          <button type="button" className="sched-new__preview-toggle" onClick={() => setPreview(p=>!p)}>
            {preview ? <EyeOff size={14}/> : <Eye size={14}/>}
            {preview ? 'Ẩn preview' : 'FB Preview'}
          </button>
        </div>

        {/* FB Preview */}
        {preview && content && (
          <div className="sched-new__fb-preview">
            <div className="sched-new__fb-header">
              <div className="sched-new__fb-avatar">📘</div>
              <div>
                <div className="sched-new__fb-name">Facebook Page của bạn</div>
                <div className="sched-new__fb-meta">Vừa xong · 🌐</div>
              </div>
            </div>
            <div className="sched-new__fb-content">{content}</div>
            {imageUrl && (
              <img src={imageUrl} alt="" className="sched-new__fb-img"
                onError={e => e.target.style.display='none'} />
            )}
            <div className="sched-new__fb-footer">
              <span>👍 Thích</span><span>💬 Bình luận</span><span>↗️ Chia sẻ</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="sched-new__form">
          <div className="sched-new__field">
            <div className="sched-new__field-header">
              <label>Nội dung bài đăng *</label>
              <span className="sched-new__char">{content.length} ký tự</span>
            </div>
            <textarea
              rows={10}
              placeholder="Bấm vào card bên trái để điền tự động, hoặc tự nhập..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          <div className="sched-new__field">
            <label>🖼️ URL ảnh đính kèm (tùy chọn)</label>
            <input type="url" placeholder="https://example.com/anh.jpg"
              value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            {imageUrl && (
              <img src={imageUrl} alt="" className="sched-new__img-thumb"
                onError={e => e.target.style.display='none'} />
            )}
          </div>

          <div className="sched-new__datetime-row">
            <div className="sched-new__field">
              <label>📅 Ngày đăng *</label>
              <input type="date" min={today()} value={schedDate}
                onChange={e => setSchedDate(e.target.value)} required />
            </div>
            <div className="sched-new__field">
              <label>⏰ Giờ đăng *</label>
              <input type="time" value={schedTime}
                onChange={e => setSchedTime(e.target.value)} required />
            </div>
          </div>

          <div className="sched-new__presets">
            <span>Giờ nhanh:</span>
            {TIME_PRESETS.map(t => (
              <button key={t} type="button"
                className={`sched-new__preset${schedTime===t?' active':''}`}
                onClick={() => setSchedTime(t)}>{t}</button>
            ))}
          </div>

          <button type="submit" className="sched-new__submit" disabled={loading || !content.trim()}>
            <Clock size={16} />
            {loading ? 'Đang lên lịch...' : '📅 Lên Lịch Đăng Bài'}
          </button>
        </form>
      </div>
    </div>
  );
}

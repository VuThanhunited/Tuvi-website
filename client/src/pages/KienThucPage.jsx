import './StaticPages.css';

export default function KienThucPage() {
  const articles = [
    { emoji: '📖', title: 'Tử Vi Là Gì? Hướng Dẫn Cho Người Mới Bắt Đầu', desc: 'Tìm hiểu cơ bản về tử vi cổ học Việt Nam, lịch sử hình thành và cách đọc lá số tử vi.', date: '28/04/2025', category: 'Cơ bản' },
    { emoji: '🌟', title: '12 Cung Trong Lá Số Tử Vi: Ý Nghĩa Chi Tiết', desc: 'Giải thích ý nghĩa của 12 cung trong lá số tử vi: Mệnh, Thân, Phụ Mẫu, Phúc Đức...', date: '25/04/2025', category: 'Kiến thức' },
    { emoji: '⭐', title: 'Các Sao Chính Tinh: Tử Vi, Thiên Phủ, Thái Dương...', desc: 'Tìm hiểu 14 sao chính tinh quan trọng nhất trong lá số tử vi và ảnh hưởng của chúng.', date: '22/04/2025', category: 'Sao' },
    { emoji: '🔥', title: 'Ngũ Hành Kim Mộc Thủy Hỏa Thổ: Tương Sinh Tương Khắc', desc: 'Giải thích quy luật ngũ hành, mối quan hệ tương sinh tương khắc và ứng dụng trong tử vi.', date: '20/04/2025', category: 'Ngũ hành' },
    { emoji: '💑', title: 'Xem Tuổi Hợp Vợ Chồng Theo Tử Vi', desc: 'Cách xem tuổi hợp, tuổi xung khắc giữa hai người dựa trên can chi và ngũ hành năm sinh.', date: '18/04/2025', category: 'Tình duyên' },
    { emoji: '🏠', title: 'Phong Thủy Nhà Ở Theo Mệnh Ngũ Hành', desc: 'Hướng dẫn bố trí nhà cửa, chọn hướng nhà, màu sắc phù hợp với mệnh ngũ hành.', date: '15/04/2025', category: 'Phong thủy' },
    { emoji: '📅', title: 'Cách Chọn Ngày Tốt Theo Lịch Âm', desc: 'Hướng dẫn chọn ngày hoàng đạo, ngày tốt cho các sự kiện quan trọng: cưới hỏi, khai trương...', date: '12/04/2025', category: 'Lịch' },
    { emoji: '🐲', title: '12 Con Giáp: Đặc Điểm Tính Cách Và Vận Mệnh', desc: 'Phân tích chi tiết tính cách, ưu nhược điểm và dự báo vận mệnh cho 12 con giáp.', date: '10/04/2025', category: '12 con giáp' },
  ];

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>📚 Kiến Thức Tử Vi</h1>
          <p>Tổng hợp bài viết hữu ích về tử vi, phong thủy và chiêm tinh học</p>
        </div>

        <div className="community-grid">
          {articles.map((a, i) => (
            <div key={i} className="discussion-card" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>{a.emoji}</div>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(212,175,55,0.1)', color: 'var(--color-gold)', borderRadius: '50px', marginBottom: 'var(--space-sm)', display: 'inline-block' }}>
                {a.category}
              </span>
              <h3 className="discussion-title" style={{ marginTop: 'var(--space-sm)' }}>{a.title}</h3>
              <p className="discussion-preview">{a.desc}</p>
              <div className="discussion-stats">
                <span>📅 {a.date}</span>
                <span style={{ color: 'var(--color-gold)' }}>Đọc thêm →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

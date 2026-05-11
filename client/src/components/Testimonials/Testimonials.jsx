import './Testimonials.css';

const testimonials = [
  {
    stars: 5,
    text: 'Kết quả xem tử vi rất chính xác! Tôi đã so sánh với thầy tử vi ở ngoài và kết quả gần như giống nhau. Rất ấn tượng với công cụ miễn phí này.',
    name: 'Nguyễn Văn Minh',
    role: 'Doanh nhân, Hà Nội',
    avatar: 'M',
  },
  {
    stars: 5,
    text: 'Trang web rất dễ sử dụng, kết quả chi tiết và dễ hiểu. Tôi đã giới thiệu cho rất nhiều bạn bè. Luận giải 12 cung rất hay và sát thực.',
    name: 'Trần Thị Hương',
    role: 'Giáo viên, TP.HCM',
    avatar: 'H',
  },
  {
    stars: 4,
    text: 'Phần lập lá số rất chi tiết với hơn 100 sao. Giao diện đẹp, hiện đại. Tôi sử dụng hàng ngày để xem dự báo 12 con giáp.',
    name: 'Phạm Đức Anh',
    role: 'Lập trình viên, Đà Nẵng',
    avatar: 'A',
  },
];

const stats = [
  { value: '726K+', label: 'Lượt truy cập/tháng' },
  { value: '1M+', label: 'Lá số đã tính' },
  { value: '4.8/5', label: 'Đánh giá trung bình' },
  { value: '100+', label: 'Sao tinh tú' },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section section" id="testimonials">
      <div className="container">
        <h2 className="section-title">💬 Người Dùng Nói Gì?</h2>
        <p className="section-subtitle">
          Hàng triệu người đã tin tưởng và sử dụng dịch vụ của chúng tôi
        </p>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(t.stars)].map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import './FeaturesGrid.css';

const features = [
  { icon: '📈', title: 'Phân Tích Chi Tiết', desc: 'Luận giải chi tiết 12 cung mệnh và hơn 100 sao tinh tú theo phương pháp tử vi cổ học Việt Nam.' },
  { icon: '🎯', title: 'Chính Xác Cao', desc: 'Thuật toán tính toán dựa trên phái tử vi Việt Nam chuẩn, đã được kiểm chứng bởi các chuyên gia.' },
  { icon: '⚡', title: 'Kết Quả Tức Thì', desc: 'Chỉ cần vài giây để nhận kết quả phân tích lá số tử vi chi tiết và lời khuyên ứng xử.' },
  { icon: '🎁', title: 'Hoàn Toàn Miễn Phí', desc: 'Sử dụng tất cả tính năng miễn phí. Không cần đăng ký tài khoản để xem tử vi.' },
  { icon: '🛡️', title: 'Bảo Mật Dữ Liệu', desc: 'Dữ liệu cá nhân được bảo mật tuyệt đối. Chúng tôi không lưu trữ thông tin nhạy cảm.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Giao diện thân thiện trên mọi thiết bị. Xem tử vi mọi lúc, mọi nơi trên điện thoại.' },
];

export default function FeaturesGrid() {
  return (
    <section className="features-section section" id="features">
      <div className="container">
        <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
        <p className="section-subtitle">Nền tảng tử vi cổ học toàn diện và đáng tin cậy nhất Việt Nam</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import './StaticPages.css';

export default function AboutPage() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>🏢 Về Chúng Tôi</h1>
          <p>Tìm hiểu thêm về sứ mệnh và đội ngũ đằng sau nền tảng tử vi cổ học hàng đầu Việt Nam</p>
        </div>

        <div className="content-card">
          <h2>🌟 Sứ Mệnh</h2>
          <p>
            TuVi được thành lập với mục tiêu mang kiến thức tử vi cổ học Việt Nam đến gần hơn 
            với mọi người. Chúng tôi tin rằng hiểu biết về vận mệnh giúp mỗi người đưa ra 
            quyết định tốt hơn trong cuộc sống.
          </p>
          <p>
            Với công nghệ hiện đại kết hợp tri thức cổ truyền, chúng tôi xây dựng nền tảng 
            tử vi chính xác, dễ sử dụng và hoàn toàn miễn phí cho tất cả người dùng.
          </p>
        </div>

        <div className="content-card">
          <h2>👥 Đội Ngũ</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">👨‍💻</div>
              <div className="team-name">Nguyễn Minh Tuấn</div>
              <div className="team-role">Founder & Developer</div>
            </div>
            <div className="team-card">
              <div className="team-avatar">🧙‍♂️</div>
              <div className="team-name">Thầy Trần Văn Hùng</div>
              <div className="team-role">Chuyên gia Tử Vi</div>
            </div>
            <div className="team-card">
              <div className="team-avatar">👩‍🎨</div>
              <div className="team-name">Lê Thị Mai</div>
              <div className="team-role">UI/UX Designer</div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>📊 Thành Tựu</h2>
          <ul>
            <li>Hơn 726,000 lượt truy cập mỗi tháng</li>
            <li>Hơn 1 triệu lá số đã được tính toán</li>
            <li>Đánh giá trung bình 4.8/5 sao từ người dùng</li>
            <li>Hỗ trợ hơn 100 sao tinh tú trong lá số</li>
            <li>Cộng đồng hơn 50,000 thành viên tích cực</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

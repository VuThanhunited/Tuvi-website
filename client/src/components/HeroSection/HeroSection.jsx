import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      <div className="hero-bg" />
      <div className="hero-stars">
        {[...Array(8)].map((_, i) => <div key={i} className="hero-star" />)}
      </div>
      <div className="hero-zodiac-ring" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Tử Vi Cổ Học Uy Tín Hàng Đầu Việt Nam
        </div>

        <h1 className="hero-title">
          <span className="hero-title-white">Khám Phá </span>
          <span className="hero-title-highlight">Vận Mệnh</span>
          <br />
          <span className="hero-title-white">Của Bạn</span>
        </h1>

        <p className="hero-description">
          Xem tử vi trọn đời, dự báo tương lai, hiểu rõ bản thân hơn 
          với công cụ tử vi cổ học chính xác nhất. Phân tích chi tiết 
          12 cung mệnh và hơn 100 sao tinh tú.
        </p>

        <div className="hero-actions">
          <Link to="/xem-tu-vi" className="btn btn-primary btn-lg">
            ✨ Xem Tử Vi Ngay
          </Link>
          <Link to="/la-so" className="btn btn-outline btn-lg">
            📊 Lập Lá Số
          </Link>
        </div>

        <div className="hero-trust">
          <div className="hero-trust-item">
            <span className="hero-trust-icon">✅</span> Hoàn toàn miễn phí
          </div>
          <div className="hero-trust-item">
            <span className="hero-trust-icon">🎯</span> Chính xác cao
          </div>
          <div className="hero-trust-item">
            <span className="hero-trust-icon">⚡</span> Kết quả tức thì
          </div>
          <div className="hero-trust-item">
            <span className="hero-trust-icon">🛡️</span> Bảo mật dữ liệu
          </div>
        </div>
      </div>

      <a href="#tuvi-form" className="hero-scroll-down">
        <span>Cuộn xuống</span>
        <div className="hero-scroll-arrow" />
      </a>
    </section>
  );
}

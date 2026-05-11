import { Link } from 'react-router-dom';
import logoImg from '../../data/logo.jpg';
import './Footer.css';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      {/* Main Footer Links Grid */}
      <div className="footer-links-section">
        <div className="container">
          <div className="footer-links-grid">
            {/* Xem Tử Vi */}
            <div className="footer-link-col">
              <h4>Xem tử vi</h4>
              <ul>
                <li><Link to="/xem-tu-vi">Tử vi {currentYear}</Link></li>
                <li><Link to="/xem-tu-vi">Tử vi hàng ngày</Link></li>
                <li><Link to="/horoscope">Tử vi 12 con giáp</Link></li>
                <li><Link to="/xem-tu-vi">Tử vi trọn đời</Link></li>
                <li><Link to="/xem-tu-vi">Lập lá số tử vi</Link></li>
                <li><Link to="#">Cân xương tính số</Link></li>
                <li><Link to="#">Thống kê cân xương</Link></li>
              </ul>
            </div>

            {/* Xem Tuổi */}
            <div className="footer-link-col">
              <h4>Xem tuổi</h4>
              <ul>
                <li><Link to="#">Xem tuổi xông đất</Link></li>
                <li><Link to="#">Xem tuổi vợ chồng</Link></li>
                <li><Link to="#">Xem tuổi kết hôn</Link></li>
                <li><Link to="#">Xem tuổi làm nhà</Link></li>
                <li><Link to="#">Xem tuổi sinh con</Link></li>
                <li><Link to="#">Xem tuổi làm ăn</Link></li>
                <li><Link to="#">Xem tuổi hợp nhau</Link></li>
              </ul>
            </div>

            {/* Lịch Vạn Niên */}
            <div className="footer-link-col">
              <h4>Lịch vạn niên</h4>
              <ul>
                <li><Link to="#">Lịch vạn niên hôm nay</Link></li>
                <li><Link to="#">Lịch vạn niên tháng</Link></li>
                <li><Link to="#">Lịch vạn niên năm</Link></li>
              </ul>
            </div>

            {/* Xem Ngày */}
            <div className="footer-link-col">
              <h4>Xem ngày</h4>
              <ul>
                <li><Link to="#">Xem ngày tốt xấu</Link></li>
                <li><Link to="#">Xem ngày kết hôn</Link></li>
                <li><Link to="#">Xem ngày xuất hành</Link></li>
                <li><Link to="#">Xem ngày nhập trạch</Link></li>
                <li><Link to="#">Xem ngày mua xe</Link></li>
                <li><Link to="#">Xem ngày động thổ</Link></li>
                <li><Link to="#">Xem ngày an táng</Link></li>
              </ul>
            </div>

            {/* Chuyên Mục Khác */}
            <div className="footer-link-col">
              <h4>Chuyên mục khác</h4>
              <ul>
                <li><Link to="/kien-thuc">Thư viện tử vi</Link></li>
                <li><Link to="#">Văn khấn</Link></li>
                <li><Link to="#">Thước lỗ ban</Link></li>
                <li><Link to="#">Xem tướng</Link></li>
                <li><Link to="#">Thần số học</Link></li>
                <li><Link to="#">Kết quả xổ số</Link></li>
                <li><Link to="#">Tử Vi Việt Nam</Link></li>
                <li><Link to="#">Bất động sản</Link></li>
                <li><Link to="#">Tử vi cổ học</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Section */}
      <div className="footer-info-section">
        <div className="container">
          <div className="footer-info-grid">
            {/* Brand Info */}
            <div className="footer-brand-info">
              <Link to="/" className="footer-logo">
                <img src={logoImg} alt="TuVi Logo" style={{ height: '56px', borderRadius: '6px' }} />
              </Link>
              <h3 className="footer-brand-name">
                TuVi - Trang tử vi cổ học hàng đầu Việt Nam
              </h3>
              <div className="footer-contact-info">
                <p><strong>Địa chỉ:</strong> TP. Hồ Chí Minh, Việt Nam</p>
                <p><strong>Email:</strong> <a href="mailto:info@tuvi.vn">info@tuvi.vn</a></p>
                <p><strong>Hotline/Zalo:</strong> <a href="tel:0817505493">0817.505.493</a></p>
                <p><strong>Liên hệ quảng cáo:</strong> <Link to="/lien-he">Xem chi tiết</Link></p>
              </div>
              <p className="footer-copyright-text">
                Copyright © {currentYear} TuVi, All Rights Reserved
              </p>
            </div>

            {/* Social Connect */}
            <div className="footer-connect">
              <h4>Kết nối với TuVi</h4>
              <div className="footer-social-grid">
                {/* Phone */}
                <a href="tel:0817505493" className="social-icon social-phone" aria-label="Phone">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.25 1.02l-2.2 2.22z"/></svg>
                </a>
                {/* Messenger */}
                <a href="#" className="social-icon social-messenger" aria-label="Messenger">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18.16.15.26.36.27.58l.05 1.82c.02.62.66 1.03 1.24.78l2.03-.9c.17-.08.37-.1.55-.06.89.24 1.84.37 2.71.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6.12 7.57l-2.93 4.66c-.47.74-1.46.93-2.17.41l-2.33-1.75a.6.6 0 00-.72 0L7.1 15.1c-.39.3-.9-.16-.64-.58l2.93-4.66c.47-.74 1.46-.93 2.17-.41l2.33 1.75a.6.6 0 00.72 0l2.87-2.18c.39-.3.9.16.64.58z"/></svg>
                </a>
                {/* Zalo */}
                <a href="#" className="social-icon social-zalo" aria-label="Zalo">
                  <svg viewBox="0 0 48 48" width="22" height="22" fill="#fff"><path d="M12.5 10h23a2.5 2.5 0 012.5 2.5v23a2.5 2.5 0 01-2.5 2.5h-23A2.5 2.5 0 0110 35.5v-23A2.5 2.5 0 0112.5 10z" fill="none"/><text x="13" y="33" fontFamily="Arial" fontWeight="900" fontSize="22" fill="#fff">Z</text></svg>
                </a>
                {/* Telegram */}
                <a href="#" className="social-icon social-telegram" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6.54l-1.97 9.29c-.15.67-.54.83-1.09.52l-3.02-2.22-1.46 1.4c-.16.16-.3.3-.61.3l.22-3.06 5.57-5.03c.24-.22-.05-.34-.38-.13l-6.88 4.34-2.96-.93c-.64-.2-.66-.64.14-.95l11.59-4.47c.53-.2 1-.05.85.94z"/></svg>
                </a>
                {/* Facebook */}
                <a href="#" className="social-icon social-facebook" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="social-icon social-instagram" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="social-icon social-youtube" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                {/* TikTok */}
                <a href="#" className="social-icon social-tiktok" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" className="social-icon social-twitter" aria-label="X/Twitter">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* Threads */}
                <a href="#" className="social-icon social-threads" aria-label="Threads">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.171.408-2.212 1.333-2.932.854-.664 2.027-1.058 3.394-1.14 1.002-.06 1.945.02 2.823.23-.074-.775-.296-1.376-.665-1.793-.468-.53-1.2-.81-2.18-.834-1.588.017-2.593.554-3.16 1.69l-1.796-.94C8.258 6.27 9.882 5.397 12.14 5.368c1.586.017 2.833.526 3.71 1.512.808.91 1.231 2.146 1.258 3.672l.006.48c1.12.566 2.003 1.378 2.57 2.372.855 1.496.96 3.932-.82 5.698C17.16 20.842 14.986 21.86 12.186 24zm.09-8.876c-1.196.067-2.695.435-2.757 1.637-.028.508.2.96.642 1.273.56.396 1.35.573 2.227.527 1.108-.06 1.965-.47 2.548-1.22.406-.523.694-1.248.839-2.168-.71-.2-1.52-.311-2.37-.262-.377.022-.755.067-1.129.133z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="footer-bottom-links">
            <Link to="/">Trang chủ</Link>
            <span className="footer-divider">|</span>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            <span className="footer-divider">|</span>
            <Link to="/bao-mat">Chính sách bảo mật</Link>
            <span className="footer-divider">|</span>
            <Link to="/lien-he">Liên hệ quảng cáo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

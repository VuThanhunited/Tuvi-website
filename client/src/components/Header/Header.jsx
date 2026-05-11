import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import logoImg from '../../data/logo.jpg';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isMaster, credits, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (paths) => paths.some(p => location.pathname.startsWith(p));

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="main-header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src={logoImg} alt="TuVi Logo" style={{ height: '46px', borderRadius: '4px' }} />
        </Link>

        {/* Navigation */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} id="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Trang Chủ
          </Link>

          {/* Tính Toán & Công Cụ - Dropdown */}
          <div className="nav-dropdown">
            <span className={`nav-link nav-dropdown-trigger ${isGroupActive(['/xem-tu-vi', '/la-so', '/ket-qua']) ? 'active' : ''}`}>
              Tính Toán <span className="nav-dropdown-arrow">▼</span>
            </span>
            <div className="nav-dropdown-menu">
              <Link to="/xem-tu-vi" className="nav-dropdown-item">
                <span>🔮</span> Xem Tử Vi Trọn Đời
              </Link>
              <Link to="/la-so" className="nav-dropdown-item">
                <span>📊</span> Lập Lá Số Tử Vi
              </Link>
            </div>
          </div>

          {/* 12 Con Giáp */}
          <Link to="/horoscope" className={`nav-link ${isGroupActive(['/horoscope']) ? 'active' : ''}`}>
            12 Con Giáp
          </Link>

          {/* Kiến Thức */}
          <Link to="/kien-thuc" className={`nav-link ${isGroupActive(['/kien-thuc']) ? 'active' : ''}`}>
            Kiến Thức
          </Link>

          {/* Tài Khoản - Dropdown */}
          <div className="nav-dropdown">
            <span className={`nav-link nav-dropdown-trigger ${isGroupActive(['/tai-khoan', '/lich-su', '/yeu-thich', '/cong-dong']) ? 'active' : ''}`}>
              Cộng Đồng <span className="nav-dropdown-arrow">▼</span>
            </span>
            <div className="nav-dropdown-menu">
              <Link to="/cong-dong" className="nav-dropdown-item">
                <span>💬</span> Cộng Đồng
              </Link>
              <Link to="/lich-su" className="nav-dropdown-item">
                <span>📜</span> Lịch Sử Tính Toán
              </Link>
              <Link to="/yeu-thich" className="nav-dropdown-item">
                <span>❤️</span> Bài Viết Yêu Thích
              </Link>
            </div>
          </div>

          {/* Hỗ Trợ - Dropdown */}
          <div className="nav-dropdown">
            <span className={`nav-link nav-dropdown-trigger ${isGroupActive(['/ve-chung-toi', '/lien-he', '/dieu-khoan', '/bao-mat', '/faq']) ? 'active' : ''}`}>
              Hỗ Trợ <span className="nav-dropdown-arrow">▼</span>
            </span>
            <div className="nav-dropdown-menu">
              <Link to="/ve-chung-toi" className="nav-dropdown-item">
                <span>🏢</span> Về Chúng Tôi
              </Link>
              <Link to="/lien-he" className="nav-dropdown-item">
                <span>📧</span> Liên Hệ
              </Link>
              <Link to="/dieu-khoan" className="nav-dropdown-item">
                <span>📄</span> Điều Khoản Sử Dụng
              </Link>
              <Link to="/bao-mat" className="nav-dropdown-item">
                <span>🔒</span> Chính Sách Bảo Mật
              </Link>
              <Link to="/faq" className="nav-dropdown-item">
                <span>❓</span> Câu Hỏi Thường Gặp
              </Link>
            </div>
          </div>

          {/* Mobile-only actions */}
          <div className="nav-actions-mobile">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <Link to="/admin/interpretations" className="btn btn-outline btn-sm">⚙️ Data CMS</Link>
                    <Link to="/admin/masters" className="btn btn-outline btn-sm">🎓 Thầy CMS</Link>
                  </div>
                )}
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Đăng Xuất</button>
              </>
            ) : (
              <>
                <Link to="/dang-nhap" className="btn btn-outline btn-sm">Đăng Nhập</Link>
                <Link to="/dang-ky" className="btn btn-primary btn-sm">Đăng Ký</Link>
              </>
            )}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          <button className="nav-search-btn" aria-label="Tìm kiếm" id="search-btn">🔍</button>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <div style={{display: 'flex', gap: '5px'}}>
                  <Link to="/admin/interpretations" className="btn btn-outline btn-sm" title="Data CMS">⚙️ Data</Link>
                  <Link to="/admin/masters" className="btn btn-outline btn-sm" title="Masters CMS">🎓 Thầy</Link>
                </div>
              )}
              <div className="user-menu-wrapper" style={{ position: 'relative' }}>
                <span className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  👤 {user?.hoTen?.split(' ').pop() || 'User'}
                  {credits > 0 && <span style={{ background: '#d4af37', color: '#fff', borderRadius: '10px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{credits}</span>}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">Đăng Xuất</button>
            </>
          ) : (
            <>
              <Link to="/dang-nhap" className="btn btn-outline btn-sm">Đăng Nhập</Link>
              <Link to="/dang-ky" className="btn btn-primary btn-sm">Đăng Ký</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`mobile-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          id="mobile-menu-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

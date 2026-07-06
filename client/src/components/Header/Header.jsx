import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { StarChartIcon, CoinIcon, ScrollIcon, CompassIcon, MasterIcon, ArticleIcon, HoroscopeIcon, GlobeIcon, BellIcon, PointsDiamondIcon } from '../Icons.jsx';
import logoImg from '../../data/logo.jpg';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');
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

  useEffect(() => { 
    setMenuOpen(false); 
    setOpenDropdown('');
  }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (paths) => paths.some(p => location.pathname.startsWith(p));

  const toggleDropdown = (name) => {
    if (window.innerWidth <= 960) {
      setOpenDropdown(prev => prev === name ? '' : name);
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="main-header">
      <div className="header-inner">
        {/* Logo - Gold Outline Trigram Wheel & Text matching mockup */}
        <Link to="/" className="header-logo">
          <div className="header-logo-container">
            <img 
              className="header-logo-wheel" 
              src="/icons/01_logo_quan_tu_vi.png" 
              alt="Quán Tử Vi Logo" 
              width="38" 
              height="38" 
              style={{ objectFit: 'contain' }}
            />
            <div className="header-logo-text-wrapper">
              <span className="header-logo-title">QUÁN TỬ VI</span>
              <span className="header-logo-subtitle">Hiểu vận mệnh - Sống an nhiên</span>
            </div>
          </div>
        </Link>

        {/* Navigation with icons matching mockup */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} id="nav-menu">
          <Link to="/la-so" className={`nav-link nav-link-icon ${isGroupActive(['/la-so']) ? 'active' : ''}`}>
            <span className="nav-icon"><StarChartIcon size={20} /></span>
            <span className="nav-text">Lập Lá Số</span>
          </Link>

          <Link to="/kien-thuc" className={`nav-link nav-link-icon ${isGroupActive(['/kien-thuc']) ? 'active' : ''}`}>
            <span className="nav-icon"><CoinIcon size={20} /></span>
            <span className="nav-text">Phú Tử Vi</span>
          </Link>

          <Link to="/ve-chung-toi" className={`nav-link nav-link-icon ${isGroupActive(['/ve-chung-toi']) ? 'active' : ''}`}>
            <span className="nav-icon"><ScrollIcon size={20} /></span>
            <span className="nav-text">Giới thiệu Tử Vi</span>
          </Link>

          <Link to="/huong-dan" className={`nav-link nav-link-icon ${isActive('/huong-dan') ? 'active' : ''}`}>
            <span className="nav-icon"><CompassIcon size={20} /></span>
            <span className="nav-text">Hướng Dẫn Xem Tử Vi Cơ Bản</span>
          </Link>

          <Link to="/danh-sach-thay" className={`nav-link nav-link-icon ${isGroupActive(['/danh-sach-thay']) ? 'active' : ''}`}>
            <span className="nav-icon"><MasterIcon size={20} /></span>
            <span className="nav-text">Danh sách Thầy Tử Vi</span>
          </Link>

          {/* Active state in mockup is Bài viết */}
          <Link to="/" className={`nav-link nav-link-icon active`}>
            <span className="nav-icon"><ArticleIcon size={20} /></span>
            <span className="nav-text">Bài viết</span>
          </Link>

          <Link to="/la-so-cua-ban" className={`nav-link nav-link-icon ${isActive('/la-so-cua-ban') ? 'active' : ''}`}>
            <span className="nav-icon"><HoroscopeIcon size={20} /></span>
            <span className="nav-text">Lá số của bạn</span>
          </Link>

          <Link to="/mxh" className={`nav-link nav-link-icon ${isActive('/mxh') ? 'active' : ''}`}>
            <span className="nav-icon"><GlobeIcon size={20} /></span>
            <span className="nav-text">Giới thiệu MXH Tử Vi</span>
          </Link>
        </nav>

        {/* Desktop Actions - Credits, Notifications & Avatar */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* Notification Icon */}
              <div className="header-notification">
                <span className="notification-bell"><BellIcon size={20} stroke="#ffd700" /></span>
                <span className="notification-badge">3</span>
              </div>

              {/* User Avatar */}
              <div className="header-avatar">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                  alt="User Profile" 
                  className="user-profile-img" 
                />
              </div>

              {/* Credits Display */}
              <div className="header-credits">
                <span className="credits-label">Điểm của tôi:</span>
                <span className="credits-value">
                  <PointsDiamondIcon size={14} style={{ marginRight: '4px' }} />
                  {credits ? credits.toLocaleString('vi-VN') : '12.860'} điểm 
                  <span className="dropdown-arrow-mini">▼</span>
                </span>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/dang-nhap" className="auth-btn login-btn">Đăng nhập</Link>
              <Link to="/dang-ky" className="auth-btn register-btn">Đăng ký</Link>
            </div>
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

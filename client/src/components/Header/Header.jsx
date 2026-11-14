import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import HomeBanner from '../HomeBanner/HomeBanner.jsx';
import './Header.css';

function HomeNavIcon() {
  return (
    <svg className="qtv-nav-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 9.5L10 3.5L17 9.5V16.5C17 17.05 16.55 17.5 16 17.5H12.5V12.5H7.5V17.5H4C3.45 17.5 3 17.05 3 16.5V9.5Z" fill="#c9872b" stroke="#8b4d0f" strokeWidth="1.2" />
    </svg>
  );
}

function YinYangNavIcon() {
  return (
    <svg className="qtv-nav-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="#f7e7be" stroke="#f5d27b" strokeWidth="1.2" />
      <path d="M10 2A8 8 0 0 1 10 18A4 4 0 0 1 10 10A4 4 0 0 0 10 2Z" fill="#5e0c0d" />
      <circle cx="10" cy="6" r="1.4" fill="#5e0c0d" />
      <circle cx="10" cy="14" r="1.4" fill="#f7e7be" />
    </svg>
  );
}

function TempleNavIcon() {
  return (
    <svg className="qtv-nav-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2.5 8.5L10 3.5L17.5 8.5H2.5Z" fill="#f5d27b" stroke="#e4b756" strokeWidth="1" />
      <path d="M4.5 8.5V15.5M8.2 8.5V15.5M11.8 8.5V15.5M15.5 8.5V15.5M2.5 16.5H17.5" stroke="#fce4a6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ZodiacNavIcon() {
  return (
    <svg className="qtv-nav-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="#f5d27b" strokeWidth="1.5" />
      <path d="M6.5 13C6.5 9.5 13.5 10.5 13.5 7C13.5 5.4 11.8 4.5 10 4.5C8.3 4.5 7 5.5 7 6.8" stroke="#ffe598" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12.5" cy="13.5" r="1.3" fill="#ffe598" />
    </svg>
  );
}

function ContactNavIcon() {
  return (
    <svg className="qtv-nav-svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.8 3.5H7.6L8.9 6.8L7.1 8.1C7.9 9.8 9.2 11.1 10.9 11.9L12.2 10.1L15.5 11.4V14.2C15.5 15.2 14.7 16 13.7 16C8.1 15.6 3.9 11.4 3.5 5.8C3.5 4.5 4 3.5 4.8 3.5Z" fill="#f5d27b" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isGroupActive = (paths) => paths.some((p) => {
    if (p === '/') return location.pathname === '/' || location.pathname === '/bai-viet' || location.pathname === '/ket-qua';
    return location.pathname === p || location.pathname.startsWith(`${p}/`);
  });

  const navItems = [
    {
      to: '/',
      label: 'Trang chủ',
      icon: <HomeNavIcon />,
      active: isGroupActive(['/']),
    },
    {
      to: '/xem-tu-vi',
      label: 'Lập lá số Tử Vi',
      icon: <YinYangNavIcon />,
      active: isGroupActive(['/xem-tu-vi', '/la-so']),
    },
    {
      to: '/kien-thuc',
      label: 'Phong thủy',
      icon: <TempleNavIcon />,
      active: isGroupActive(['/kien-thuc', '/huong-dan']),
    },
    {
      to: '/horoscope',
      label: '12 Con Giáp',
      icon: <ZodiacNavIcon />,
      active: isGroupActive(['/horoscope']),
    },
    {
      to: '/lien-he',
      label: 'Liên hệ',
      icon: <ContactNavIcon />,
      active: isGroupActive(['/lien-he']),
    },
  ];

  return (
    <>
      <header className="qtv-header" id="main-header">
        <div className="qtv-header-inner">
          {/* Main 5 Navigation Links matching mockup */}
          <nav className={`qtv-nav ${menuOpen ? 'open' : ''}`} id="nav-menu" aria-label="Điều hướng chính">
            {navItems.map((item, idx) => (
              <div key={item.to} className="qtv-nav-entry">
                {idx > 0 && <span className="qtv-nav-sep" aria-hidden="true">|</span>}
                <Link
                  to={item.to}
                  className={`qtv-nav-link ${item.active ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}

            {/* Mobile Auth Section inside Drawer */}
            {isAuthenticated && (
              <div className="qtv-nav-mobile-auth">
                <div className="qtv-mobile-user-info">
                  <span>{user?.hoTen || user?.email || 'Thành viên'}</span>
                  {isAdmin && <span className="qtv-admin-pill">Admin</span>}
                </div>
                <Link to="/lich-su" className="qtv-mobile-btn">Lịch sử lá số</Link>
                <button type="button" className="qtv-mobile-btn qtv-mobile-btn-logout" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </nav>

          {/* Compact Auth Controls on Top Right when logged in */}
          {isAuthenticated && (
            <div className="qtv-header-auth">
              <div className="qtv-user-chip">
                {isAdmin && <span className="qtv-admin-pill">Admin</span>}
                <Link to="/lich-su" className="qtv-auth-user-name" title="Xem lịch sử lá số">
                  {user?.hoTen || 'Tài khoản'}
                </Link>
                <button type="button" onClick={handleLogout} className="qtv-auth-mini-btn">
                  Thoát
                </button>
              </div>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={`qtv-mobile-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Mở menu"
            id="mobile-menu-toggle"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Banner Quán Tử Vi hiển thị ngay dưới thanh menu trên mọi trang */}
      <HomeBanner />
    </>
  );
}

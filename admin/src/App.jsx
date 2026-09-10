import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate, NavLink, useLocation
} from 'react-router-dom';
import MasterProfileCMS    from './pages/MasterProfileCMS';
import InterpretationCMS   from './pages/InterpretationCMS';
import Dashboard            from './pages/Dashboard';
import Login                from './pages/Login';
import FacebookImportCMS   from './pages/FacebookImportCMS';
import LapLaSoCMS          from './pages/LapLaSoCMS';
import UsersCMS             from './pages/UsersCMS';
import {
  LayoutDashboard, Users, BookOpen, LogOut,
  Facebook, Star, UserCog, Bell, ChevronRight,
  Menu, X, Sparkles,
} from 'lucide-react';
import './App.css';

/* ── Protected Route ── */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

/* ── Page Titles ── */
const PAGE_TITLES = {
  '/dashboard':       { title: 'Bảng Điều Khiển', icon: '📊' },
  '/facebook-import': { title: 'Kéo Bài Facebook',  icon: '📰' },
  '/lap-la-so':       { title: 'Lập Lá Số',          icon: '🔮' },
  '/masters':         { title: 'Quản lý Chuyên gia', icon: '🧙' },
  '/interpretations': { title: 'Quản lý Luận giải',  icon: '📚' },
  '/users':           { title: 'Quản lý Người dùng', icon: '👥' },
};

/* ── Nav Groups ── */
const NAV_GROUPS = [
  {
    label: 'Tổng Quan',
    items: [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Bảng Điều Khiển' },
    ],
  },
  {
    label: 'Nội Dung',
    items: [
      { to: '/facebook-import', icon: <Facebook size={18} />,  label: 'Kéo Bài Facebook' },
      { to: '/lap-la-so',       icon: <Star size={18} />,       label: 'Lập Lá Số' },
      { to: '/masters',         icon: <UserCog size={18} />,    label: 'Quản lý Chuyên gia' },
      { to: '/interpretations', icon: <BookOpen size={18} />,   label: 'Quản lý Luận giải' },
    ],
  },
  {
    label: 'Quản Trị',
    items: [
      { to: '/users', icon: <Users size={18} />, label: 'Quản lý Người dùng' },
    ],
  },
];

/* ════════════════════
   HEADER BAR
   ════════════════════ */
function HeaderBar({ onMenuToggle, sidebarOpen }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const info = PAGE_TITLES[location.pathname];
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="admin-header">
      {/* Mobile toggle */}
      <button className="admin-header__menu-btn" onClick={onMenuToggle}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Breadcrumb */}
      <div className="admin-header__breadcrumb">
        <span className="admin-header__brand">TuVi CMS</span>
        <ChevronRight size={14} className="admin-header__chevron" />
        <span className="admin-header__page">
          {info?.icon} {info?.title || 'Admin'}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Date/time */}
      <div className="admin-header__datetime">
        <span className="admin-header__date">
          {time.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
        <span className="admin-header__time">
          {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Notifications */}
      <div className="admin-header__notif tooltip-wrap" data-tip="Thông báo">
        <Bell size={18} />
        <span className="admin-header__notif-dot">3</span>
      </div>

      {/* Avatar */}
      <div className="admin-header__avatar-wrap">
        <div className="admin-header__avatar">
          {(user.hoTen || user.email || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="admin-header__avatar-info">
          <span className="admin-header__avatar-name">{user.hoTen || 'Admin'}</span>
          <span className="admin-header__avatar-role">Quản trị viên</span>
        </div>
      </div>
    </header>
  );
}

/* ════════════════════
   SIDEBAR
   ════════════════════ */
function Sidebar({ open }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`}>
      {/* ── Logo ── */}
      <div className="admin-sidebar__logo">
        <div className="admin-sidebar__logo-icon">
          <Sparkles size={22} color="#c5a059" />
        </div>
        <div>
          <div className="admin-sidebar__logo-name">TuVi Admin</div>
          <div className="admin-sidebar__logo-ver">v2.0 CMS</div>
        </div>
      </div>

      {/* ── User Info ── */}
      <div className="admin-sidebar__user">
        <div className="admin-sidebar__user-avatar">
          {(user.hoTen || user.email || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="admin-sidebar__user-info">
          <div className="admin-sidebar__user-name">{user.hoTen || 'Admin'}</div>
          <div className="admin-sidebar__user-email">{user.email}</div>
        </div>
        <div className="admin-sidebar__user-badge">Admin</div>
      </div>

      {/* ── Nav ── */}
      <nav className="admin-sidebar__nav">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="admin-sidebar__nav-group">
            <div className="admin-sidebar__nav-label">{group.label}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="admin-sidebar__footer">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={18} className="nav-icon" />
          <span>Đăng xuất</span>
        </button>
        <div className="admin-sidebar__footer-ver">© 2026 TuVi Platform</div>
      </div>
    </aside>
  );
}

/* ════════════════════
   ADMIN LAYOUT
   ════════════════════ */
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Close sidebar on mobile nav
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`admin-layout ${sidebarOpen ? 'admin-layout--sidebar-open' : ''}`}>
      <Sidebar open={sidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-layout__main">
        <HeaderBar
          onMenuToggle={() => setSidebarOpen(o => !o)}
          sidebarOpen={sidebarOpen}
        />
        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ════════════════════
   APP ROUTER
   ════════════════════ */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {[
          ['/dashboard',       <Dashboard />],
          ['/masters',         <MasterProfileCMS />],
          ['/interpretations', <InterpretationCMS />],
          ['/facebook-import', <FacebookImportCMS />],
          ['/lap-la-so',       <LapLaSoCMS />],
          ['/users',           <UsersCMS />],
        ].map(([path, element]) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <AdminLayout>{element}</AdminLayout>
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

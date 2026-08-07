import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import MasterProfileCMS from './pages/MasterProfileCMS';
import InterpretationCMS from './pages/InterpretationCMS';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FacebookImportCMS from './pages/FacebookImportCMS';
import LapLaSoCMS from './pages/LapLaSoCMS';
import UsersCMS from './pages/UsersCMS';
import { LayoutDashboard, Users, BookOpen, LogOut, Facebook, Star, UserCog } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

const AdminLayout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const groupLabel = (text) => (
    <div style={{
      fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase',
      letterSpacing: '1px', padding: '0.8rem 1rem 0.3rem', marginTop: '0.3rem'
    }}>
      {text}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <aside style={{
        width: '280px', backgroundColor: '#1a1a2e',
        borderRight: '1px solid rgba(197, 160, 89, 0.2)',
        padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '2.5rem', padding: '0 1rem' }}>
          <h2 style={{ color: '#c5a059', fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '1px' }}>TuVi Admin</h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Hệ thống quản trị v1.0</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {groupLabel('Tổng Quan')}
          <NavLink to="/dashboard" className="nav-link">
            <LayoutDashboard size={20} /> <span>Bảng Điều Khiển</span>
          </NavLink>

          {groupLabel('Nội Dung')}
          <NavLink to="/facebook-import" className="nav-link">
            <Facebook size={20} /> <span>Kéo Bài Facebook</span>
          </NavLink>
          <NavLink to="/lap-la-so" className="nav-link">
            <Star size={20} /> <span>Lập Lá Số</span>
          </NavLink>
          <NavLink to="/masters" className="nav-link">
            <UserCog size={20} /> <span>Quản lý Chuyên gia</span>
          </NavLink>
          <NavLink to="/interpretations" className="nav-link">
            <BookOpen size={20} /> <span>Quản lý Luận giải</span>
          </NavLink>

          {groupLabel('Quản Trị')}
          <NavLink to="/users" className="nav-link">
            <Users size={20} /> <span>Quản lý Người dùng</span>
          </NavLink>

          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(197, 160, 89, 0.1)' }}>
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <LogOut size={20} /> <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/masters" element={<ProtectedRoute><AdminLayout><MasterProfileCMS /></AdminLayout></ProtectedRoute>} />
        <Route path="/interpretations" element={<ProtectedRoute><AdminLayout><InterpretationCMS /></AdminLayout></ProtectedRoute>} />
        <Route path="/facebook-import" element={<ProtectedRoute><AdminLayout><FacebookImportCMS /></AdminLayout></ProtectedRoute>} />
        <Route path="/lap-la-so" element={<ProtectedRoute><AdminLayout><LapLaSoCMS /></AdminLayout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><AdminLayout><UsersCMS /></AdminLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

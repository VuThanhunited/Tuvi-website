import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * ProtectedRoute - Bảo vệ route theo role
 * 
 * @param {React.ReactNode} children - Component cần bảo vệ
 * @param {string[]} roles - Mảng role được phép (vd: ['admin', 'master'])
 * @param {boolean} requireAuth - Yêu cầu đăng nhập (default: true)
 */
export default function ProtectedRoute({ children, roles = [], requireAuth = true }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontSize: '1.1rem',
        color: '#888',
      }}>
        <div className="loading-spinner">
          <span>🔮</span> Đang xác thực...
        </div>
      </div>
    );
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  // Role check
  if (roles.length > 0 && (!user || !roles.includes(user.role))) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <h2 style={{ color: '#c0392b', marginBottom: '1rem' }}>⛔ Không có quyền truy cập</h2>
        <p style={{ color: '#666', maxWidth: '400px' }}>
          Bạn không có quyền truy cập trang này. 
          Vui lòng liên hệ Admin để được nâng cấp tài khoản.
        </p>
        <button 
          onClick={() => window.history.back()} 
          style={{
            marginTop: '1.5rem',
            padding: '0.6rem 2rem',
            background: '#8b0000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  return children;
}

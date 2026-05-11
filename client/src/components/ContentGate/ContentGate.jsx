import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';
import './ContentGate.css';

/**
 * ContentGate - Wrapper component để ẩn/hiển thị nội dung theo role
 * @param {React.ReactNode} children - Nội dung cần bảo vệ
 * @param {string} requireRole - 'user' (cần đăng nhập) hoặc 'master' (cần trả phí/VIP)
 * @param {string} title - Tiêu đề hiển thị trên hộp thoại yêu cầu nâng cấp
 * @param {string} message - Tin nhắn khuyến khích
 */
export default function ContentGate({ children, requireRole = 'user', title, message }) {
  const { isAuthenticated, isMaster, isAdmin } = useAuth();
  const location = useLocation();

  let hasAccess = false;
  if (requireRole === 'user') {
    hasAccess = isAuthenticated;
  } else if (requireRole === 'master') {
    hasAccess = isMaster || isAdmin;
  }

  if (hasAccess) {
    return <div className="content-gate-unlocked">{children}</div>;
  }

  return (
    <div className="content-gate-locked">
      <div className="content-gate-blurred">
        {children}
      </div>
      <div className="content-gate-overlay">
        <div className="content-gate-prompt">
          <div className="prompt-icon">🔒</div>
          <h3 className="prompt-title">{title || 'Nội dung bị khóa'}</h3>
          <p className="prompt-message">
            {message || (requireRole === 'user' 
              ? 'Vui lòng đăng nhập để xem chi tiết nội dung này. Hoàn toàn miễn phí!' 
              : 'Nội dung này dành riêng cho tài khoản VIP/Thầy Xem.')}
          </p>
          <div className="prompt-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/dang-nhap" state={{ from: location }} className="btn btn-primary">
                  🔐 Đăng Nhập
                </Link>
                <Link to="/dang-ky" className="btn btn-outline">
                  ✨ Đăng Ký
                </Link>
              </>
            ) : (
              <Link to="/nang-cap" className="btn btn-primary" style={{ background: '#d4af37', color: '#000' }}>
                ⭐ Nâng Cấp Tài Khoản
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

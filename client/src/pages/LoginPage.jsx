import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') {
        navigate('/admin/interpretations', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-premium">
      {/* Animated background */}
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
        <div className="auth-orb auth-orb--3" />
      </div>

      <div className="auth-card-premium">
        {/* Top accent line */}
        <div className="auth-card-accent" />

        {/* Logo / Icon */}
        <div className="auth-logo-section">
          <div className="auth-logo-icon">
            <span className="auth-logo-symbol">☯</span>
          </div>
          <h1 className="auth-title">Đăng Nhập</h1>
          <p className="auth-subtitle">Chào mừng trở lại! Đăng nhập để lưu lịch sử và trải nghiệm đầy đủ.</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error-box">
            <span className="auth-error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">📧</span> Email
            </label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                className="auth-input"
                placeholder="Nhập email của bạn"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">🔑</span> Mật khẩu
            </label>
            <div className="auth-input-wrapper auth-input-wrapper--password">
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="auth-forgot-row">
            <Link to="/quen-mat-khau" className="auth-forgot-link">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner-row">
                <span className="auth-spinner" />
                Đang đăng nhập...
              </span>
            ) : (
              <>🔐 Đăng Nhập</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        {/* Social hints */}
        <div className="auth-social-row">
          <button className="auth-social-btn" disabled title="Sắp ra mắt">
            <span>G</span> Google
          </button>
          <button className="auth-social-btn" disabled title="Sắp ra mắt">
            <span>f</span> Facebook
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer-text">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="auth-footer-link">Đăng ký ngay →</Link>
        </div>
      </div>
    </div>
  );
}

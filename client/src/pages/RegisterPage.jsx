import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './AuthPages.css';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Yếu', color: '#ef4444' };
  if (score <= 2) return { score, label: 'Trung bình', color: '#f59e0b' };
  if (score <= 3) return { score, label: 'Khá', color: '#3b82f6' };
  return { score, label: 'Mạnh', color: '#10b981' };
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    hoTen: '', email: '', password: '', confirm: '', gioiTinh: 'nam'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const strength = getPasswordStrength(form.password);
  const confirmMatch = form.confirm && form.password === form.confirm;
  const confirmMismatch = form.confirm && form.password !== form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    try {
      await register({
        hoTen: form.hoTen,
        email: form.email,
        password: form.password,
        gioiTinh: form.gioiTinh,
      });
      navigate('/', { replace: true });
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

      <div className="auth-card-premium auth-card-premium--register">
        <div className="auth-card-accent" />

        <div className="auth-logo-section">
          <div className="auth-logo-icon">
            <span className="auth-logo-symbol">✨</span>
          </div>
          <h1 className="auth-title">Đăng Ký</h1>
          <p className="auth-subtitle">Tạo tài khoản để lưu lịch sử và khám phá vận mệnh của bạn.</p>
        </div>

        {error && (
          <div className="auth-error-box">
            <span className="auth-error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Họ Tên */}
          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">👤</span> Họ và Tên
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                className="auth-input"
                placeholder="Nhập họ tên đầy đủ"
                value={form.hoTen}
                onChange={e => setForm({ ...form, hoTen: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">📧</span> Email
            </label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                className="auth-input"
                placeholder="Nhập địa chỉ email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Giới tính */}
          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">⚧</span> Giới tính
            </label>
            <div className="auth-gender-row">
              {[{ val: 'nam', label: '♂ Nam', icon: '👨' }, { val: 'nu', label: '♀ Nữ', icon: '👩' }].map(g => (
                <button
                  key={g.val}
                  type="button"
                  className={`auth-gender-btn ${form.gioiTinh === g.val ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, gioiTinh: g.val })}
                  disabled={loading}
                >
                  <span>{g.icon}</span> {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">🔑</span> Mật khẩu
            </label>
            <div className="auth-input-wrapper auth-input-wrapper--password">
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="auth-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div className="auth-strength-bar">
                <div className="auth-strength-track">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="auth-strength-segment"
                      style={{
                        backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                </div>
                <span className="auth-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="auth-form-group">
            <label className="auth-label">
              <span className="auth-label-icon">🔒</span> Xác nhận mật khẩu
            </label>
            <div className={`auth-input-wrapper auth-input-wrapper--password ${confirmMatch ? 'match' : ''} ${confirmMismatch ? 'mismatch' : ''}`}>
              <input
                type={showConfirm ? 'text' : 'password'}
                className="auth-input"
                placeholder="Nhập lại mật khẩu"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="auth-eye-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmMatch && <p className="auth-hint auth-hint--success">✓ Mật khẩu khớp</p>}
            {confirmMismatch && <p className="auth-hint auth-hint--error">✕ Mật khẩu không khớp</p>}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner-row">
                <span className="auth-spinner" />
                Đang đăng ký...
              </span>
            ) : (
              <>✨ Tạo Tài Khoản</>
            )}
          </button>
        </form>

        <div className="auth-footer-text">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="auth-footer-link">Đăng nhập →</Link>
        </div>
      </div>
    </div>
  );
}

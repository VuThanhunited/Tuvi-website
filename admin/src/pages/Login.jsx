import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        const { accessToken, user } = res.data.data;
        if (user.role !== 'admin') {
          setError('Tài khoản này không có quyền truy cập quản trị.');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-orb login-orb--1" />
        <div className="login-orb login-orb--2" />
        <div className="login-orb login-orb--3" />
        <div className="login-grid" />
      </div>

      <div className="login-card scale-in">
        {/* Top shimmer line */}
        <div className="login-card__shimmer" />

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__icon">
            <Shield size={28} color="#c5a059" strokeWidth={1.5} />
          </div>
          <div className="login-logo__badge">ADMIN</div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h1 className="login-heading__title">TuVi CMS</h1>
          <p className="login-heading__sub">Hệ thống quản trị nội dung tử vi</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error login-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email quản trị</label>
            <div className="login-input-wrap">
              <User size={16} className="login-input-icon" />
              <input
                type="email"
                className="form-control login-input"
                placeholder="admin@tuvi.vn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control login-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-gold btn-lg login-submit ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                <Shield size={18} />
                Đăng nhập hệ thống
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <div className="login-footer__divider" />
          <p className="login-footer__copy">
            © {new Date().getFullYear()} TuVi Web Platform
          </p>
          <p className="login-footer__note">Chỉ dành cho quản trị viên có thẩm quyền</p>
        </div>
      </div>
    </div>
  );
}

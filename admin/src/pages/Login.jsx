import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        const { token, user } = res.data.data;
        
        // Kiểm tra xem có phải admin không
        if (user.role !== 'admin') {
          setError('Tài khoản này không có quyền truy cập quản trị.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', token);
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
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={logoIconStyle}>
            <Shield size={32} color="#c5a059" />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>TuVi CMS Login</h1>
          <p style={{ color: '#94a3b8' }}>Hệ thống quản trị nội dung tử vi</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email quản trị</label>
            <div style={inputWrapperStyle}>
              <User size={18} color="#94a3b8" style={inputIconStyle} />
              <input 
                type="email" 
                placeholder="admin@tuvi.vn"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Mật khẩu</label>
            <div style={inputWrapperStyle}>
              <Lock size={18} color="#94a3b8" style={inputIconStyle} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={eyeBtnStyle}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={loginBtnStyle}
            disabled={loading}
          >
            {loading ? <Loader2 className="spin" size={20} /> : 'Đăng nhập hệ thống'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            &copy; 2026 TuVi Web Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0f172a',
  backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
  fontFamily: "'Inter', sans-serif"
};

const loginBoxStyle = {
  width: '100%',
  maxWidth: '420px',
  padding: '3rem',
  backgroundColor: '#1a1a2e',
  borderRadius: '24px',
  border: '1px solid rgba(197, 160, 89, 0.2)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const logoIconStyle = {
  width: '64px',
  height: '64px',
  backgroundColor: 'rgba(197, 160, 89, 0.1)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem',
  border: '1px solid rgba(197, 160, 89, 0.2)'
};

const inputGroupStyle = {
  marginBottom: '1.5rem'
};

const labelStyle = {
  display: 'block',
  color: '#94a3b8',
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
  fontWeight: '500'
};

const inputWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const inputIconStyle = {
  position: 'absolute',
  left: '1rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1rem 0.8rem 3rem',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(197, 160, 89, 0.2)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.3s'
};

const eyeBtnStyle = {
  position: 'absolute',
  right: '1rem',
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer'
};

const loginBtnStyle = {
  width: '100%',
  padding: '0.9rem',
  backgroundColor: '#c5a059',
  color: '#1a1a2e',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'all 0.3s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const errorStyle = {
  padding: '1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#ef4444',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
  textAlign: 'center'
};

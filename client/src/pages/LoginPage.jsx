import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './StaticPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect
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
      // Redirect admin to dashboard, others to previous page
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☯</div>
          <h1>Đăng Nhập</h1>
          <p>Đăng nhập để lưu lịch sử và trải nghiệm đầy đủ</p>
        </div>

        {error && (
          <div className="auth-error" style={{
            background: '#ffeaea',
            color: '#c0392b',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Nhập email của bạn" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Nhập mật khẩu" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🔐 Đăng Nhập'}
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './StaticPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ hoTen: '', email: '', password: '', confirm: '', gioiTinh: 'nam' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☯</div>
          <h1>Đăng Ký</h1>
          <p>Tạo tài khoản để lưu lịch sử xem tử vi</p>
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
            <label className="form-label">Họ Tên</label>
            <input type="text" className="form-input" placeholder="Nhập họ tên" value={form.hoTen} onChange={e => setForm({...form, hoTen: e.target.value})} required disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="Nhập email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <select className="form-input" value={form.gioiTinh} onChange={e => setForm({...form, gioiTinh: e.target.value})} disabled={loading}>
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-input" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input type="password" className="form-input" placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required disabled={loading} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⏳ Đang đăng ký...' : '✨ Đăng Ký'}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

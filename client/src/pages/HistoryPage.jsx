import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './StaticPages.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NGU_HANH_COLORS = {
  'Kim': '#C0C0C0', 'Thủy': '#1E90FF', 'Hỏa': '#FF4500',
  'Thổ': '#DAA520', 'Mộc': '#2E8B57',
};

export default function HistoryPage() {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tuvi/history?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Không thể tải lịch sử. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa lá số này?')) return;
    try {
      const res = await fetch(`${API_URL}/tuvi/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setResults(prev => prev.filter(r => r._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch {
      alert('Xóa thất bại');
    }
  };

  useEffect(() => { fetchHistory(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>📜 Lịch Sử Lá Số Tử Vi</h1>
          <p>Xem lại những lần tính tử vi trước đây của bạn ({pagination.total} kết quả)</p>
        </div>

        {loading ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#888' }}>Đang tải lịch sử...</p>
          </div>
        ) : error ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '2rem', color: '#c0392b' }}>
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="content-card">
            <div className="history-empty">
              <div className="history-empty-icon">📭</div>
              <h3>Chưa có lịch sử tính toán</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                Hãy tạo lá số tử vi đầu tiên của bạn ngay!
              </p>
              <Link to="/xem-tu-vi" className="btn btn-primary">✨ Xem Tử Vi Ngay</Link>
            </div>
          </div>
        ) : (
          <>
            {/* History List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.map((r) => (
                <div key={r._id} className="content-card" style={{
                  padding: '1.2rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  transition: 'box-shadow 0.2s',
                }}>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{r.conGiap?.emoji || '☯'}</span>
                      <strong style={{ fontSize: '1.05rem' }}>{r.hoTen}</strong>
                      <span style={{
                        background: NGU_HANH_COLORS[r.nguHanh] || '#d4af37',
                        color: '#fff',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {r.nguHanh}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {r.canChi} • {r.gioiTinh === 'nam' ? 'Nam' : 'Nữ'} • 
                      Sinh: {r.ngaySinh}/{r.thangSinh}/{r.namSinh} • 
                      Giờ {r.gioChiName}
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{
                      fontSize: '1.5rem', fontWeight: 700,
                      color: r.overallRating >= 4 ? '#27ae60' : r.overallRating >= 3 ? '#f39c12' : '#e74c3c',
                    }}>
                      {r.overallRating}/5
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Điểm tổng</div>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: 'center', minWidth: '120px', fontSize: '0.82rem', color: '#888' }}>
                    {formatDate(r.createdAt)}
                    <div style={{ color: '#bbb', fontSize: '0.72rem' }}>
                      Xem: {r.viewCount || 1} lần
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      to={`/ket-qua?id=${r._id}`}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
                    >
                      🔮 Xem
                    </Link>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', color: '#c0392b', borderColor: '#c0392b' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', gap: '0.5rem',
                marginTop: '2rem', flexWrap: 'wrap',
              }}>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchHistory(i + 1)}
                    className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '40px' }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/xem-tu-vi" className="btn btn-primary">✨ Lập Lá Số Mới</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

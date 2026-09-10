import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './HistoryPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

const NGU_HANH_CONFIG = {
  'Kim':  { color: '#C0C0C0', bg: 'rgba(192,192,192,0.12)', icon: '⚔️' },
  'Thủy': { color: '#1E90FF', bg: 'rgba(30,144,255,0.12)',  icon: '💧' },
  'Hỏa':  { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)',  icon: '🔥' },
  'Thổ':  { color: '#DAA520', bg: 'rgba(218,165,32,0.12)',  icon: '🌍' },
  'Mộc':  { color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  icon: '🌿' },
};

const RATING_COLORS = { 5: '#10b981', 4: '#22c55e', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };

function StarRating({ value }) {
  return (
    <div className="hist-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`hist-star ${i <= value ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | rating
  const [deletingId, setDeletingId] = useState(null);

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
    setDeletingId(id);
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
    } finally {
      setDeletingId(null);
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

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...results];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => r.hoTen?.toLowerCase().includes(q));
    }
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'rating') list.sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
    return list;
  }, [results, search, sortBy]);

  return (
    <div className="hist-page">
      <div className="hist-container">
        {/* Header */}
        <div className="hist-header">
          <div className="hist-header-icon">📜</div>
          <div>
            <h1 className="hist-title">Lịch Sử Lá Số Tử Vi</h1>
            <p className="hist-subtitle">
              Xem lại những lần tính tử vi trước đây của bạn
              {pagination.total > 0 && <span className="hist-count-badge">{pagination.total} lá số</span>}
            </p>
          </div>
        </div>

        {/* Controls */}
        {!loading && !error && results.length > 0 && (
          <div className="hist-controls">
            <div className="hist-search-box">
              <span className="hist-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="hist-search-input"
              />
              {search && (
                <button className="hist-search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
            <div className="hist-sort-tabs">
              {[
                { val: 'newest', label: '🕐 Mới nhất' },
                { val: 'oldest', label: '📅 Cũ nhất' },
                { val: 'rating', label: '⭐ Điểm cao' },
              ].map(s => (
                <button
                  key={s.val}
                  className={`hist-sort-tab ${sortBy === s.val ? 'active' : ''}`}
                  onClick={() => setSortBy(s.val)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="hist-skeleton-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="hist-skeleton-card">
                <div className="hist-skeleton-avatar" />
                <div className="hist-skeleton-body">
                  <div className="hist-skeleton-line hist-skeleton-line--wide" />
                  <div className="hist-skeleton-line hist-skeleton-line--medium" />
                  <div className="hist-skeleton-line hist-skeleton-line--narrow" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="hist-error-card">
            <div className="hist-error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => fetchHistory()} className="hist-retry-btn">🔄 Thử lại</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="hist-empty-card">
            <div className="hist-empty-icon">
              {search ? '🔍' : '📭'}
            </div>
            <h3>{search ? `Không tìm thấy lá số nào khớp với "${search}"` : 'Chưa có lịch sử tính toán'}</h3>
            <p>{search ? 'Thử tìm với từ khóa khác.' : 'Hãy tạo lá số tử vi đầu tiên của bạn ngay!'}</p>
            {!search && (
              <Link to="/xem-tu-vi" className="hist-cta-btn">✨ Xem Tử Vi Ngay</Link>
            )}
          </div>
        ) : (
          <>
            <div className="hist-list">
              {filtered.map((r, idx) => {
                const nguHanh = NGU_HANH_CONFIG[r.nguHanh] || { color: '#d4af37', bg: 'rgba(212,175,55,0.12)', icon: '☯' };
                const isDeleting = deletingId === r._id;
                return (
                  <div
                    key={r._id}
                    className={`hist-card ${isDeleting ? 'hist-card--deleting' : ''}`}
                    style={{ '--accent-color': nguHanh.color }}
                  >
                    {/* Left accent bar */}
                    <div className="hist-card-accent" style={{ background: nguHanh.color }} />

                    {/* Avatar */}
                    <div
                      className="hist-card-avatar"
                      style={{ background: nguHanh.bg, borderColor: nguHanh.color + '40' }}
                    >
                      <span className="hist-avatar-emoji">{r.conGiap?.emoji || nguHanh.icon}</span>
                      <span className="hist-avatar-num">#{idx + 1}</span>
                    </div>

                    {/* Main Info */}
                    <div className="hist-card-body">
                      <div className="hist-card-top">
                        <div>
                          <h3 className="hist-card-name">{r.hoTen}</h3>
                          <div className="hist-card-meta">
                            <span className="hist-tag" style={{ color: nguHanh.color, background: nguHanh.bg }}>
                              {nguHanh.icon} {r.nguHanh}
                            </span>
                            <span className="hist-tag hist-tag--neutral">
                              {r.canChi}
                            </span>
                            <span className="hist-tag hist-tag--neutral">
                              {r.gioiTinh === 'nam' ? '♂' : '♀'} {r.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}
                            </span>
                          </div>
                        </div>
                        <div className="hist-card-rating">
                          <div className="hist-rating-num" style={{ color: RATING_COLORS[r.overallRating] || '#d4af37' }}>
                            {r.overallRating}/5
                          </div>
                          <StarRating value={r.overallRating} />
                        </div>
                      </div>

                      <div className="hist-card-detail">
                        <span>📅 Sinh: {r.ngaySinh}/{r.thangSinh}/{r.namSinh}</span>
                        <span>⏰ Giờ {r.gioChiName}</span>
                        <span>👁 Xem {r.viewCount || 1} lần</span>
                      </div>

                      <div className="hist-card-footer">
                        <span className="hist-card-date">🕐 {formatDate(r.createdAt)}</span>
                        <div className="hist-card-actions">
                          <Link
                            to={`/ket-qua?id=${r._id}`}
                            className="hist-btn hist-btn--primary"
                          >
                            🔮 Xem lại
                          </Link>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="hist-btn hist-btn--danger"
                            disabled={isDeleting}
                          >
                            {isDeleting ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="hist-pagination">
                <button
                  className="hist-page-btn hist-page-btn--nav"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchHistory(pagination.page - 1)}
                >
                  ← Trước
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`hist-page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                    onClick={() => fetchHistory(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="hist-page-btn hist-page-btn--nav"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchHistory(pagination.page + 1)}
                >
                  Sau →
                </button>
              </div>
            )}

            {/* CTA */}
            <div className="hist-cta-row">
              <Link to="/xem-tu-vi" className="hist-cta-btn">✨ Lập Lá Số Mới</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

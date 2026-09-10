import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast/Toast.jsx';
import { useFavorites } from '../contexts/FavoritesContext.jsx';
import './FavoritesPage.css';

const CATEGORY_ICONS = {
  'Tử Vi & Cuộc Sống': '☀️',
  'Phong Thủy Ứng Dụng': '🏯',
  'Tarot Thông Điệp': '🃏',
  'Phong Thủy': '🏮',
};

export default function FavoritesPage() {
  const { favorites, loading, error, fetchFavorites, removeFavorite } = useFavorites();
  const { error: showError, success: showSuccess } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      await fetchFavorites();
    } catch (err) {
      showError(err.message || 'Không thể tải bài viết yêu thích');
    }
  };

  const handleRemove = async (favoriteId) => {
    setRemovingId(favoriteId);
    try {
      await removeFavorite(favoriteId);
      showSuccess('Đã xóa khỏi yêu thích');
    } catch {
      showError('Không thể xóa bài viết');
    } finally {
      setRemovingId(null);
    }
  };

  // All unique categories
  const categories = useMemo(() => {
    if (!favorites) return [];
    const cats = [...new Set(favorites.map(f => f.category).filter(Boolean))];
    return cats;
  }, [favorites]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    if (!favorites) return [];
    let list = [...favorites];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.title?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      list = list.filter(f => f.category === selectedCategory);
    }
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'az') list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'vi'));
    return list;
  }, [favorites, search, selectedCategory, sortBy]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="fav-skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="fav-skeleton-card">
              <div className="fav-skeleton-img" />
              <div className="fav-skeleton-body">
                <div className="fav-skeleton-line fav-skeleton-line--wide" />
                <div className="fav-skeleton-line fav-skeleton-line--medium" />
                <div className="fav-skeleton-line fav-skeleton-line--narrow" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="fav-error-card">
          <div className="fav-error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={loadFavorites} className="fav-retry-btn">🔄 Thử Lại</button>
        </div>
      );
    }

    if (!favorites || favorites.length === 0) {
      return (
        <div className="fav-empty-state">
          <div className="fav-empty-icon">💝</div>
          <h3>Chưa có bài viết yêu thích</h3>
          <p>Hãy khám phá các bài viết và nhấn nút ❤️ để lưu lại.</p>
          <Link to="/kien-thuc" className="fav-cta-btn">📖 Khám Phá Kiến Thức</Link>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="fav-empty-state fav-empty-state--search">
          <div className="fav-empty-icon">🔍</div>
          <h3>Không tìm thấy kết quả</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          <button
            className="fav-cta-btn"
            onClick={() => { setSearch(''); setSelectedCategory('all'); }}
          >
            Xóa Bộ Lọc
          </button>
        </div>
      );
    }

    return (
      <div className="fav-grid">
        {filtered.map(fav => (
          <div
            key={fav._id}
            className={`fav-card ${removingId === fav._id ? 'fav-card--removing' : ''}`}
          >
            {/* Thumbnail */}
            <div className="fav-card-img-wrap">
              {fav.thumbnail ? (
                <img src={fav.thumbnail} alt={fav.title} className="fav-card-img" />
              ) : (
                <div className="fav-card-img-placeholder">
                  <span>{CATEGORY_ICONS[fav.category] || '📖'}</span>
                </div>
              )}
              {fav.category && (
                <div className="fav-card-cat-badge">
                  {CATEGORY_ICONS[fav.category] || '📌'} {fav.category}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="fav-card-body">
              <h3 className="fav-card-title">{fav.title || 'Bài viết không có tiêu đề'}</h3>
              <p className="fav-card-date">
                ❤️ Lưu: {new Date(fav.createdAt).toLocaleDateString('vi-VN')}
              </p>
              <div className="fav-card-actions">
                <Link
                  to={`/kien-thuc#${fav.articleId?.slug || ''}`}
                  className="fav-btn fav-btn--read"
                >
                  📖 Đọc bài
                </Link>
                <button
                  onClick={() => handleRemove(fav._id)}
                  className="fav-btn fav-btn--remove"
                  disabled={removingId === fav._id}
                  title="Xóa khỏi yêu thích"
                >
                  {removingId === fav._id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fav-page">
      <div className="fav-container">
        {/* Header */}
        <div className="fav-header">
          <div className="fav-header-icon">❤️</div>
          <div>
            <h1 className="fav-title">Bài Viết Yêu Thích</h1>
            <p className="fav-subtitle">
              Các bài viết bạn đã lưu để đọc lại
              {favorites && favorites.length > 0 && (
                <span className="fav-count-badge">{favorites.length} bài</span>
              )}
            </p>
          </div>
        </div>

        {/* Controls — only show when has data */}
        {!loading && favorites && favorites.length > 0 && (
          <div className="fav-controls">
            {/* Search */}
            <div className="fav-search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="fav-search-input"
              />
              {search && (
                <button className="fav-clear-btn" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            {/* Category filter */}
            <div className="fav-filter-row">
              <button
                className={`fav-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                🌟 Tất cả
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`fav-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {CATEGORY_ICONS[cat] || '📌'} {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="fav-sort-row">
              <span className="fav-sort-label">Sắp xếp:</span>
              {[
                { val: 'newest', label: 'Mới nhất' },
                { val: 'oldest', label: 'Cũ nhất' },
                { val: 'az', label: 'A → Z' },
              ].map(s => (
                <button
                  key={s.val}
                  className={`fav-sort-btn ${sortBy === s.val ? 'active' : ''}`}
                  onClick={() => setSortBy(s.val)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}

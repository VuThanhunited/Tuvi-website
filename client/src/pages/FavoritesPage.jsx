import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast/Toast.jsx';
import { useFavorites } from '../contexts/FavoritesContext.jsx';
import './StaticPages.css';

export default function FavoritesPage() {
  const { favorites, loading, error, fetchFavorites, removeFavorite } = useFavorites();
  const { error: showError } = useToast();

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
    try {
      await removeFavorite(favoriteId);
    } catch (err) {
      showError('Không thể xóa bài viết');
    }
  };

  if (loading) {
    return (
      <div className="static-page">
        <div className="container">
          <div className="static-page-header">
            <h1>❤️ Bài Viết Yêu Thích</h1>
            <p>Các bài viết bạn đã lưu để đọc lại</p>
          </div>

          <div className="content-card">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
              <p>Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="static-page">
        <div className="container">
          <div className="static-page-header">
            <h1>❤️ Bài Viết Yêu Thích</h1>
            <p>Các bài viết bạn đã lưu để đọc lại</p>
          </div>

          <div className="content-card">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px', color: '#dc3545' }}>❌</div>
              <p style={{ color: '#dc3545', marginBottom: '20px' }}>{error}</p>
              <button
                onClick={loadFavorites}
                className="btn btn-primary"
              >
                🔄 Thử Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>❤️ Bài Viết Yêu Thích</h1>
          <p>Các bài viết bạn đã lưu để đọc lại</p>
        </div>

        <div className="content-card">
          {favorites && favorites.length > 0 ? (
            <div className="favorites-list">
              {favorites.map(favorite => (
                <div key={favorite._id} className="favorite-item">
                  {favorite.thumbnail && (
                    <img
                      src={favorite.thumbnail}
                      alt={favorite.title}
                      className="favorite-thumbnail"
                    />
                  )}
                  <div className="favorite-content">
                    <h3>{favorite.title}</h3>
                    {favorite.category && (
                      <span className="favorite-category">{favorite.category}</span>
                    )}
                    <small>Lưu lúc: {new Date(favorite.createdAt).toLocaleDateString('vi-VN')}</small>
                  </div>
                  <div className="favorite-actions">
                    <Link to={`/kien-thuc#${favorite.articleId?.slug}`} className="btn btn-sm">
                      Đọc
                    </Link>
                    <button
                      onClick={() => handleRemove(favorite._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-empty">
              <div className="history-empty-icon">💝</div>
              <h3>Chưa có bài viết yêu thích</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                Hãy khám phá các bài viết kiến thức và nhấn nút yêu thích để lưu lại.
              </p>
              <Link to="/kien-thuc" className="btn btn-primary">📖 Khám Phá Kiến Thức</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .favorites-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .favorite-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 6px;
          border-left: 4px solid #ffc107;
        }

        .favorite-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .favorite-content {
          flex: 1;
        }

        .favorite-content h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .favorite-category {
          display: inline-block;
          background: #e7f3ff;
          color: #0066cc;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .favorite-content small {
          display: block;
          color: #999;
          font-size: 12px;
        }

        .favorite-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
          white-space: nowrap;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
          .favorite-item {
            flex-direction: column;
          }

          .favorite-thumbnail {
            width: 100%;
            height: 150px;
          }

          .favorite-actions {
            width: 100%;
          }

          .favorite-actions button,
          .favorite-actions a {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

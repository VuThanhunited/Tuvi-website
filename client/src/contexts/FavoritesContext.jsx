import { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '../components/Toast/Toast.jsx';
import api from '../services/api.js';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();

  const fetchFavorites = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/favorites?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setFavorites(response.data.favorites);
        return {
          favorites: response.data.favorites,
          pagination: response.data.pagination,
        };
      }
    } catch (err) {
      const errorMsg = err.message || 'Không thể tải yêu thích';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const addFavorite = useCallback(async (articleId, type = 'article') => {
    try {
      const response = await api.post('/favorites', {
        articleId,
        type,
      });

      if (response.success && response.data) {
        setFavorites(prev => [response.data.favorite, ...prev]);
        success('Đã thêm vào yêu thích');
        return response.data.favorite;
      }
    } catch (err) {
      showError(err.message || 'Không thể thêm vào yêu thích');
      console.error('Error adding favorite:', err);
      throw err;
    }
  }, [success, showError]);

  const removeFavorite = useCallback(async (favoriteId) => {
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);

      if (response.success) {
        setFavorites(prev => prev.filter(fav => fav._id !== favoriteId));
        success('Đã xóa khỏi yêu thích');
      }
    } catch (err) {
      showError(err.message || 'Không thể xóa');
      console.error('Error removing favorite:', err);
      throw err;
    }
  }, [success, showError]);

  const checkFavorite = useCallback(async (articleId, type = 'article') => {
    try {
      const response = await api.get(`/favorites/check/${articleId}?type=${type}`);

      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Error checking favorite:', err);
      return { isFavorited: false };
    }
  }, []);

  const getFavoritesCount = useCallback(async () => {
    try {
      const response = await api.get('/favorites/count');

      if (response.success) {
        return response.data.count;
      }
    } catch (err) {
      console.error('Error getting count:', err);
      return 0;
    }
  }, []);

  const isFavorited = useCallback((articleId) => {
    return favorites.some(fav => fav.articleId._id === articleId);
  }, [favorites]);

  const value = {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    getFavoritesCount,
    isFavorited,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;

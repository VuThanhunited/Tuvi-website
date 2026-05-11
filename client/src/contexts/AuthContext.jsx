import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';
const MAX_AUTH_RETRIES = 3;
const AUTH_RETRY_DELAY = 1000;

/**
 * AuthProvider - Quản lý trạng thái đăng nhập toàn cục
 * 
 * Cung cấp:
 * - user: thông tin user hiện tại
 * - token: JWT token
 * - login/logout/register: hành động xác thực
 * - isAdmin/isMaster/isAuthenticated: kiểm tra role nhanh
 * - loading: trạng thái đang xác thực
 * - error: lỗi xác thực
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tuvi_token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('tuvi_refresh_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user from token on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchUser = useCallback(async (retryCount = 0) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      });

      if (res.status === 401) {
        // Token expired or invalid
        handleLogout();
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
      } else {
        handleLogout();
      }
    } catch (err) {
      // Retry on network errors, but not on 401
      if (retryCount < MAX_AUTH_RETRIES && err.name !== 'AbortError') {
        await delay(AUTH_RETRY_DELAY * (retryCount + 1));
        fetchUser(retryCount + 1);
      } else {
        console.error('Auth fetch failed:', err);
        setError('Không thể xác thực. Vui lòng đăng nhập lại.');
        // Don't logout on network error - user might be offline
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setError(null);
    localStorage.removeItem('tuvi_token');
    localStorage.removeItem('tuvi_refresh_token');
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      setUser(data.data.user);
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      localStorage.setItem('tuvi_token', data.data.accessToken);
      localStorage.setItem('tuvi_refresh_token', data.data.refreshToken);
      return data.data.user;
    } catch (err) {
      const errorMsg = err.message || 'Đăng nhập thất bại';
      setError(errorMsg);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      setUser(data.data.user);
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      localStorage.setItem('tuvi_token', data.data.accessToken);
      localStorage.setItem('tuvi_refresh_token', data.data.refreshToken);
      return data.data.user;
    } catch (err) {
      const errorMsg = err.message || 'Đăng ký thất bại';
      setError(errorMsg);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Cập nhật thất bại');
      }

      setUser(data.data.user);
      return data.data.user;
    } catch (err) {
      const errorMsg = err.message || 'Cập nhật thất bại';
      setError(errorMsg);
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại');
      }

      return true;
    } catch (err) {
      const errorMsg = err.message || 'Đổi mật khẩu thất bại';
      setError(errorMsg);
      throw err;
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    loading,
    error,
    login,
    logout: handleLogout,
    register,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMaster: user?.role === 'master' || user?.role === 'admin',
    isUser: !!user,
    credits: user?.credits ?? 0,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook: Sử dụng AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

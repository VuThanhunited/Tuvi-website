/**
 * Enhanced API Service with Error Handling and Retry Logic
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://tuvi-website.onrender.com/api';

const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ApiService {
  constructor() {
    this.requestQueue = [];
    this.isRefreshing = false;
  }

  getToken() {
    return localStorage.getItem('tuvi_token');
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = this.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Main request method with retry and error handling
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const { auth = true, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          ...this.getHeaders(auth),
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle 401 - Token expired
      if (res.status === 401) {
        const newToken = await this.refreshToken();
        if (newToken && retryCount < MAX_RETRIES) {
          // Retry request with new token
          localStorage.setItem('tuvi_token', newToken);
          return this.request(endpoint, options, retryCount + 1);
        }
        // Token refresh failed - logout
        localStorage.removeItem('tuvi_token');
        localStorage.removeItem('tuvi_refresh_token');
        window.location.href = '/login';
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server không trả về dữ liệu JSON hợp lệ.');
      }

      const data = await res.json();

      // Check response status
      if (!data.success) {
        const error = new ApiError(
          data.message || this.getErrorMessage(res.status),
          res.status,
          data
        );
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeout);

      // Handle network/timeout errors with retry
      if (err.name === 'AbortError') {
        if (retryCount < MAX_RETRIES) {
          await this.delay(RETRY_DELAY * (retryCount + 1));
          return this.request(endpoint, options, retryCount + 1);
        }
        throw new ApiError('Yêu cầu hết thời gian. Vui lòng thử lại.', 0, null);
      }

      // Handle other errors
      if (err instanceof ApiError) {
        throw err;
      }

      throw new ApiError(
        err.message || 'Lỗi kết nối. Vui lòng kiểm tra kết nối mạng.',
        0,
        null
      );
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('tuvi_refresh_token');
      if (!refreshToken) {
        throw new Error('Không có refresh token');
      }

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        localStorage.removeItem('tuvi_token');
        localStorage.removeItem('tuvi_refresh_token');
        throw new Error('Không thể làm mới token');
      }

      const data = await response.json();
      const newAccessToken = data.data.accessToken;

      localStorage.setItem('tuvi_token', newAccessToken);
      this.isRefreshing = false;

      // Process queued requests
      this.requestQueue.forEach(({ resolve }) => resolve(newAccessToken));
      this.requestQueue = [];

      return newAccessToken;
    } catch (error) {
      this.isRefreshing = false;
      this.requestQueue = [];
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Delay helper for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get error message from HTTP status
   */
  getErrorMessage(status) {
    const messages = {
      400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
      401: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
      403: 'Bạn không có quyền thực hiện hành động này.',
      404: 'Không tìm thấy tài nguyên.',
      409: 'Dữ liệu bị xung đột. Vui lòng thử lại.',
      429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
      500: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      503: 'Máy chủ tạm thời không khả dụng.',
    };
    return messages[status] || 'Có lỗi xảy ra. Vui lòng thử lại.';
  }

  // ── Convenience Methods ──

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Auth
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
  }

  register(formData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      auth: false,
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  updateProfile(updates) {
    return this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Tu Vi
  createLaSo(formData) {
    return this.request('/tuvi/calculate', {
      method: 'POST',
      body: JSON.stringify(formData),
      auth: true,
    });
  }

  getLaSoHistory() {
    return this.request('/tuvi/history');
  }

  getLaSoById(id) {
    return this.request(`/tuvi/${id}`);
  }

  // Admin
  getStats() {
    return this.request('/admin/stats');
  }

  getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${query}`);
  }

  updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  toggleUserActive(userId) {
    return this.request(`/admin/users/${userId}/toggle-active`, {
      method: 'PUT',
    });
  }

  addCredits(userId, credits) {
    return this.request(`/admin/users/${userId}/credits`, {
      method: 'PUT',
      body: JSON.stringify({ credits }),
    });
  }

  // Articles
  getArticles(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/articles?${query}`, { auth: false });
  }

  // Contact
  sendContact(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
      auth: false,
    });
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiService();
export { ApiError };
export default api;

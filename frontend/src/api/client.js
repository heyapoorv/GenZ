import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle token refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      try {
        await client.post('/auth/refresh-token');
        return client(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem('userInfo');
        // Better UX: Dispatch a custom event instead of hard reload
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;

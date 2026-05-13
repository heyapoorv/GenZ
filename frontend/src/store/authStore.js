import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set) => ({
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API failed', err);
    }
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  }
}));

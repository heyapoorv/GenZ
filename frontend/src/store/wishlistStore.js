import { create } from 'zustand';
import api from '../api/client';
import { useAuthStore } from './authStore';

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/users/wishlist');
      set({ wishlist: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch wishlist', 
        isLoading: false 
      });
    }
  },

  toggleWishlist: async (productId) => {
    const userInfo = useAuthStore.getState().userInfo;
    if (!userInfo) {
      window.dispatchEvent(new Event('auth:unauthorized'));
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/users/wishlist/${productId}`);
      set({ wishlist: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update wishlist', 
        isLoading: false 
      });
    }
  }
}));

import { create } from 'zustand';
import api from '../api/client';

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,
  page: 1,
  pages: 1,

  fetchProducts: async (keyword = '', category = '', sort = '', pageNumber = 1, minPrice = '', maxPrice = '', sizes = '') => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/products?keyword=${keyword}&category=${category}&sort=${sort}&pageNumber=${pageNumber}&minPrice=${minPrice}&maxPrice=${maxPrice}&sizes=${sizes}`);
      set((state) => ({ 
        products: pageNumber === 1 ? data.products : [...state.products, ...data.products], 
        page: data.page,
        pages: data.pages,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },

  fetchProductDetails: async (id) => {
    set({ isLoading: true, error: null, product: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ product: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product', 
        isLoading: false 
      });
    }
  }
}));

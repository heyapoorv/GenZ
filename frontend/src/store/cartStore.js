import { create } from 'zustand';
import api from '../api/client';
import { useAuthStore } from './authStore';

export const useCartStore = create((set, get) => ({
  cart: { products: [] },
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/cart');
      // Normalize data: ensure price, name, image are accessible
      const normalizedProducts = data.products.map(p => ({
        ...p,
        name: p.name || p.product?.name,
        price: p.price || p.product?.price,
        image: p.image || p.product?.images?.[0]
      }));
      set({ cart: { ...data, products: normalizedProducts }, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch cart', 
        isLoading: false 
      });
    }
  },

  syncCart: async (products) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/cart', { products });
      // Normalize data
      const normalizedProducts = data.products.map(p => ({
        ...p,
        name: p.name || p.product?.name,
        price: p.price || p.product?.price,
        image: p.image || p.product?.images?.[0]
      }));
      set({ cart: { ...data, products: normalizedProducts }, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to sync cart', 
        isLoading: false 
      });
    }
  },

  addToCart: async (productItem) => {
    // productItem should be { product: id, quantity, size, price }
    const currentProducts = [...get().cart.products];
    const existingIndex = currentProducts.findIndex(
      (p) => p.product === productItem.product && p.size === productItem.size
    );

    if (existingIndex >= 0) {
      currentProducts[existingIndex].quantity += productItem.quantity;
    } else {
      currentProducts.push(productItem);
    }

    set({ cart: { ...get().cart, products: currentProducts } });
    
    const userInfo = useAuthStore.getState().userInfo;
    if (userInfo) {
      await get().syncCart(currentProducts);
    } else {
       localStorage.setItem('localCart', JSON.stringify(currentProducts));
    }
  },

  removeFromCart: async (productId, size) => {
    const currentProducts = get().cart.products.filter(
      (p) => !(p.product === productId && p.size === size)
    );

    set({ cart: { ...get().cart, products: currentProducts } });

    const userInfo = useAuthStore.getState().userInfo;
    if (userInfo) {
      await get().syncCart(currentProducts);
    } else {
      localStorage.setItem('localCart', JSON.stringify(currentProducts));
    }
  },

  updateQuantity: async (productId, size, quantity) => {
    const currentProducts = [...get().cart.products];
    const index = currentProducts.findIndex(p => p.product === productId && p.size === size);
    
    if (index >= 0) {
      currentProducts[index].quantity = quantity;
      set({ cart: { ...get().cart, products: currentProducts } });

      const userInfo = useAuthStore.getState().userInfo;
      if (userInfo) {
        await get().syncCart(currentProducts);
      } else {
        localStorage.setItem('localCart', JSON.stringify(currentProducts));
      }
    }
  },

  clearCart: async () => {
    set({ cart: { products: [] } });
    const userInfo = useAuthStore.getState().userInfo;
    if (userInfo) {
      await get().syncCart([]);
    } else {
      localStorage.removeItem('localCart');
    }
  },

  loadLocalCart: () => {
    const local = localStorage.getItem('localCart');
    if (local) {
      const products = JSON.parse(local);
      const normalizedProducts = products.map(p => ({
        ...p,
        name: p.name || p.product?.name,
        price: p.price || p.product?.price,
        image: p.image || p.product?.images?.[0]
      }));
      set({ cart: { products: normalizedProducts } });
    }
  }
}));

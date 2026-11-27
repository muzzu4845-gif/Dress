import { apiRequest } from './api';

export const cartService = {
  getCart: () => apiRequest('/cart'),

  addToCart: (productId, selectedSize = 'M', quantity = 1) =>
    apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, selectedSize, quantity })
    }),

  syncCart: (syncItems) =>
    apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ syncItems })
    }),

  updateCartItem: (productId, selectedSize, quantity) =>
    apiRequest(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ selectedSize, quantity })
    }),

  removeFromCart: (productId, selectedSize) => {
    const query = selectedSize ? `?selectedSize=${encodeURIComponent(selectedSize)}` : '';
    return apiRequest(`/cart/${productId}${query}`, {
      method: 'DELETE'
    });
  },

  clearCart: () =>
    apiRequest('/cart', {
      method: 'DELETE'
    })
};

import { apiRequest } from './api';

export const orderService = {
  createOrder: (orderData) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),

  verifyPayment: (orderId, paymentData) =>
    apiRequest(`/orders/${orderId}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),

  getMyOrders: () => apiRequest('/orders/my-orders'),

  getOrderById: (orderId) => apiRequest(`/orders/${orderId}`),

  getAllOrders: (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return apiRequest(`/orders${searchParams ? `?${searchParams}` : ''}`);
  },

  updateOrderStatus: (orderId, statusData) =>
    apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    }),

  getAdminStats: () => apiRequest('/users/admin/stats'),

  getWishlist: () => apiRequest('/users/wishlist'),

  toggleWishlist: (productId) =>
    apiRequest(`/users/wishlist/${productId}`, {
      method: 'POST'
    })
};

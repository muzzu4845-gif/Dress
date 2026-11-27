import { apiRequest } from './api';

export const productService = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: (id) => apiRequest(`/products/${id}`),

  getProductsByCategory: (category) => apiRequest(`/products/category/${category}`),

  searchProducts: (query) => apiRequest(`/products/search?q=${encodeURIComponent(query)}`),

  createProduct: (productData) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }),

  updateProduct: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),

  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE'
    })
};

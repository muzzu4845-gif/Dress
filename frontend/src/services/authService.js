import { apiRequest } from './api';

export const authService = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('stylehub_user', JSON.stringify(data));
    }
    return data;
  },

  register: async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.token) {
      localStorage.setItem('stylehub_user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('stylehub_user');
    return apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
  },

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (profileData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

  changePassword: (passwordData) =>
    apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    }),

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('stylehub_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
};

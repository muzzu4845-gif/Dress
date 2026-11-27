const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  let token = null;
  try {
    const userStr = localStorage.getItem('stylehub_user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      token = parsed.token;
    }
  } catch (err) {
    console.error('Error reading token from localStorage', err);
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && token) {
        localStorage.removeItem('stylehub_user');
        window.dispatchEvent(new Event('auth_token_expired'));
      }
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export default apiRequest;

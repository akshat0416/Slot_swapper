// frontend/src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

export default API_CONFIG;
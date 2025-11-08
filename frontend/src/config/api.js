// frontend/src/config/api.js

// ✅ Uses Vercel environment variable when deployed
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

export default API_CONFIG;

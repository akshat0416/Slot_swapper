// src/config/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Debug for frontend console
console.log("Backend URL →", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Attach token automatically (VERY IMPORTANT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

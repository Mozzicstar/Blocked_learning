import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://blockbackend-production.up.railway.app";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add wallet address if available
    const wallet = localStorage.getItem("walletAddress");
    if (wallet) {
      config.headers["x-wallet"] = wallet;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

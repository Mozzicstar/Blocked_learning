import { api } from "./client";

export const adminApi = {
  getStats: async () => {
    const response = await api.get("/api/admin/stats");
    return response.data.data || response.data;
  },

  getUsers: async (limit = 50, offset = 0) => {
    const response = await api.get(`/api/admin/users?limit=${limit}&offset=${offset}`);
    return response.data.data || response.data;
  },

  banUser: async (wallet: string, banned: boolean) => {
    const response = await api.post("/api/admin/ban", { wallet, banned });
    return response.data;
  },
};

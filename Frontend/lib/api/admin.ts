import { api } from "./client";

export const adminApi = {
  getStats: async () => {
    const response = await api.get("/api/admin/stats");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/api/admin/users");
    return response.data;
  },

  banUser: async (walletAddress: string) => {
    const response = await api.post("/api/admin/ban", { walletAddress });
    return response.data;
  },
};

import { api } from "./client";

export const trendingApi = {
  getTrending: async () => {
    const response = await api.get("/api/trending");
    return response.data;
  },
};

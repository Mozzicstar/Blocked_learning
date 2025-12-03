import { api } from "./client";

export const authApi = {
  getNonce: async (wallet: string) => {
    const response = await api.post("/api/auth/nonce", { wallet });
    return response.data;
  },

  verifySignature: async (wallet: string, nonce: string) => {
    const response = await api.post("/api/auth/verify", {
      wallet,
      nonce,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

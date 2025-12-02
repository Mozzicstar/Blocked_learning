import { api } from "./client";

export const authApi = {
  getNonce: async (walletAddress: string) => {
    const response = await api.post("/api/auth/nonce", { walletAddress });
    return response.data;
  },

  verifySignature: async (walletAddress: string, signature: string) => {
    const response = await api.post("/api/auth/verify", {
      walletAddress,
      signature,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/api/me");
    return response.data;
  },
};

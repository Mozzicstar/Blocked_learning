import { StateCreator } from "zustand";
import { authApi } from "../../lib/api/auth";

export interface User {
  id: string;
  walletAddress: string;
  role: "user" | "creator" | "admin";
  createdAt: string;
}

export interface UserSlice {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  userError: string | null;
  login: (walletAddress: string, signature: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const userSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoadingUser: false,
  userError: null,

  login: async (walletAddress, signature) => {
    set({ isLoadingUser: true, userError: null });
    try {
      const { token, user } = await authApi.verifySignature(
        walletAddress,
        signature
      );
      localStorage.setItem("token", token);
      set({ user, isAuthenticated: true, isLoadingUser: false });
    } catch (error: any) {
      set({
        userError: error.response?.data?.message || "Login failed",
        isLoadingUser: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    set({ isLoadingUser: true });
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isLoadingUser: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoadingUser: false });
    }
  },
});

import { StateCreator } from "zustand";
import { adminApi } from "../../lib/api/admin";
import { User } from "./userSlice";

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalVolume: string;
}

export interface AdminSlice {
  stats: AdminStats | null;
  usersList: User[];
  isAdminLoading: boolean;
  adminError: string | null;
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  banUser: (walletAddress: string) => Promise<void>;
}

import { MOCK_USERS, MOCK_ADMIN_STATS } from "../../lib/mockData";

export const adminSlice: StateCreator<AdminSlice> = (set) => ({
  stats: MOCK_ADMIN_STATS,
  usersList: MOCK_USERS,
  isAdminLoading: false,
  adminError: null,

  fetchStats: async () => {
    set({ isAdminLoading: true, adminError: null });
    try {
      const stats = await adminApi.getStats();
      if (!stats) return;
      set({ stats, isAdminLoading: false });
    } catch (error: any) {
      set({
        adminError: error.response?.data?.message || "Failed to fetch stats",
        isAdminLoading: false,
      });
    }
  },

  fetchUsers: async () => {
    set({ isAdminLoading: true, adminError: null });
    try {
      const usersList = await adminApi.getUsers();
      if (!usersList) return;
      set({ usersList, isAdminLoading: false });
    } catch (error: any) {
      set({
        adminError: error.response?.data?.message || "Failed to fetch users",
        isAdminLoading: false,
      });
    }
  },

  banUser: async (walletAddress) => {
    set({ isAdminLoading: true, adminError: null });
    try {
      await adminApi.banUser(walletAddress);
      set({ isAdminLoading: false });
    } catch (error: any) {
      set({
        adminError: error.response?.data?.message || "Failed to ban user",
        isAdminLoading: false,
      });
    }
  },
});

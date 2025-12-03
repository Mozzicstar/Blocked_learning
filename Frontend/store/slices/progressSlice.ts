import { StateCreator } from "zustand";
import { progressApi } from "../../lib/api/progress";

export interface UserProgress {
  completedModules: number;
  totalXp: number;
  completedCourses: number;
  progress: any[];
}

export interface ProgressSlice {
  userProgress: UserProgress | null;
  isLoadingProgress: boolean;
  progressError: string | null;
  fetchUserProgress: () => Promise<void>;
  markModuleComplete: (moduleId: number) => Promise<void>;
}

export const progressSlice: StateCreator<ProgressSlice> = (set) => ({
  userProgress: null,
  isLoadingProgress: false,
  progressError: null,

  fetchUserProgress: async () => {
    set({ isLoadingProgress: true, progressError: null });
    try {
      const userProgress = await progressApi.getUserProgress();
      set({ userProgress, isLoadingProgress: false });
    } catch (error: any) {
      console.error("Failed to fetch progress:", error);
      // Set default values on error
      set({
        userProgress: { completedModules: 0, totalXp: 0, completedCourses: 0, progress: [] },
        progressError: error.response?.data?.message || "Failed to fetch progress",
        isLoadingProgress: false,
      });
    }
  },

  markModuleComplete: async (moduleId: number) => {
    try {
      await progressApi.markModuleComplete(moduleId);
      // Refetch progress after marking complete
      const userProgress = await progressApi.getUserProgress();
      set({ userProgress });
    } catch (error: any) {
      console.error("Failed to mark module complete:", error);
      set({
        progressError: error.response?.data?.message || "Failed to update progress",
      });
    }
  },
});

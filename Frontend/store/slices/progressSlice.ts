import { StateCreator } from "zustand";
import { progressApi } from "../../lib/api/progress";

export interface UserProgress {
  courseId: string;
  completedModules: string[];
  progressPercentage: number;
}

export interface ProgressSlice {
  userProgress: UserProgress[];
  isLoadingProgress: boolean;
  progressError: string | null;
  fetchUserProgress: () => Promise<void>;
  updateUserProgress: (
    courseId: string,
    moduleId: string,
    progress: number
  ) => Promise<void>;
}

export const progressSlice: StateCreator<ProgressSlice> = (set) => ({
  userProgress: [],
  isLoadingProgress: false,
  progressError: null,

  fetchUserProgress: async () => {
    set({ isLoadingProgress: true, progressError: null });
    try {
      const userProgress = await progressApi.getUserProgress();
      set({ userProgress, isLoadingProgress: false });
    } catch (error: any) {
      set({
        progressError:
          error.response?.data?.message || "Failed to fetch progress",
        isLoadingProgress: false,
      });
    }
  },

  updateUserProgress: async (courseId, moduleId, progress) => {
    try {
      await progressApi.updateProgress(courseId, moduleId, progress);
      // Optimistically update or refetch
      const userProgress = await progressApi.getUserProgress();
      set({ userProgress });
    } catch (error: any) {
      set({
        progressError:
          error.response?.data?.message || "Failed to update progress",
      });
    }
  },
});

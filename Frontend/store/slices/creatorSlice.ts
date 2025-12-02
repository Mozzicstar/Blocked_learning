import { StateCreator } from "zustand";
import { coursesApi } from "../../lib/api/courses";
import { Course } from "./coursesSlice";

export interface CreatorSlice {
  myCourses: Course[];
  isUploading: boolean;
  uploadError: string | null;
  fetchMyCourses: (walletAddress: string) => Promise<void>;
  uploadCourse: (courseData: any) => Promise<void>;
  publishCourseToBlockchain: (courseId: string, txHash: string) => Promise<void>;
}

export const creatorSlice: StateCreator<CreatorSlice> = (set) => ({
  myCourses: [],
  isUploading: false,
  uploadError: null,

  fetchMyCourses: async (walletAddress) => {
    set({ isUploading: true, uploadError: null });
    try {
      const myCourses = await coursesApi.getCreatorCourses(walletAddress);
      set({ myCourses, isUploading: false });
    } catch (error: any) {
      set({
        uploadError:
          error.response?.data?.message || "Failed to fetch creator courses",
        isUploading: false,
      });
    }
  },

  uploadCourse: async (courseData) => {
    set({ isUploading: true, uploadError: null });
    try {
      await coursesApi.uploadCourse(courseData);
      set({ isUploading: false });
    } catch (error: any) {
      set({
        uploadError: error.response?.data?.message || "Failed to upload course",
        isUploading: false,
      });
    }
  },

  publishCourseToBlockchain: async (courseId, txHash) => {
    set({ isUploading: true, uploadError: null });
    try {
      await coursesApi.publishCourse(courseId, txHash);
      set({ isUploading: false });
    } catch (error: any) {
      set({
        uploadError:
          error.response?.data?.message || "Failed to publish course",
        isUploading: false,
      });
    }
  },
});

import { StateCreator } from "zustand";
import { coursesApi } from "../../lib/api/courses";

export interface Module {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  creator: string;
  price: string;
  modules: Module[];
  isPublished: boolean;
  contractAddress?: string;
}

export interface CoursesSlice {
  courses: Course[];
  currentCourse: Course | null;
  isLoadingCourses: boolean;
  coursesError: string | null;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  fetchOnChainCourses: () => Promise<void>;
}

import { MOCK_COURSES } from "../../lib/mockData";

export const coursesSlice: StateCreator<CoursesSlice> = (set) => ({
  courses: MOCK_COURSES,
  currentCourse: MOCK_COURSES[0],
  isLoadingCourses: false,
  coursesError: null,

  fetchCourses: async () => {
    set({ isLoadingCourses: true, coursesError: null });
    try {
      const courses = await coursesApi.getCourses();
      set({ courses, isLoadingCourses: false });
    } catch (error: any) {
      set({
        coursesError:
          error.response?.data?.message || "Failed to fetch courses",
        isLoadingCourses: false,
      });
    }
  },

  fetchCourseById: async (id: string) => {
    set({ isLoadingCourses: true, coursesError: null });
    try {
      const course = await coursesApi.getCourseById(id);
      set({ currentCourse: course, isLoadingCourses: false });
    } catch (error: any) {
      set({
        coursesError: error.response?.data?.message || "Failed to fetch course",
        isLoadingCourses: false,
      });
    }
  },

  fetchOnChainCourses: async () => {
    set({ isLoadingCourses: true, coursesError: null });
    try {
      const courses = await coursesApi.getOnChainCourses();
      set({ courses, isLoadingCourses: false });
    } catch (error: any) {
      set({
        coursesError:
          error.response?.data?.message || "Failed to fetch on-chain courses",
        isLoadingCourses: false,
      });
    }
  },
});

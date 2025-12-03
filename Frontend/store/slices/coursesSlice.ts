import { StateCreator } from "zustand";
import { coursesApi } from "../../lib/api/courses";

export interface Course {
  id: number;
  title: string;
  description: string;
  creator_wallet: string;
  file_cid: string;
  ip_token_id: string | null;
  metadata_hash: string | null;
  tags: string[];
  status: string;
  created_at: string;
  modules?: any[];
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

export const coursesSlice: StateCreator<CoursesSlice> = (set) => ({
  courses: MOCK_COURSES,
  currentCourse: null,
  isLoadingCourses: false,
  coursesError: null,

  fetchCourses: async () => {
    set({ isLoadingCourses: true, coursesError: null });
    try {
      console.log("[Store] Calling fetchCourses...");
      const courses = await coursesApi.getCourses();
      console.log("[Store] Got courses:", courses);
      set({ courses: courses || [], isLoadingCourses: false });
    } catch (error: any) {
      console.error("[Store] Failed to fetch courses:", error);
      set({
        courses: [],
        coursesError: error.response?.data?.message || "Failed to fetch courses",
        isLoadingCourses: false,
      });
    }
  },

  fetchCourseById: async (id: string) => {
    set({ isLoadingCourses: true, coursesError: null });
    try {
      // const course = await coursesApi.getCourseById(id);
      const course = MOCK_COURSES.find((course) => course.id == id) || MOCK_COURSES[0];
      set({ currentCourse: course, isLoadingCourses: false });
    } catch (error: any) {
      console.error("Failed to fetch course:", error);
      set({
        currentCourse: null,
        coursesError: error.response?.data?.message || "Failed to fetch course",
        isLoadingCourses: false,
      });
    }
  },

  fetchOnChainCourses: async () => {
    set({ isLoadingCourses: true, coursesError: null });
    try {
      const courses = await coursesApi.getOnChainCourses();
      set({ courses: courses || [], isLoadingCourses: false });
    } catch (error: any) {
      console.error("Failed to fetch on-chain courses:", error);
      set({
        courses: [],
        coursesError:
          error.response?.data?.message || "Failed to fetch on-chain courses",
        isLoadingCourses: false,
      });
    }
  },
});

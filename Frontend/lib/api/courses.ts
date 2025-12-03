import { api } from "./client";

export const coursesApi = {
  getCourses: async () => {
    console.log("[API] Fetching courses from backend...");
    const response = await api.get("/api/courses");
    console.log("[API] Courses response:", response.data);
    // Backend returns { statusCode, data, pagination }
    return response.data.data || [];
  },

  getCourseById: async (id: string) => {
    console.log(`[API] Fetching course ${id}...`);
    const response = await api.get(`/api/courses/${id}`);
    console.log("[API] Course response:", response.data);
    // Backend returns { statusCode, data: { course, modules } }
    return response.data.data || null;
  },

  getCreatorCourses: async (walletAddress: string) => {
    const response = await api.get(`/api/courses/creator/${walletAddress}`);
    return response.data.data || [];
  },

  getOnChainCourses: async () => {
    const response = await api.get("/api/courses/onchain");
    return response.data.data || [];
  },

  uploadCourse: async (courseData: any) => {
    const response = await api.post("/api/courses/upload", courseData);
    return response.data;
  },

  publishCourse: async (courseId: string, txHash: string) => {
    const response = await api.post("/api/courses/publish", {
      courseId,
      txHash,
    });
    return response.data;
  },
};

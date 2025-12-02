import { api } from "./client";

export const coursesApi = {
  getCourses: async () => {
    const response = await api.get("/api/courses");
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  },

  getCreatorCourses: async (walletAddress: string) => {
    const response = await api.get(`/api/courses/creator/${walletAddress}`);
    return response.data;
  },

  getOnChainCourses: async () => {
    const response = await api.get("/api/courses/onchain");
    return response.data;
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

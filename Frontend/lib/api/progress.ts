import { api } from "./client";

export const progressApi = {
  getUserProgress: async () => {
    const response = await api.get("/api/user/progress");
    return response.data;
  },

  updateProgress: async (courseId: string, moduleId: string, progress: number) => {
    const response = await api.post("/api/user/progress", {
      courseId,
      moduleId,
      progress,
    });
    return response.data;
  },

  getCourseProgress: async (courseId: string) => {
    const response = await api.get(`/api/user/progress/${courseId}`);
    return response.data;
  },
};

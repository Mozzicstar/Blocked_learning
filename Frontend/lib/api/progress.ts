import { api } from "./client";

export const progressApi = {
  getUserProgress: async () => {
    const response = await api.get("/api/user/progress");
    return response.data.data || response.data;
  },

  markModuleComplete: async (moduleId: number) => {
    const response = await api.post("/api/user/progress", { moduleId });
    return response.data;
  },

  getCourseProgress: async (courseId: string) => {
    const response = await api.get(`/api/user/progress/course/${courseId}`);
    return response.data.data || response.data;
  },
};

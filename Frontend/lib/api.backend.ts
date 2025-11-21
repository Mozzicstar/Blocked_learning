// lib/api.backend.ts
import { http } from "./http";

export const api = {
  async getCourses() {
    const res = await http.get("/api/courses");
    return res.data;
  },

  async getTrending() {
    const res = await http.get("/api/trending");
    return res.data;
  },

  async markModule(id: string) {
    const res = await http.post("/api/user/progress", { moduleId: id });
    return res.data;
  },
};

// lib/api.backend.ts
import { client } from "./client";

export const api = {
  async getCourses() {
    const res = await client.get("/api/courses");
    return res.data;
  },

  async getTrending() {
    const res = await client.get("/api/trending");
    return res.data;
  },

  async markModule(id: string) {
    const res = await client.post("/api/user/progress", { moduleId: id });
    return res.data;
  },
};

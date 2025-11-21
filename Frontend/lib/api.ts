import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE;

const client = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional — remove if you don't need cookies
});

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
    const res = await client.post("/api/user/progress", {
      moduleId: id,
    });
    return res.data;
  },
};

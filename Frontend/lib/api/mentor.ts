import { api } from "./client";

export const mentorApi = {
  // POST /api/mentor/explain - Personalized explanations
  explain: async (question: string) => {
    const response = await api.post("/api/mentor/explain", { question });
    return response.data;
  },

  // POST /api/mentor/suggest - Smart recommendations
  suggest: async (progress: any) => {
    const response = await api.post("/api/mentor/suggest", { progress });
    return response.data;
  },

  // POST /api/mentor/audit-code - Security vulnerability detection
  auditCode: async (code: string) => {
    const response = await api.post("/api/mentor/audit-code", { code });
    return response.data;
  },

  // POST /api/mentor/generate-project - Custom project templates
  generateProject: async (topic: string, difficulty: string) => {
    const response = await api.post("/api/mentor/generate-project", { topic, difficulty });
    return response.data;
  },

  // GET /api/mentor/profile/:wallet - Get learning profile
  getMentorProfile: async (walletAddress: string) => {
    const response = await api.get(`/api/mentor/profile/${walletAddress}`);
    return response.data;
  },
};

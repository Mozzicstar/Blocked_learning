import { api } from "./client";

export const mentorApi = {
  explain: async (context: string, question: string) => {
    const response = await api.post("/api/mentor/explain", { context, question });
    return response.data;
  },

  suggest: async (context: string) => {
    const response = await api.post("/api/mentor/suggest", { context });
    return response.data;
  },

  auditCode: async (code: string) => {
    const response = await api.post("/api/mentor/audit-code", { code });
    return response.data;
  },

  generateProject: async (prompt: string) => {
    const response = await api.post("/api/mentor/generate-project", { prompt });
    return response.data;
  },

  semanticSearch: async (query: string) => {
    const response = await api.post("/api/search/semantic", { query });
    return response.data;
  },

  analyzeVideo: async (videoId: string) => {
    const response = await api.post("/api/analyze/video", { videoId });
    return response.data;
  },

  analyzeQuality: async (content: string) => {
    const response = await api.post("/api/analyze/quality", { content });
    return response.data;
  },

  generateQuiz: async (topic: string) => {
    const response = await api.post("/api/generate/quiz", { topic });
    return response.data;
  },

  getMentorProfile: async (walletAddress: string) => {
    const response = await api.get(`/api/mentor/profile/${walletAddress}`);
    return response.data;
  },
};

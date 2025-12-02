import { api } from "./apiClient";

export const getProgress = () => api.get("/api/user/progress");
export const submitProgress = (payload: any) =>
  api.post("/api/user/progress", payload);

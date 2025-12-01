import { api } from "./apiClient";

export const getMe = () => api.get("/api/me");

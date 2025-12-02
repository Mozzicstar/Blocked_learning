import { api } from "./apiClient";

export const uploadCourse = (payload: any) =>
  api.post("/api/courses/upload", payload);

export const registerIP = (payload: any) =>
  api.post("/api/register-ip", payload);

export const getMyCourses = (address: string) =>
  api.get(`/api/creator/${address}`);

import { api } from "./apiClient";

export const getCourses = () => api.get("/api/courses");
export const getCourse = (id: string) => api.get(`/api/courses/${id}`);

import { api } from "./apiClient";

export const mentorSuggest = (payload: any) =>
  api.post("/api/mentor/suggest", payload);

export const mentorExplain = (payload: any) =>
  api.post("/api/mentor/explain", payload);

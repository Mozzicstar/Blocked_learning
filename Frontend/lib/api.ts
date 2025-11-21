// lib/api.mock.ts
import { client } from "./client";
import {
  getCoursesSeed,
  getCourseSeed,
  completeModuleSeed,
  getDashboardSeed,
  getTrendingSeed,
  getModuleSeed,
} from "@/stores/useCourseStore";

const simulate = <T>(value: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(value), ms));

export const api = {
  async getCourses() {
    return simulate(getCoursesSeed(), 300);
  },
  async getCourse(id: string) {
    const data = getCourseSeed(id);
    if (!data) throw new Error("Course not found");
    return simulate(data, 300);
  },
  async getTrending() {
    return simulate(getTrendingSeed(), 250);
  },
  async completeModule(id: string) {
    return simulate(completeModuleSeed(id), 200);
  },
  async getDashboard(wallet?: string) {
    return simulate(getDashboardSeed(wallet), 250);
  },
};

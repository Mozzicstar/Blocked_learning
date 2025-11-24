// lib/api.mock.ts
import useSearchStore from "@/stores/useSearchStore";
import { client } from "./client";
import {
  getCoursesSeed,
  getCourseSeed,
  completeModuleSeed,
  getDashboardSeed,
  getTrendingSeed,
  getModuleSeed,
} from "@/stores/useCourseStore";
import { getCategories } from "@/stores/useCategoryStore";
import useUserStore from "@/stores/useUserStore";

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
  async getModule(courseId: string, moduleId: string) {
    const data = getModuleSeed(courseId, moduleId);
    if (!data) throw new Error("Module not found");
    return simulate(data, 300);
  },
  async getCategories() {
    const categories = getCategories();
    return { data: simulate(categories, 400) };
  },

  // -----------------------------
  // SEARCH
  // -----------------------------
  async searchCourses(query: string, filters: SearchFilters) {
    const searchStore = useSearchStore.getState();
    searchStore.setQuery(query);
    searchStore.setFilters(filters);
    searchStore.runSearch();

    return { data: simulate(searchStore.results, 500) };
  },
  async getUser() {
    const user = useUserStore.getState().user;
    return { data: simulate(user, 100) };
  },

  async updateUserPreferences(prefs: string[]) {
    useUserStore.getState().updatePreferences(prefs);
    return { data: prefs };
  },

  // -----------------------------
  // RECOMMENDED
  // -----------------------------
  async getRecommended() {
    const recommended = useUserStore.getState().recommended;
    return { data: recommended };
  },
};

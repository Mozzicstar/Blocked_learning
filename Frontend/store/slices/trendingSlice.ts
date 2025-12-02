import { StateCreator } from "zustand";
import { trendingApi } from "../../lib/api/trending";

export interface TrendingTopic {
  topic: string;
  count: number;
}

export interface TrendingSlice {
  trendingTopics: TrendingTopic[];
  isTrendingLoading: boolean;
  trendingError: string | null;
  fetchTrending: () => Promise<void>;
}

export const trendingSlice: StateCreator<TrendingSlice> = (set) => ({
  trendingTopics: [],
  isTrendingLoading: false,
  trendingError: null,

  fetchTrending: async () => {
    set({ isTrendingLoading: true, trendingError: null });
    try {
      const trendingTopics = await trendingApi.getTrending();
      set({ trendingTopics, isTrendingLoading: false });
    } catch (error: any) {
      set({
        trendingError:
          error.response?.data?.message || "Failed to fetch trending topics",
        isTrendingLoading: false,
      });
    }
  },
});

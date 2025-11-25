// stores/useSearchStore.ts
import { create } from "zustand";
import useCourseStore from "./useCourseStore";

const seedSearchIndex: SearchItem[] = [
  {
    id: "s1",
    title: "Blockchain Fundamentals",
    snippet: "A breakdown of how decentralized ledgers work.",
    courseId: "course-1",
    tags: ["web3", "blockchain"],
  },
  {
    id: "s2",
    title: "React Web3 Wallet UI",
    snippet: "How to connect wallets in React.",
    courseId: "course-2",
    tags: ["react", "web3"],
  },
];

type SearchState = {
  query: string;
  results: Course[];
  filters: SearchFilters;

  setQuery: (q: string) => void;
  setFilters: (f: SearchFilters) => void;
  clear: () => void;

  runSearch: () => void;
};

const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  results: [],
  filters: {},

  setQuery: (q) => set({ query: q }),

  setFilters: (filters) => set({ filters }),

  clear: () => set({ query: "", results: [], filters: {} }),

  runSearch: () => {
    const { query, filters } = get();
    const courses = useCourseStore.getState().courses;

    let filtered = courses.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    );

    if (filters.category) {
      filtered = filtered.filter((c) => c.tags.includes(filters.category!));
    }

    if (filters.difficulty) {
      filtered = filtered.filter((c) => c.difficulty === filters.difficulty);
    }

    set({ results: filtered });
  },
}));

export default useSearchStore;

// stores/useUserStore.ts
import { create } from "zustand";

type User = {
  wallet?: string | null;
  name?: string;
  interests?: string[];
  savedCourses?: string[];
};

type UserState = {
  user: User | null;

  // actions
  setUser: (u: User | null) => void;
  updatePreferences: (prefs: string[]) => void;
  toggleSaveCourse: (courseId: string) => void;

  // derived
  recommended: Course[];
};

const sampleRecommended: Course[] = [
  {
    id: "rec-1",
    title: "Fundamentals of AI Agents",
    description: "How modern AI agents work internally + hands-on demos.",
    creator: "TechLabs",
    tags: ["AI", "ML"],
    difficulty: "Beginner",
    modules: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "rec-2",
    title: "Productivity for Engineers",
    description: "A complete workflow optimization toolkit.",
    creator: "BoostHub",
    tags: ["productivity"],
    difficulty: "Beginner",
    modules: [],
    createdAt: new Date().toISOString(),
  },
];

const useUserStore = create<UserState>((set, get) => ({
  user: {
    wallet: "0x11A45...benz",
    name: "Eyitayo",
    interests: ["AI", "Frontend"],
    savedCourses: ["course-1"],
  },

  recommended: sampleRecommended,

  setUser: (u) => set({ user: u }),

  updatePreferences: (prefs) =>
    set((state) => ({
      user: { ...state.user, interests: prefs },
    })),

  toggleSaveCourse: (courseId) => {
    const user = get().user;
    if (!user) return;

    const saved = user.savedCourses ?? [];

    const newSaved = saved.includes(courseId)
      ? saved.filter((c) => c !== courseId)
      : [...saved, courseId];

    set({ user: { ...user, savedCourses: newSaved } });
  },
}));

export default useUserStore;

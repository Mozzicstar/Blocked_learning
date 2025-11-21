// stores/useCourseStore.ts
import { create } from "zustand";
import { nanoid } from "nanoid";

/**
 * Option A mock store: contains seeded courses + helpers used by lib/api.ts
 * This file both exports the hook and the helper functions used by lib/api to read/mutate seed data
 */

// Types

type CourseState = {
  courses: Course[];
  // actions for dev mode
  _seedReplace?: (courses: Course[]) => void;
  completeModule: (moduleId: string) => { success: boolean; moduleId: string };
};

const sampleCourses: Course[] = [
  {
    id: "course-1",
    title: "Intro to Web3 Fundamentals",
    description:
      "A gentle intro to blockchain concepts, wallets, and how to build on testnets.",
    creator: "TechyJaunt",
    thumbnail: "",
    tags: ["web3", "blockchain", "beginner"],
    difficulty: "Beginner",
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: "c1-m1",
        title: "What is Blockchain?",
        type: "text",
        content:
          "Blockchains are distributed ledgers... (mock content). Read more: https://example.com",
        duration: "6m",
        completed: false,
      },
      {
        id: "c1-m2",
        title: "Wallets & Addresses",
        type: "video",
        content: "https://www.w3schools.com/html/mov_bbb.mp4", // sample video
        duration: "8m",
        completed: false,
      },
      {
        id: "c1-m3",
        title: "Smart Contracts Overview",
        type: "text",
        content:
          "Smart contracts are programs that run on blockchain networks...",
        duration: "10m",
        completed: false,
      },
    ],
  },
  {
    id: "course-2",
    title: "React for Blockchain Interfaces",
    description:
      "How to build React frontends that interact with wallets and contracts.",
    creator: "BlockedLearning",
    thumbnail: "",
    tags: ["react", "frontend"],
    difficulty: "Intermediate",
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: "c2-m1",
        title: "Connecting a Wallet with Web3Modal",
        type: "text",
        content:
          "How to integrate Web3Modal and ask the user to sign a message... (mock)",
        duration: "7m",
        completed: false,
      },
      {
        id: "c2-m2",
        title: "Displaying On-chain Data in React",
        type: "video",
        content: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "12m",
        completed: false,
      },
    ],
  },
];

const useCourseStore = create<CourseState>((set, get) => ({
  courses: sampleCourses,
  _seedReplace: (courses) => set({ courses }),
  completeModule: (moduleId: string) => {
    const courses = get().courses.map((c) => {
      return {
        ...c,
        modules: c.modules.map((m) =>
          m.id === moduleId ? { ...m, completed: true } : m
        ),
      };
    });
    set({ courses });
    return { success: true, moduleId };
  },
}));

// Helper functions consumed by lib/api.ts
export function getCoursesSeed() {
  return useCourseStore.getState().courses;
}

export function getCourseSeed(id: string) {
  return useCourseStore
    .getState()
    .courses.find((c) => String(c.id) === String(id));
}

export function getModuleSeed(courseId: string, moduleId: string) {
  const course = getCourseSeed(courseId);
  if (!course) return null;
  return course.modules.find((m) => m.id === moduleId);
}

export function completeModuleSeed(moduleId: string) {
  return useCourseStore.getState().completeModule(moduleId);
}

export function getDashboardSeed(wallet?: string): Dashboard {
  // derive dashboard from courses (mock)
  const courses = useCourseStore.getState().courses;
  const progress = courses.map((c) => {
    const completedModules = c.modules.filter((m) => m.completed).length;
    return {
      courseId: c.id,
      completedModules,
      totalModules: c.modules.length,
      lastCompletedModule:
        c.modules.filter((m) => m.completed).slice(-1)[0]?.title ?? null,
    };
  });
  return {
    wallet,
    progress,
  };
}

export function getTrendingSeed() {
  // simple ranking by total modules (mock)
  const courses = useCourseStore.getState().courses;
  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    summary: c.description,
    tag: c.tags[0] ?? "general",
    date: c.createdAt,
    engagementScore:
      c.modules.reduce((acc, m) => acc + (m.completed ? 20 : 5), 0) +
      c.modules.length * 2,
  }));
}

export default useCourseStore;

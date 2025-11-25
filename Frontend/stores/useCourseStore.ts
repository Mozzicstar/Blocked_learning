import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

// --- TYPE DEFINITIONS (Assuming these are global/in a types file) ---
// Note: Since the full types (Course, Module, Dashboard) were not provided,
// I'm using 'any' placeholders for simplicity, but in a real app, they should be defined.
// type Course = any;
// type Module = any;
// type Dashboard = any;

// --- INITIAL SAMPLE DATA (25 Courses) ---
const baseCourseModules: Omit<Module, "id">[] = [
  {
    title: "Introduction",
    type: "text",
    content: "Welcome to the module.",
    duration: "5m",
    completed: false,
  },
  {
    title: "Core Concepts",
    type: "video",
    content: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "10m",
    completed: false,
  },
  {
    title: "Advanced Topics",
    type: "text",
    content: "Deeper dive into the subject.",
    duration: "15m",
    completed: false,
  },
  {
    title: "Final Assessment",
    type: "text",
    content: "Quiz time!",
    duration: "7m",
    completed: false,
  },
];

const generateCourse = (
  index: number,
  titleBase: string,
  tag: string,
  difficulty: Course["difficulty"]
): Course => ({
  id: `course-${index}`,
  title: `${titleBase} #${index}`,
  description: `A comprehensive course on ${titleBase.toLowerCase()} covering everything from basics to advanced applications.`,
  creator: `CreatorBot ${index % 5}`,
  thumbnail: `https://placehold.co/100x100/314151/FFFFFF?text=${tag}`,
  tags: [tag.toLowerCase(), "tutorial", difficulty.toLowerCase()],
  difficulty: difficulty,
  createdAt: new Date(Date.now() - index * 86400000).toISOString(), // Spread out creation dates
  modules: baseCourseModules.map((m, i) => ({
    ...m,
    id: `c${index}-m${i}`,
    title: `${m.title} - ${titleBase}`,
  })),
});

const sampleCourses: Course[] = [
  // 5 courses from each category
  generateCourse(1, "Web3 Fundamentals", "Web3", "Beginner"),
  generateCourse(2, "Solidity Basics", "Solidity", "Intermediate"),
  generateCourse(3, "Decentralized Finance (DeFi)", "DeFi", "Advanced"),
  generateCourse(4, "NFT Marketplace Design", "NFT", "Intermediate"),
  generateCourse(5, "Layer 2 Solutions", "Scaling", "Advanced"),

  generateCourse(6, "React Hooks Masterclass", "React", "Intermediate"),
  generateCourse(7, "Next.js App Router", "NextJS", "Advanced"),
  generateCourse(8, "TypeScript in Practice", "TypeScript", "Intermediate"),
  generateCourse(9, "CSS Grid & Flexbox", "Frontend", "Beginner"),
  generateCourse(10, "Zustand State Management", "State", "Beginner"),

  generateCourse(11, "Advanced Machine Learning", "AI", "Advanced"),
  generateCourse(12, "Python Data Science", "Python", "Intermediate"),
  generateCourse(13, "Introduction to Algorithms", "CS", "Beginner"),
  generateCourse(14, "Cloud Computing with AWS", "Cloud", "Intermediate"),
  generateCourse(15, "Database Design (SQL/NoSQL)", "Data", "Advanced"),

  generateCourse(
    16,
    "Mobile App Development (React Native)",
    "Mobile",
    "Intermediate"
  ),
  generateCourse(17, "Game Development Basics (JS)", "Gaming", "Beginner"),
  generateCourse(18, "Cybersecurity Essentials", "Security", "Beginner"),
  generateCourse(19, "Ethical Hacking Workshop", "Security", "Advanced"),
  generateCourse(20, "DevOps with Docker and K8s", "DevOps", "Advanced"),

  generateCourse(
    21,
    "Technical Writing for Engineers",
    "SoftSkills",
    "Beginner"
  ),
  generateCourse(22, "Product Management 101", "PM", "Intermediate"),
  generateCourse(23, "UI/UX Design Principles", "Design", "Beginner"),
  generateCourse(24, "Financial Modeling", "Finance", "Advanced"),
  generateCourse(25, "Leadership and Teams", "Management", "Intermediate"),
];

// --- STORE DEFINITION ---
type CourseState = {
  courses: Course[];
  completeModule: (moduleId: string) => { success: boolean; moduleId: string };
};

const useCourseStore = create<CourseState>()(
  // Use the persist middleware to save and rehydrate the state
  persist(
    (set, get) => ({
      // 1. INITIAL STATE: Use the sample courses only on first load
      courses: sampleCourses,

      // 2. ACTION: Mark a module as complete
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
    }),
    {
      name: "course-storage", // required: unique name for the storage key
      // 3. SEEDING: We use a custom property to ensure initial data seeding
      // only happens once when the store is created in storage, not on rehydration.
      // We explicitly whitelist 'courses' to be persisted.
      partialize: (state) => ({ courses: state.courses }),
      // The default storage (localStorage) will be used here.
      // If you are using a non-browser environment (like server/node),
      // you must provide a custom storage implementation.
    }
  )
);

// --- HELPER FUNCTIONS (API SEEDING) ---

// Helper function to initialize the store if it's empty in storage (redundant due to 'persist' default)
// For demonstration, we keep the original helper logic.
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

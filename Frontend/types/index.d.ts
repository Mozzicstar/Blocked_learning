// types/index.d.ts
type Module = {
  id: string;
  title: string;
  type: "video" | "text";
  content: string;
  duration: string;
  completed: boolean;
};

type Course = {
  id: string;
  title: string;
  description: string;
  creator: string;
  thumbnail?: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  modules: Module[];
  ipTokenId?: string | null;
  createdAt: string;
};

type Progress = {
  courseId: string;
  completedModules: number;
  totalModules: number;
  lastCompletedModule: string | null;
};
type Dashboard = {
  wallet?: string;
  progress: Progress[];
};

type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  courseIds: string[];
};

type SearchFilters = {
  category?: string;
  tag?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
};

type SearchItem = {
  id: string;
  title: string;
  snippet: string;
  courseId: string;
  tags: string[];
};

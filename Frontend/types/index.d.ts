// types/index.ts
/**
 * Shared types for Tickets and ATMs
 */
declare global {
  type Module = {
    id: string;
    title: string;
    type: "video" | "text";
    content: string; // url or text
    duration?: string;
    completed?: boolean;
  };

  type Course = {
    id: string;
    title: string;
    description: string;
    creator: string;
    thumbnail?: string;
    tags: string[];
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
    modules: Module[];
    ipTokenId?: string | null;
    createdAt?: string;
  };

  type Dashboard = {
    wallet?: string;
    progress: {
      courseId: string;
      completedModules: number;
      totalModules: number;
      lastCompletedModule?: string | null;
    }[];
  };
}

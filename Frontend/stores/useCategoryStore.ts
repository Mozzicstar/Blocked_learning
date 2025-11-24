// stores/useCategoryStore.ts
import { create } from "zustand";

const seedCategories: Category[] = [
  {
    id: "cat-ui",
    name: "UI/Frontend",
    description: "Frontend engineering, UI libraries, React, HTML & CSS.",
    icon: "LayoutGrid",
    courseIds: ["course-2"],
  },
  {
    id: "cat-backend",
    name: "Backend",
    description: "Node.js, APIs, Microservices.",
    icon: "Server",
    courseIds: [],
  },
  {
    id: "cat-ai",
    name: "Artificial Intelligence",
    description: "ML, agents, deep learning.",
    icon: "Brain",
    courseIds: ["course-1"],
  },
  {
    id: "cat-mobile",
    name: "Mobile Development",
    description: "Flutter, React Native, cross-platform mobile apps.",
    icon: "Smartphone",
    courseIds: [],
  },
  {
    id: "cat-productivity",
    name: "Productivity",
    description: "Workflows, automation tools, personal systems.",
    icon: "Timer",
    courseIds: [],
  },
];

type CategoryState = {
  categories: Category[];
};

const useCategoryStore = create<CategoryState>((set) => ({
  categories: seedCategories,
}));

export const getCategories = () => useCategoryStore.getState().categories;
export default useCategoryStore;

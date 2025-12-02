import { create } from "zustand";
import { userSlice, UserSlice } from "./slices/userSlice";
import { coursesSlice, CoursesSlice } from "./slices/coursesSlice";
import { creatorSlice, CreatorSlice } from "./slices/creatorSlice";
import { mentorSlice, MentorSlice } from "./slices/mentorSlice";
import { progressSlice, ProgressSlice } from "./slices/progressSlice";
import { trendingSlice, TrendingSlice } from "./slices/trendingSlice";
import { adminSlice, AdminSlice } from "./slices/adminSlice";

type StoreState = UserSlice &
  CoursesSlice &
  CreatorSlice &
  MentorSlice &
  ProgressSlice &
  TrendingSlice &
  AdminSlice;

export const useAppStore = create<StoreState>()((...args) => ({
  ...userSlice(...args),
  ...coursesSlice(...args),
  ...creatorSlice(...args),
  ...mentorSlice(...args),
  ...progressSlice(...args),
  ...trendingSlice(...args),
  ...adminSlice(...args),
}));

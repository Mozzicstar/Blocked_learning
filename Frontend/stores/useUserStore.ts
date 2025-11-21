// stores/useUserStore.ts
import { create } from "zustand";

type User = {
  wallet?: string | null;
  name?: string;
};

type UserState = {
  user: User | null;
  setUser: (u: User | null) => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));

export default useUserStore;

import { StateCreator } from "zustand";
import { registerWallet } from "@/lib/api/walletApi";

export interface WalletSlice {
  walletAddress: string | null;
  setWallet: (address: string) => void;
  registerWalletOnBackend: () => Promise<void>;
}

export const walletSlice: StateCreator<WalletSlice> = (set, get) => ({
  walletAddress: null,

  setWallet: (address) => set({ walletAddress: address }),

  registerWalletOnBackend: async () => {
    const addr = get().walletAddress;
    if (!addr) return;
    await registerWallet(addr);
  },
});

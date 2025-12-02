import { api } from "./apiClient";

export const registerWallet = (address: string) =>
  api.post("/api/wallet/register", { address });

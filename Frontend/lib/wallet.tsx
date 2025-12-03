"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "626";

// 2. Create wagmiConfig
const metadata = {
  name: "BlockedLearning",
  description: "Blockchain-powered learning platform",
  url: "https://blockedlearning.xyz",
  icons: ["https://blockedlearning.xyz/icon.png"],
};

const chains = [baseSepolia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
});

// 3. Create modal
// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Disable analytics to prevent 400 errors with invalid IDs
  enableOnramp: true,
});

if (projectId === "626") {
  console.error(
    "❌ Missing NEXT_PUBLIC_WALLETCONNECT_ID in .env.local. Web3Modal may not work correctly."
  );
} else {
  console.log("✅ WalletConnect Project ID loaded.");
}

export default function WalletProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { WagmiProvider } from "wagmi";
import { defineChain } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Camp Network Testnet
const campNetwork = defineChain({
  id: 123420001114,
  name: "Camp Network Testnet",
  nativeCurrency: {
    name: "CAMP",
    symbol: "CAMP",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.basecamp.t.raas.gelato.cloud"],
    },
  },
  blockExplorers: {
    default: {
      name: "Camp Explorer",
      url: "https://basecamp.cloud.blockscout.com",
    },
  },
});

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || 
                  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
                  "demo-project-id";

// 2. Create wagmiConfig
const metadata = {
  name: "BlockedLearning",
  description: "Blockchain-powered learning platform",
  url: "https://blockedlearning.xyz",
  icons: ["https://blockedlearning.xyz/icon.png"],
};

const chains = [campNetwork] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  enableOnramp: false,
  themeMode: "dark",
});

if (projectId === "demo-project-id") {
  console.warn(
    "⚠️ Using demo WalletConnect ID. Get a real one at https://cloud.walletconnect.com"
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

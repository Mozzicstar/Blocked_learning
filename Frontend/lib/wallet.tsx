"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { baseSepolia } from "viem/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

const metadata = {
  name: "BlockedLearning",
  description: "Learning on Camp Network",
  url: "https://blockedlearning.xyz",
  icons: ["https://blockedlearning.xyz/icon.png"],
};

const chains = [baseSepolia]; // Camp testnet is EVM-compatible

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
});

export default function WalletProvider({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}

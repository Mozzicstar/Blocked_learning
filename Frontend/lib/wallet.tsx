// "use client";

// import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
// import { WagmiConfig } from "wagmi";
// import { baseSepolia } from "viem/chains";

// const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;
// if (!projectId) {
//   throw new Error(
//     "NEXT_PUBLIC_WALLETCONNECT_ID is not set in environment variables."
//   );
// }

// const metadata = {
//   name: "BlockedLearning",
//   description: "Learning on Camp Network",
//   url: "https://blockedlearning.xyz",
//   icons: ["https://blockedlearning.xyz/icon.png"],
// };

// const chains = [baseSepolia]; // Camp testnet is EVM-compatible

// const wagmiConfig = defaultWagmiConfig({
//   //@ts-expect-error chains
//   chains,
//   projectId,
//   metadata,
// });

// createWeb3Modal({
//   wagmiConfig,
//   projectId,
//   //@ts-expect-error chains
//   chains,
//   themeMode: "light",
// });

// export default function WalletProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
// }

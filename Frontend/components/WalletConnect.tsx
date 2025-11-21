// "use client";

// import { useWeb3Modal } from "@web3modal/wagmi/react";
// import { useAccount } from "wagmi";
// import { Button } from "./ui/button";

// export function WalletConnect() {
//   const { open } = useWeb3Modal();
//   const { address } = useAccount();

//   if (address)
//     return (
//       <Button variant="outline">
//         {address.slice(0, 6)}...{address.slice(-4)}
//       </Button>
//     );

//   return <Button onClick={() => open()}>Connect Wallet</Button>;
// }
// components/WalletConnect.tsx
"use client";
import { Button } from "./ui/button";
import useUserStore from "@/stores/useUserStore";

// Minimal placeholder Button; you can replace with your design system.
export function WalletConnect() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  if (user?.wallet) {
    return (
      <Button onClick={() => setUser(null)} variant="outline">
        {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      onClick={() =>
        setUser({
          wallet: "0xDEADBEEF00000000000000000000000000000000",
          name: "Demo User",
        })
      }
    >
      Connect Wallet
    </Button>
  );
}

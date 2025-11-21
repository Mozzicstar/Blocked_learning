"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";

export function WalletConnect() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  if (address)
    return (
      <Button variant="outline">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );

  return <Button onClick={() => open()}>Connect Wallet</Button>;
}

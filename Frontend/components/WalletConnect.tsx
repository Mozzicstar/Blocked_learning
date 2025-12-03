"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { authApi } from "@/lib/api/auth";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WalletConnect() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { login, logout, user, isAuthenticated, isLoadingUser } = useAppStore();
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isLoadingUser) {
      handleAuth();
    }
  }, [isConnected, address, isAuthenticated]);

  const handleAuth = async () => {
    if (!address) return;
    setIsSigning(true);
    try {
      // 1. Get Nonce
      const { nonce } = await authApi.getNonce(address);

      // 2. Sign Message
      const signature = await signMessageAsync({
        message: `Sign this message to verify your identity. Nonce: ${nonce}`,
      });

      // 3. Login
      await login(address, signature);
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("Auth failed:", error);
      toast.error("Authentication failed");
      disconnect();
    } finally {
      setIsSigning(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    logout();
    toast.info("Disconnected");
  };

  if (isConnected && isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => {
          console.log("Connect Wallet clicked");
          open().catch((e) => console.error("Web3Modal open error:", e));
        }}
        disabled={isSigning || isLoadingUser}
      >
        {isSigning || isLoadingUser ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {/* Debug: Official Web3Modal Button */}
      <div className="text-xs text-center text-muted-foreground">
        <w3m-button />
      </div>
    </div>
  );
}

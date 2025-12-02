"use client";

import React from "react";
import { SidebarProvider } from "./ui/sidebar";
import ThemeProvider from "./ThemeProvider";
import WalletProvider from "@/lib/wallet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default Providers;

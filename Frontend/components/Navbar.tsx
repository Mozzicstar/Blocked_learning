// components/Navbar.tsx
"use client";
import Link from "next/link";
import { WalletConnect } from "./WalletConnect";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          BlockedLearning
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/courses">Courses</Link>
          <Link href="/trending">Trending</Link>
          <Link href="/dashboard">Dashboard</Link>
          <WalletConnect />
        </div>
      </nav>
    </header>
  );
}

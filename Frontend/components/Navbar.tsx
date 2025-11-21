"use client";

import { WalletConnect } from "./WalletConnect";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full border-b bg-white"
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          BlockedLearning
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/courses">Courses</Link>
          <Link href="/trending">Trending</Link>
          <Link href="/creator">Creator</Link>
          <WalletConnect />
        </div>
      </nav>
    </motion.header>
  );
}

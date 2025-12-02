"use client";

import { motion } from "framer-motion";
import { ArrowRight, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Orb from "@/components/Orb";
import Link from "next/link";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function Hero() {
  const { open } = useWeb3Modal();

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0B0F1A] text-white pt-20">
      {/* Background Orb */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80">
        <Orb
          hue={260}
          hoverIntensity={0.5}
          rotateOnHover={true}
          forceHoverState={false}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center gap-8 max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-cyan-400"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Future of On-Chain Education</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50"
        >
          Learn Web3. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Build the Future.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
        >
          Blockchain-powered courses, AI mentors, and verified on-chain
          learning. Earn credentials that actually matter in the decentralized
          economy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-cyan-500 hover:bg-cyan-600 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
            >
              Start Learning
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            onClick={() => open()}
          >
            <Wallet className="mr-2 w-5 h-5" />
            Connect Wallet
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative mt-4 flex flex-col items-center gap-2 text-gray-500 text-sm"
      >
        <span className="uppercase tracking-widest text-[10px]">
          Scroll to explore
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500/0 via-cyan-500 to-cyan-500/0" />
      </motion.div>
    </section>
  );
}

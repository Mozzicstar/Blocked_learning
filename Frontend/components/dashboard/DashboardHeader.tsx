"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Track your progress and continue your Web3 journey.
      </p>
    </motion.div>
  );
}

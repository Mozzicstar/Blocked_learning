// components/StatsCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: "primary" | "accent" | "destructive";
};

export default function StatsCard({
  title,
  value,
  subtitle,
  accent = "primary",
}: Props) {
  const accentColor =
    accent === "primary"
      ? "var(--primary)"
      : accent === "accent"
      ? "var(--accent)"
      : "var(--destructive)";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-lg p-4 border"
      style={{ borderColor: "var(--border)", background: "white" }}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2" style={{ color: accentColor }}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </motion.div>
  );
}

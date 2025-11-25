// components/CategoryCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  return (
    <motion.article
      whileHover={{ y: -6, boxShadow: "0 8px 30px rgba(46,56,255,0.12)" }}
      className="rounded-lg p-4 border"
      style={{
        borderColor: "var(--sidebar-border)",
        background: "var(--sidebar)",
        color: "var(--sidebar-foreground)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-lg font-semibold"
            style={{ color: "var(--sidebar-primary)" }}
          >
            {category.name}
          </div>
          {category.description && (
            <div className="text-sm text-slate-600 mt-1">
              {category.description}
            </div>
          )}
        </div>

        <Link
          href={`/categories/${category.id}`}
          className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm"
          style={{
            background: "var(--sidebar-primary)",
            color: "var(--sidebar-primary-foreground)",
          }}
        >
          Explore <ChevronRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}

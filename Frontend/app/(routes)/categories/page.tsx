// app/categories/page.tsx
"use client";

import useCategoryStore from "@/stores/useCategoryStore";
import CategoryCard from "@/components/CategoryCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const categories = useCategoryStore((s) => s.categories);

  if (!categories) return <LoadingSkeleton rows={4} />;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </motion.div>
    </section>
  );
}

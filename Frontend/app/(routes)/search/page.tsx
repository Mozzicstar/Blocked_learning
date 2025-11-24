// app/search/page.tsx
"use client";

import React, { useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import useSearchStore from "@/stores/useSearchStore";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";

export default function SearchPage() {
  const query = useSearchStore((s) => s.query);
  const results = useSearchStore((s) => s.results);
  const runSearch = useSearchStore((s) => s.runSearch);

  useEffect(() => {
    // ensure initial run
    runSearch();
  }, [runSearch]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Search</h1>

      <SearchBar />

      <div>
        <h2 className="text-lg font-medium mt-4">
          Results {query ? `for "${query}"` : ""}
        </h2>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          {results.length === 0 ? (
            <div className="col-span-full">
              <LoadingSkeleton rows={3} />
            </div>
          ) : (
            results.map((c) => (
              <CourseCard
                key={c.id}
                id={c.id}
                title={c.title}
                description={c.description}
                creator={c.creator}
              />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}

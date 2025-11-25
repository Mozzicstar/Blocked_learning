// app/categories/[slug]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import useCategoryStore from "@/stores/useCategoryStore";
import useCourseStore from "@/stores/useCourseStore";
import CourseCard from "@/components/CourseCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";

export default function CategoryDetailPage() {
  const params = useParams();
  const { slug } = params;
  const categories = useCategoryStore((s) => s.categories);
  const courses = useCourseStore((s) => s.courses);

  const category = categories.find((c) => c.id === slug || c.name === slug);

  const filteredCourses = useMemo(() => {
    if (!category) return [];
    return courses.filter(
      (c) => category.courseIds.includes(c.id) || c.tags.includes(category.name)
    );
  }, [category, courses]);

  if (!category) return <div>Category not found.</div>;

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
        </div>
      </div>

      <div className="mt-6">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredCourses.length === 0 ? (
            <LoadingSkeleton rows={3} />
          ) : (
            filteredCourses.map((c) => (
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

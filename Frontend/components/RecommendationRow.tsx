// components/RecommendationRow.tsx
"use client";

import React, { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import useCourseStore from "@/stores/useCourseStore";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";

export default function RecommendationRow() {
  const recommended = useUserStore((s) => s.recommended);
  const [items, setItems] = useState<Course[]>(recommended);

  useEffect(() => {
    setItems(recommended);
  }, [recommended]);

  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">Recommended for you</h3>
      <motion.div
        className="flex gap-3 overflow-x-auto pb-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {},
        }}
      >
        {items.map((c) => (
          <div key={c.id} style={{ minWidth: 280 }}>
            <CourseCard
              id={c.id}
              title={c.title}
              description={c.description}
              creator={c.creator}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

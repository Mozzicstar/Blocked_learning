// components/CourseHeader.tsx
"use client";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description?: string;
  tags?: string[];
  difficulty?: string;
};

export default function CourseHeader({
  title,
  description,
  tags = [],
  difficulty,
}: Props) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6"
    >
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        {tags.map((t) => (
          <span key={t} className="text-xs bg-slate-100 px-2 py-1 rounded">
            {t}
          </span>
        ))}
        {difficulty && (
          <span className="text-xs ml-2 px-2 py-1 rounded bg-yellow-100">
            {difficulty}
          </span>
        )}
      </div>
    </motion.header>
  );
}

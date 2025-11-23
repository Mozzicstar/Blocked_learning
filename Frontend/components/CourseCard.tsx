// components/CourseCard.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

type Props = {
  id: string;
  title: string;
  description: string;
  creator?: string;
  progress?: { completed: number; total: number } | null;
};

export default function CourseCard({
  id,
  title,
  description,
  creator,
  progress,
}: Props) {
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="p-3 rounded bg-slate-100">
          <BookOpen size={28} />
        </div>
        <div className="flex-1">
          <Link href={`/courses/${id}`} className="text-lg font-semibold">
            {title}
          </Link>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">{creator}</div>
            <div className="text-xs text-gray-600">{pct}%</div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

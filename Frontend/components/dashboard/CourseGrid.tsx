"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CourseGrid() {
  const { courses, userProgress } = useAppStore();

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        My Courses
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courses.map((course) => {
          const progress = userProgress.find((p) => p.courseId === course.id);
          const percentage = progress ? progress.progressPercentage : 0;

          return (
            <motion.div
              key={course.id}
              variants={item}
              className="group relative bg-card hover:bg-card/80 border border-border hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,213,255,0.1)]"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {course.price}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="text-primary font-medium">
                      {percentage}%
                    </span>
                  </div>
                  <ProgressBar value={percentage} />
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{course.modules.length} Modules</span>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

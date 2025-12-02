"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Activity, CheckCircle2 } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";

export default function RecentActivity() {
  const { courses, userProgress } = useAppStore();

  if (userProgress.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/30"
      >
        <p className="text-muted-foreground">
          No activity yet. Start a course to see your progress!
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Recent Activity
      </h2>

      <div className="space-y-4">
        {userProgress.map((p, index) => {
          const course = courses.find((c) => c.id === p.courseId);
          if (!course) return null;

          return (
            <motion.div
              key={p.courseId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 hover:border-primary/30 transition-colors"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-card-foreground">
                    {course.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {p.completedModules.length} / {course.modules.length}{" "}
                    modules
                  </span>
                </div>
                <ProgressBar value={p.progressPercentage} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  description: string;
  creator: string;
  duration?: string;
  moduleCount: number;
}

export default function CourseHeader({
  title,
  description,
  creator,
  duration = "4h 30m", // Mock duration if not available
  moduleCount,
}: CourseHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            Course
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{creator}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              {duration} • {moduleCount} Modules
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

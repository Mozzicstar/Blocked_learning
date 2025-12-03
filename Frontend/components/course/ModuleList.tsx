"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module {
  id: string;
  title: string;
  duration: string;
}

interface ModuleListProps {
  modules: Module[];
  activeModuleId?: string;
  completedModuleIds: string[];
  onModuleSelect: (index: number) => void;
}

export default function ModuleList({
  modules,
  activeModuleId,
  completedModuleIds,
  onModuleSelect,
}: ModuleListProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Course Content</h3>
      </div>
      <div className="divide-y divide-border">
        {modules.map((module, index) => {
          const isActive = module.id === activeModuleId;
          const isCompleted = completedModuleIds.includes(module.id);
          const isLocked =
            !isCompleted &&
            index > 0 &&
            !completedModuleIds.includes(modules[index - 1].id);

          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isLocked && onModuleSelect(index)}
              disabled={isLocked}
              className={cn(
                "w-full p-4 flex items-center gap-3 text-left transition-all hover:bg-muted/50",
                isActive && "bg-primary/5 border-l-2 border-primary",
                isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <PlayCircle
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium truncate",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {module.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {module.duration}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

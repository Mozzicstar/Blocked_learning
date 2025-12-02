"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import ModulePlayer from "@/components/ModulePlayer";
import MentorPanel from "@/components/MentorPanel";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CoursePage() {
  const params = useParams();
  const {
    currentCourse,
    fetchCourseById,
    isLoadingCourses,
    updateUserProgress,
    userProgress,
  } = useAppStore();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchCourseById(params.id as string);
    }
  }, [params.id, fetchCourseById]);

  if (isLoadingCourses || !currentCourse) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeModule = currentCourse.modules[activeModuleIndex];
  const isCompleted = userProgress.some(
    (p) =>
      p.courseId === currentCourse.id &&
      p.completedModules.includes(activeModule.id)
  );

  const handleModuleComplete = async () => {
    await updateUserProgress(currentCourse.id, activeModule.id, 100);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{currentCourse.title}</h1>
          <p className="text-muted-foreground">{currentCourse.description}</p>
        </div>

        <ModulePlayer
          module={activeModule}
          onComplete={handleModuleComplete}
          isCompleted={isCompleted}
        />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Course Modules</h2>
          <ScrollArea className="h-[400px] border rounded-lg p-4">
            <div className="space-y-2">
              {currentCourse.modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    index === activeModuleIndex
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setActiveModuleIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {index + 1}. {module.title}
                    </span>
                    {/* Add lock icon if not accessible */}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="lg:col-span-1">
        <MentorPanel context={`Course: ${currentCourse.title}\nModule: ${activeModule.title}\nContent: ${activeModule.content}`} />
      </div>
    </div>
  );
}

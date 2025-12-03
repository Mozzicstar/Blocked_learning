"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import ModulePlayer from "@/components/ModulePlayer";
import MentorPanel from "@/components/MentorPanel";
import CourseHeader from "@/components/course/CourseHeader";
import ModuleList from "@/components/course/ModuleList";
import LoadingSkeleton from "@/components/LoadingSkeleton";

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

  if (!currentCourse) {
    return <LoadingSkeleton rows={4} />;
  }

  const activeModule = currentCourse.modules[activeModuleIndex];
  const progress = userProgress.find((p) => p.courseId === currentCourse.id);
  const completedModuleIds = progress?.completedModules || [];
  const isCompleted = completedModuleIds.includes(activeModule.id);

  const handleModuleComplete = async () => {
    // Calculate new progress percentage
    const total = currentCourse.modules.length;
    const currentCompleted = completedModuleIds.length;
    const newCompleted = isCompleted ? currentCompleted : currentCompleted + 1;
    const percentage = Math.round((newCompleted / total) * 100);

    await updateUserProgress(currentCourse.id, activeModule.id, percentage);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <CourseHeader
          title={currentCourse.title}
          description={currentCourse.description}
          creator={currentCourse.creator}
          moduleCount={currentCourse.modules.length}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <ModulePlayer
                module={activeModule}
                onComplete={handleModuleComplete}
                isCompleted={isCompleted}
              />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ModuleList
              modules={currentCourse.modules}
              activeModuleId={activeModule.id}
              completedModuleIds={completedModuleIds}
              onModuleSelect={setActiveModuleIndex}
            />

            <MentorPanel
              context={`Course: ${currentCourse.title}\nModule: ${activeModule.title}\nContent: ${activeModule.content}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

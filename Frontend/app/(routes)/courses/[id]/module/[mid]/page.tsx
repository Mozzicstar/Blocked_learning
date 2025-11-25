// app/courses/[id]/module/[mid]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ModulePlayer from "@/components/ModulePlayer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { api } from "@/lib/api";
import useCourseStore from "@/stores/useCourseStore";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";

export default function ModulePage({}: {}) {
  const params = useParams();
  const courseId = params?.id as string;
  const mid = params?.mid as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState<any | null>(null);
  const course = useCourseStore((s) =>
    s.courses.find((c) => c.id === courseId)
  );
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    let mounted = true;
    api
      .getModule(courseId, mid)
      .then((m) => {
        if (!mounted) return;
        setModule(m);
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [courseId, mid]);

  useEffect(() => {
    if (!course) return;
    const total = course.modules.length;
    const completed = course.modules.filter((m) => m.completed).length;
    setProgressPct(Math.round((completed / total) * 100));
  }, [course]);

  if (loading || !module) return <LoadingSkeleton rows={4} />;

  const currentIndex = course?.modules.findIndex((m) => m.id === mid) ?? -1;
  const nextModule = course?.modules?.[currentIndex + 1];

  async function handleComplete() {
    try {
      await api.completeModule(mid);
      toast.success("Module completed!");
      // refresh local course store by re-fetching course (lightweight)
      const updated = await api.getCourse(courseId);
      useCourseStore
        .getState()
        ._seedReplace?.(
          useCourseStore
            .getState()
            .courses.map((c) => (c.id === updated.id ? updated : c))
        );
      // update progress bar
      const total = updated.modules.length;
      const completedCount = updated.modules.filter(
        (m: any) => m.completed
      ).length;
      setProgressPct(Math.round((completedCount / total) * 100));
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to complete module");
    }
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{module.title}</h2>
        <div className="mt-2">
          <ProgressBar value={progressPct} />
        </div>
      </div>

      <ModulePlayer type={module.type} content={module.content} />

      <div className="mt-4 flex items-center gap-3 justify-between w-full mt-auto">
        <Button onClick={handleComplete}>Mark as completed</Button>

        {nextModule ? (
          <Button
            variant={"outline"}
            onClick={() =>
              router.push(`/courses/${courseId}/module/${nextModule.id}`)
            }
          >
            Next module → {nextModule.title}
          </Button>
        ) : (
          <div className="text-sm text-gray-500">This is the last module.</div>
        )}
      </div>
    </section>
  );
}

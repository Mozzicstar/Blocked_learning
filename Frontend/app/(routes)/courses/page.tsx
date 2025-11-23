// app/courses/page.tsx
"use client";
import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
// import LoadingSkeleton from "@/components/LoadingSkeleton";
import { api } from "@/lib/api";
import useCourseStore from "@/stores/useCourseStore";

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const setCourses = useCourseStore((s) => s._seedReplace);
  const courses = useCourseStore((s) => s.courses);

  useEffect(() => {
    let mounted = true;
    api
      .getCourses()
      .then((data) => {
        if (!mounted) return;
        // optionally sync into zustand
        setCourses?.(data);
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [setCourses]);

  // if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((c) => (
          <CourseCard
            key={c.id}
            id={c.id}
            title={c.title}
            description={c.description}
            creator={c.creator}
            progress={{
              completed: c.modules.filter((m: any) => m.completed).length,
              total: c.modules.length,
            }}
          />
        ))}
      </div>
    </section>
  );
}

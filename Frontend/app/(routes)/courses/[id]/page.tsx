// app/courses/[id]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import useCourseStore from "@/stores/useCourseStore";
import CourseHeader from "@/components/CourseHeader";
import ModuleItem from "@/components/ModuleItem";
import LoadingSkeleton from "@/components/LoadingSkeleton";
// import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function CourseDetailPage({}: {}) {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const course = useCourseStore((s) => s.courses.find((c) => c.id === id));
  const setCourses = useCourseStore((s) => s._seedReplace);

  useEffect(() => {
    let mounted = true;
    api
      .getCourse(id)
      .then((data) => {
        if (!mounted) return;
        // replace the full store to keep UI consistent
        const updated = useCourseStore
          .getState()
          .courses.map((c) => (c.id === data.id ? data : c));

        setCourses?.(updated);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id, setCourses]);

  if (loading && !course) return <LoadingSkeleton rows={6} />;

  if (!course) return <div>Course not found.</div>;

  return (
    <section>
      <CourseHeader
        title={course.title}
        description={course.description}
        tags={course.tags}
        difficulty={course.difficulty}
      />

      <div className="bg-white rounded p-4">
        <h3 className="font-semibold mb-3">Modules</h3>
        <ul>
          {course.modules.map((m) => (
            <ModuleItem
              key={m.id}
              courseId={course.id}
              id={m.id}
              title={m.title}
              duration={m.duration}
              completed={m.completed}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

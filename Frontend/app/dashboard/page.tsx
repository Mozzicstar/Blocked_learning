// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import useCourseStore from "@/stores/useCourseStore";
import CourseCard from "@/components/CourseCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProgressBar from "@/components/ProgressBar";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const courses = useCourseStore((s) => s.courses);

  useEffect(() => {
    api
      .getDashboard()
      .then((data) => setDashboard(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {courses.map((c) => {
          const completed = c.modules.filter((m: any) => m.completed).length;
          const total = c.modules.length;
          return (
            <div key={c.id} className="bg-white p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.creator}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((completed / total) * 100)}%
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar value={Math.round((completed / total) * 100)} />
              </div>
              <div className="mt-3">
                <a
                  className="text-sm text-emerald-600"
                  href={`/courses/${c.id}`}
                >
                  Continue
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        {dashboard?.progress?.length ? (
          <ul className="space-y-2">
            {dashboard.progress.map((p: any) => (
              <li key={p.courseId} className="bg-white p-3 rounded shadow-sm">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    {courses.find((c: any) => c.id === p.courseId)?.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.completedModules}/{p.totalModules} modules
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={Math.round(
                      (p.completedModules / p.totalModules) * 100
                    )}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">
            No activity yet. Start a course!
          </div>
        )}
      </div>
    </section>
  );
}

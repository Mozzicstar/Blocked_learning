// app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import CourseCard from "@/components/CourseCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";

export default function DashboardPage() {
  const { 
    courses, 
    fetchCourses, 
    isLoadingCourses,
    userProgress,
    fetchUserProgress,
    isLoadingProgress 
  } = useAppStore();

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, [fetchCourses, fetchUserProgress]);

  if (isLoadingCourses || isLoadingProgress) return <LoadingSkeleton rows={4} />;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Your Dashboard</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Total Courses</div>
          <div className="text-2xl font-bold">{courses.length}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold">{userProgress?.completedCourses || 0}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">XP Earned</div>
          <div className="text-2xl font-bold">{userProgress?.totalXp || 0}</div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            No courses available yet. Check back soon!
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/courses" className="block">
          <div className="bg-primary/10 hover:bg-primary/20 p-4 rounded-lg border border-primary/20 transition-colors">
            <div className="font-semibold">Browse All Courses</div>
            <div className="text-sm text-muted-foreground">Explore blockchain learning paths</div>
          </div>
        </Link>
        <Link href="/mentor" className="block">
          <div className="bg-secondary/10 hover:bg-secondary/20 p-4 rounded-lg border border-secondary/20 transition-colors">
            <div className="font-semibold">AI Mentor</div>
            <div className="text-sm text-muted-foreground">Get personalized help & code reviews</div>
          </div>
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import CourseCard from "@/components/CourseCard";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";

export default function CoursesPage() {
  const { courses, fetchCourses, isLoadingCourses } = useAppStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
          <p className="text-muted-foreground">
            Explore our blockchain-powered courses
          </p>
        </div>
        <SearchBar />
      </div>

      {isLoadingCourses ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

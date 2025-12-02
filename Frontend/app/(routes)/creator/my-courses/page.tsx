"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import CourseCard from "@/components/CourseCard";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyCoursesPage() {
  const { myCourses, fetchMyCourses, isUploading, user } = useAppStore();

  useEffect(() => {
    if (user?.walletAddress) {
      fetchMyCourses(user.walletAddress);
    }
  }, [user, fetchMyCourses]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Manage your created content
          </p>
        </div>
        <Link href="/creator/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {isUploading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

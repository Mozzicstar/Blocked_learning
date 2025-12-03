"use client";

import CourseEditor from "@/components/creator/CourseEditor";

export default function UploadCoursePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Create New Course
        </h1>
        <p className="text-muted-foreground text-lg">
          Share your expertise with the Web3 community
        </p>
      </div>

      <CourseEditor />
    </div>
  );
}

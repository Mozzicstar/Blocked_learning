"use client";

import { useState, useEffect } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CourseGrid from "@/components/dashboard/CourseGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for effect
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <section className="min-h-screen bg-background p-6 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <DashboardHeader />
        <CourseGrid />
        <RecentActivity />
      </div>
    </section>
  );
}

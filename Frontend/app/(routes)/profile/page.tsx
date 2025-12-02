"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user, userProgress, courses } = useAppStore();
  const [saving, setSaving] = useState(false);

  // Calculate progress summary based on userProgress and courses
  const progressSummary = userProgress.map((p) => {
    const course = courses.find((c) => c.id === p.courseId);
    return {
      title: course?.title || "Unknown Course",
      completed: p.completedModules.length,
      total: course?.modules.length || 0,
    };
  });

  const totalCompleted = progressSummary.reduce(
    (acc, c) => acc + c.completed,
    0
  );
  const totalModules = progressSummary.reduce((acc, c) => acc + c.total, 0);

  async function handleSave() {
    setSaving(true);
    try {
      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferences saved");
    } catch (err) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your preferences and view learning stats
          </p>
        </div>
        <div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {user?.walletAddress ? `User ${user.walletAddress.slice(0, 6)}` : "Guest"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.walletAddress || "No wallet connected"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Preferred Categories</h3>
                {/* Placeholder for PreferenceSelector */}
                <div className="text-sm text-muted-foreground">
                  Preferences selection coming soon...
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium mb-3">Learning Activity</h3>
              <ul className="space-y-2">
                {progressSummary.length === 0 && (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                )}
                {progressSummary.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <div>{p.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {p.completed}/{p.total}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed Modules</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCompleted}</div>
                    <p className="text-xs text-muted-foreground">{totalModules} available</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Streak (days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-accent">3</div>
                    <p className="text-xs text-muted-foreground">Current streak</p>
                </CardContent>
            </Card>
        </aside>
      </div>
    </section>
  );
}

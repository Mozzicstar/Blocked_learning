// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import useCourseStore from "@/stores/useCourseStore";
import PreferenceSelector from "@/components/PreferenceSelector";
import StatsCard from "@/components/StatCard";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const updatePrefs = useUserStore((s) => s.updatePreferences);
  const [saving, setSaving] = useState(false);
  const courses = useCourseStore((s) => s.courses);

  const progressSummary = courses.map((c) => ({
    title: c.title,
    completed: c.modules.filter((m) => m.completed).length,
    total: c.modules.length,
  }));

  const totalCompleted = progressSummary.reduce(
    (acc, c) => acc + c.completed,
    0
  );
  const totalModules = progressSummary.reduce((acc, c) => acc + c.total, 0);

  async function handleSave() {
    setSaving(true);
    try {
      const prefs = user?.interests ?? [];
      await api.updateUserPreferences(prefs);
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
          <p className="text-sm text-gray-600">
            Manage your preferences and view learning stats
          </p>
        </div>
        <div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div
            className="bg-white p-4 rounded border"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">
                  {user?.name ?? "Guest"}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.wallet ?? "No wallet connected"}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Preferred Categories</h3>
              <PreferenceSelector />
            </div>
          </div>

          <div
            className="bg-white p-4 rounded border"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-medium mb-3">Learning Activity</h3>
            <ul className="space-y-2">
              {progressSummary.map((p) => (
                <li key={p.title} className="flex justify-between">
                  <div>{p.title}</div>
                  <div className="text-sm text-gray-600">
                    {p.completed}/{p.total}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <StatsCard
            title="Completed Modules"
            value={totalCompleted}
            subtitle={`${totalModules} available`}
          />
          <StatsCard
            title="Streak (days)"
            value={3}
            subtitle="Current streak"
            accent="accent"
          />
          <StatsCard
            title="Saved Courses"
            value={user?.savedCourses?.length ?? 0}
            subtitle="Bookmarked"
            accent="destructive"
          />
        </aside>
      </div>
    </section>
  );
}

// components/PreferenceSelector.tsx
"use client";

import React from "react";
import useCategoryStore from "@/stores/useCategoryStore";
import useUserStore from "@/stores/useUserStore";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function PreferenceSelector() {
  const categories = useCategoryStore((s) => s.categories);
  const user = useUserStore((s) => s.user);
  const updatePrefs = useUserStore((s) => s.updatePreferences);

  const selected = new Set(user?.interests ?? []);

  function toggle(name: string) {
    const newSet = new Set(selected);
    if (newSet.has(name)) newSet.delete(name);
    else newSet.add(name);
    const arr = Array.from(newSet);
    updatePrefs(arr);
    toast.success("Preferences updated");
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const isChecked = selected.has(c.name);
        return (
          <button
            key={c.id}
            className={`px-3 py-1 rounded-lg border text-sm flex items-center gap-2`}
            onClick={() => toggle(c.name)}
            style={{
              borderColor: isChecked ? "var(--primary)" : "var(--border)",
              background: isChecked ? "var(--primary)" : "transparent",
              color: isChecked
                ? "var(--primary-foreground)"
                : "var(--foreground)",
            }}
          >
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// components/SearchBar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSearchStore from "@/stores/useSearchStore";
import useCategoryStore from "@/stores/useCategoryStore";
import { api } from "@/lib/api";
import { Search } from "lucide-react";

export default function SearchBar() {
  const setQuery = useSearchStore((s) => s.setQuery);
  const setFilters = useSearchStore((s) => s.setFilters);
  const runSearch = useSearchStore((s) => s.runSearch);
  const categories = useCategoryStore((s) => s.categories);

  const [localQuery, setLocalQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<
    "Beginner" | "Intermediate" | "Advanced" | undefined
  >(undefined);

  // debounce localQuery -> global
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(localQuery);
      // trigger api-backed search for results (mocked)
      api.searchCourses(localQuery, { category, difficulty }).then(() => {
        // lib/search updates search store internally in our mock; also runSearch is available
        runSearch();
      });
    }, 220);
    return () => clearTimeout(t);
  }, [localQuery, category, difficulty, setQuery, runSearch]);

  useEffect(() => {
    setFilters({ category, difficulty });
  }, [category, difficulty, setFilters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col sm:flex-row gap-3 items-stretch"
    >
      <div className="flex-1">
        <div className="relative">
          <Input
            value={localQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocalQuery(e.target.value)
            }
            placeholder="Search courses, modules, topics..."
            className="pl-10"
            style={{
              background: "var(--muted)",
              color: "var(--foreground)",
              borderColor: "var(--border)",
            }}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Search />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Select onValueChange={(v) => setCategory(v || undefined)}>
          <SelectTrigger
            className="w-48"
            style={{ borderColor: "var(--border)" }}
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) =>
            setDifficulty((v as SearchFilters["difficulty"]) || undefined)
          }
        >
          <SelectTrigger
            className="w-40"
            style={{ borderColor: "var(--border)" }}
          >
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}

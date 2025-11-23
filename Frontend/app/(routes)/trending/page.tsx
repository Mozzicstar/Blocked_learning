// app/trending/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function TrendingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTrending()
      .then((r) => {
        // sort by engagementScore desc
        const sorted = r.sort(
          (a: any, b: any) => b.engagementScore - a.engagementScore
        );
        setItems(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Trending</h2>
      <div className="space-y-3">
        {items.map((it) => (
          <article key={it.id} className="bg-white p-3 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">{it.tag}</div>
              </div>
              <div className="text-xs text-gray-600">
                {it.engagementScore} pts
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{it.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

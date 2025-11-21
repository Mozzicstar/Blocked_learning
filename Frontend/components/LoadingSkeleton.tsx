// components/LoadingSkeleton.tsx
"use client";

export default function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
      ))}
    </div>
  );
}

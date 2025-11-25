// components/ProgressBar.tsx
"use client";

type Props = {
  value: number; // 0..100
  className?: string;
};

export default function ProgressBar({ value, className = "" }: Props) {
  return (
    <div
      className={`w-full bg-accent-lime-500 rounded h-3 overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-emerald-500 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

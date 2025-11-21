// components/ModuleItem.tsx
"use client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

type Props = {
  courseId: string;
  id: string;
  title: string;
  duration?: string;
  completed?: boolean;
};

export default function ModuleItem({
  id,
  title,
  duration,
  completed,
  courseId,
}: Props) {
  return (
    <li className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div>
        <Link
          href={`/courses/${courseId}/module/${id}`}
          className="font-medium"
        >
          {title}
        </Link>
        <div className="text-xs text-gray-500">{duration}</div>
      </div>
      <div>
        {completed ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <div className="text-xs text-gray-400">Not done</div>
        )}
      </div>
    </li>
  );
}

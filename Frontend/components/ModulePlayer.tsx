// components/ModulePlayer.tsx
"use client";
import { useEffect } from "react";

type Props = {
  type: "video" | "text";
  content: string;
};

export default function ModulePlayer({ type, content }: Props) {
  useEffect(() => {
    // any initialization
  }, [content]);

  if (type === "video") {
    return (
      <div className="w-full bg-black aspect-video">
        <video src={content} controls className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="prose max-w-none mt-4">
      <p>{content}</p>
    </div>
  );
}

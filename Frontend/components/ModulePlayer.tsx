"use client";

import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

interface ModulePlayerProps {
  module: any;
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ModulePlayer({
  module,
  onComplete,
  isCompleted,
}: ModulePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reset video when module changes
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [module]);

  const handleEnded = () => {
    onComplete();
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          onEnded={handleEnded}
          poster={module.thumbnailUrl}
        >
          <source src={module.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{module.title}</h2>
        {isCompleted && (
          <div className="flex items-center text-green-600 gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
      </div>
      <p className="text-muted-foreground">{module.content}</p>
    </div>
  );
}

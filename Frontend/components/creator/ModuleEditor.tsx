"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import VideoUploader from "./VideoUploader";
import { motion } from "framer-motion";

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  videoFile: File | null;
}

interface ModuleEditorProps {
  module: ModuleData;
  index: number;
  onChange: (id: string, data: Partial<ModuleData>) => void;
  onRemove: (id: string) => void;
}

export default function ModuleEditor({
  module,
  index,
  onChange,
  onRemove,
}: ModuleEditorProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card border border-border rounded-xl p-6 relative group"
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-hover:text-muted-foreground/50 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-6 h-6" />
      </div>

      <div className="pl-6 space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">Module {index + 1}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(module.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Module Title</Label>
            <Input
              value={module.title}
              onChange={(e) => onChange(module.id, { title: e.target.value })}
              placeholder="e.g., Introduction to Smart Contracts"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={module.description}
              onChange={(e) =>
                onChange(module.id, { description: e.target.value })
              }
              placeholder="Briefly describe what students will learn..."
              className="bg-background resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Video Content</Label>
            <VideoUploader
              currentFile={module.videoFile}
              onUpload={(file) => onChange(module.id, { videoFile: file })}
              onRemove={() => onChange(module.id, { videoFile: null })}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

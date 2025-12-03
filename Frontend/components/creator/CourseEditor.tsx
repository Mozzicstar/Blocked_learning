"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowRight, ArrowLeft, Save, Loader2 } from "lucide-react";
import ModuleEditor, { ModuleData } from "./ModuleEditor";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

export default function CourseEditor() {
  const router = useRouter();
  const { uploadCourse, isUploading } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [modules, setModules] = useState<ModuleData[]>([
    { id: "1", title: "", description: "", videoFile: null },
  ]);

  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        description: "",
        videoFile: null,
      },
    ]);
  };

  const handleModuleChange = (id: string, data: Partial<ModuleData>) => {
    setModules(modules.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  const handleRemoveModule = (id: string) => {
    if (modules.length > 1) {
      setModules(modules.filter((m) => m.id !== id));
    } else {
      toast.error("Course must have at least one module");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate
      if (!courseData.title || !courseData.price) {
        toast.error("Please fill in course details");
        return;
      }
      if (modules.some((m) => !m.title || !m.videoFile)) {
        toast.error("All modules must have a title and video");
        return;
      }

      await uploadCourse({
        ...courseData,
        modules: modules.map((m) => ({
          title: m.title,
          description: m.description,
          // In a real app, we'd upload the file and get a URL here
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          duration: "10:00", // Mock duration
        })),
      });

      toast.success("Course published successfully!");
      router.push("/dashboard"); // Redirect to dashboard for now
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-20 h-1 transition-colors ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Course Details</h2>
              <p className="text-muted-foreground">
                Basic information about your course
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                  placeholder="Mastering Web3 Development"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                  placeholder="What will students learn in this course?"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={courseData.price}
                  onChange={(e) =>
                    setCourseData({ ...courseData, price: e.target.value })
                  }
                  placeholder="0.05"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} size="lg">
                Next: Curriculum <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Curriculum</h2>
              <p className="text-muted-foreground">
                Add modules and video lessons
              </p>
            </div>

            <div className="space-y-4">
              {modules.map((module, index) => (
                <ModuleEditor
                  key={module.id}
                  module={module}
                  index={index}
                  onChange={handleModuleChange}
                  onRemove={handleRemoveModule}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={handleAddModule}
              className="w-full py-8 border-dashed"
            >
              <Plus className="mr-2 w-4 h-4" /> Add Module
            </Button>

            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} size="lg">
                Next: Review <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Review & Publish</h2>
              <p className="text-muted-foreground">
                Double check your course details
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-border pb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">{courseData.title}</h3>
                  <p className="text-muted-foreground">
                    {courseData.description}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {courseData.price} ETH
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">
                  Curriculum ({modules.length} Modules)
                </h4>
                <div className="space-y-2">
                  {modules.map((m, i) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <span className="font-medium">
                        {i + 1}. {m.title}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {m.videoFile ? "Video Uploaded" : "Missing Video"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-primary hover:bg-primary/90"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 w-4 h-4" /> Publish Course
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

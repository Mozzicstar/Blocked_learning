"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrendingPage() {
  const { trendingTopics, fetchTrending, isTrendingLoading } = useAppStore();

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trending Topics</h1>
        <p className="text-muted-foreground">
          See what the community is learning right now
        </p>
      </div>

      {isTrendingLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingTopics.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  #{index + 1} Trending
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.topic}</div>
                <p className="text-xs text-muted-foreground">
                  {item.count} active learners
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

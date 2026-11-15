"use client";

import React from "react";
import { Video } from "@/lib/types";
import { VideoCard } from "./VideoCard";
import { Icons } from "../ui/Icons";

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function VideoGrid({
  videos,
  isLoading = false,
  emptyTitle = "No videos found",
  emptyDescription = "Try searching for a different keyword or explore another category.",
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="aspect-video w-full rounded-xl bg-zinc-900" />
            <div className="flex gap-3 px-1">
              <div className="h-9 w-9 rounded-full bg-zinc-900 flex-shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-zinc-900" />
                <div className="h-3 w-1/2 rounded bg-zinc-900" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-16 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mb-4">
          <Icons.Film size={26} />
        </div>
        <h3 className="text-lg font-semibold text-zinc-200">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id || video.youtubeId} video={video} />
      ))}
    </div>
  );
}

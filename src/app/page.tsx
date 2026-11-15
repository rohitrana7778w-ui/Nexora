"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CategoryPills } from "@/components/video/CategoryPills";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Video, VideoCategory } from "@/lib/types";
import { CURATED_VIDEOS } from "@/lib/youtube";
import { Icons } from "@/components/ui/Icons";
import { ChildModeBanner } from "@/components/profiles/ChildModeBanner";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("All");
  const [videos, setVideos] = useState<Video[]>(CURATED_VIDEOS);

  useEffect(() => {
    if (selectedCategory === "All") {
      setVideos(CURATED_VIDEOS);
    } else {
      setVideos(
        CURATED_VIDEOS.filter(
          (v) => v.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory]);

  const featuredVideo = CURATED_VIDEOS[0];

  return (
    <div className="space-y-6">
      {/* Active Child Safe Mode Banner */}
      <ChildModeBanner />

      {/* Featured Spotlight Banner */}
      {selectedCategory === "All" && featuredVideo && (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-red-950/30 p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                <Icons.Sparkles size={14} />
                <span>Featured Stream</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {featuredVideo.title}
              </h1>
              <p className="line-clamp-2 text-sm text-zinc-400">
                {featuredVideo.description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/watch?v=${featuredVideo.youtubeId}`}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
                >
                  <Icons.Play size={16} className="fill-current" />
                  <span>Watch Now</span>
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-800/80 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                >
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>

            <Link
              href={`/watch?v=${featuredVideo.youtubeId}`}
              className="relative aspect-video w-full md:w-80 overflow-hidden rounded-xl bg-zinc-800 shadow-md group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                  <Icons.Play size={20} className="fill-current translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-xs font-medium text-white">
                {featuredVideo.duration}
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Category Pills Header */}
      <div className="sticky top-16 z-30 bg-zinc-950/95 py-2 backdrop-blur-md">
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Main Video Feed */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{selectedCategory === "All" ? "Recommended Videos" : selectedCategory}</span>
            <span className="text-xs font-medium text-zinc-500 rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5">
              {videos.length} videos
            </span>
          </h2>
        </div>

        <VideoGrid videos={videos} />
      </div>
    </div>
  );
}

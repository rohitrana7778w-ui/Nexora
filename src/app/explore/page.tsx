"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, CURATED_VIDEOS } from "@/lib/youtube";
import { VideoCategory, Video } from "@/lib/types";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Icons } from "@/components/ui/Icons";

function ExploreContent() {
  const searchParams = useSearchParams();
  const categoryParam = (searchParams.get("category") as VideoCategory) || "All";

  const [activeCategory, setActiveCategory] = useState<VideoCategory>(categoryParam);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (activeCategory === "All") {
      setVideos(CURATED_VIDEOS);
    } else {
      setVideos(
        CURATED_VIDEOS.filter(
          (v) => v.category.toLowerCase() === activeCategory.toLowerCase()
        )
      );
    }
  }, [activeCategory]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return Icons.GraduationCap;
      case "Laptop":
        return Icons.Laptop;
      case "Gamepad2":
        return Icons.Gamepad2;
      case "Trophy":
        return Icons.Trophy;
      case "Music":
        return Icons.Music;
      case "Film":
        return Icons.Film;
      case "Atom":
        return Icons.Atom;
      default:
        return Icons.Compass;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Icons.Compass className="text-red-500" size={28} />
          <span>Explore Categories</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Discover vetted, high-quality streams organized across top creative and academic categories.
        </p>
      </div>

      {/* Category Banner Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.filter((c) => c.id !== "All").map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 border ${
                isSelected
                  ? "border-red-500 bg-zinc-900 shadow-lg shadow-red-500/10 scale-[1.02]"
                  : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <div
                className={`absolute top-0 right-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-gradient-to-br ${cat.colorGradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}
              />

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.colorGradient} text-white shadow-md mb-3`}
              >
                <Icon size={20} />
              </div>

              <h3 className="text-base font-semibold text-white group-hover:text-red-400 transition-colors">
                {cat.label}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Category Video Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              {activeCategory === "All" ? "All Streams" : `${activeCategory} Videos`}
            </span>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
              {videos.length} videos
            </span>
          </div>

          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="text-xs text-zinc-400 hover:text-white transition"
            >
              Reset to All
            </button>
          )}
        </div>

        <VideoGrid videos={videos} />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-zinc-500">
          Loading explore categories...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

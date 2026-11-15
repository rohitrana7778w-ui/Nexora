"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Video } from "@/lib/types";
import { getVideos } from "@/lib/youtube";
import { VideoCard } from "@/components/video/VideoCard";
import { Icons } from "@/components/ui/Icons";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      try {
        const results = await getVideos({ searchQuery: query });
        setVideos(results);
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Header and Results count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Icons.Search size={22} className="text-red-500" />
            <span>Search results for &ldquo;{query || "All"}&rdquo;</span>
          </h1>
          <p className="mt-0.5 text-xs text-zinc-400">
            Found {videos.length} matching streams
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              viewMode === "list"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              viewMode === "grid"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent mb-3" />
          <p className="text-sm">Searching SafeStream catalog...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
          <Icons.Search size={32} className="text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">
            No results found for &ldquo;{query}&rdquo;
          </h3>
          <p className="mt-1 text-sm text-zinc-500 max-w-md">
            Try checking for spelling errors or try more general terms like &quot;React&quot;, &quot;Science&quot;, or &quot;Gaming&quot;.
          </p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4 max-w-4xl">
          {videos.map((video) => (
            <VideoCard key={video.id || video.youtubeId} video={video} layout="horizontal" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard key={video.id || video.youtubeId} video={video} layout="grid" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-zinc-500">
          Loading search results...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

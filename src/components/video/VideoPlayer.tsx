"use client";

import React, { useState } from "react";

interface VideoPlayerProps {
  youtubeId: string;
  title?: string;
  autoplay?: boolean;
}

export function VideoPlayer({
  youtubeId,
  title = "YouTube Video Player",
  autoplay = true,
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // SafeStream YouTube embed with permitted parameters
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=${
    autoplay ? "1" : "0"
  }&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-zinc-800">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-xs text-zinc-500 font-medium">Loading SafeStream Player...</span>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        className="h-full w-full border-0"
      />
    </div>
  );
}

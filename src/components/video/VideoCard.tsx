"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Video } from "@/lib/types";
import { Icons } from "../ui/Icons";
import { LocalStore } from "@/lib/storage";
import { classifyVideoContent } from "@/lib/moderation/classifier";
import { useUserProfile } from "@/context/UserProfileContext";
import { useChildProfile } from "@/context/ChildProfileContext";
import { useRouter } from "next/navigation";

interface VideoCardProps {
  video: Video;
  layout?: "grid" | "horizontal";
  onRemove?: () => void;
  showRemove?: boolean;
}

export function VideoCard({
  video,
  layout = "grid",
  onRemove,
  showRemove = false,
}: VideoCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();
  const { effectiveAgeGroup } = useUserProfile();
  const { activeProfile } = useChildProfile();

  const currentGroup = activeProfile
    ? activeProfile.age < 13
      ? "child"
      : "teen"
    : effectiveAgeGroup;

  const { flaggedCategories } = classifyVideoContent({
    title: video.title,
    description: video.description,
    tags: video.tags,
    category: video.category,
  });

  const isRestrictedForMe =
    currentGroup !== "adult" &&
    flaggedCategories.some((cat) =>
      currentGroup === "child"
        ? true
        : ["adult", "drugs", "tobacco", "gambling", "dangerous_challenges", "violence"].includes(cat)
    );

  useEffect(() => {
    setIsSaved(LocalStore.isSaved(video.youtubeId));

    const handleStorageUpdate = () => {
      setIsSaved(LocalStore.isSaved(video.youtubeId));
    };

    window.addEventListener("safestream_storage_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("safestream_storage_updated", handleStorageUpdate);
    };
  }, [video.youtubeId]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = LocalStore.toggleSave(video);
    setIsSaved(nextSaved);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  if (layout === "horizontal") {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-4 rounded-xl p-2 transition hover:bg-zinc-900/60">
        <Link
          href={`/watch?v=${video.youtubeId}`}
          onClick={(e) => {
            if (isRestrictedForMe) {
              e.preventDefault();
              router.push(`/watch?v=${video.youtubeId}`);
            }
          }}
          className="relative aspect-video w-full sm:w-64 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-900"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {video.duration}
          </div>
          {isRestrictedForMe && (
            <span className="absolute top-2 left-2 rounded-full bg-red-600/95 border border-red-400 text-white px-2 py-0.5 text-[9px] font-bold shadow-md">
              🛡️ Restricted ({currentGroup})
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/watch?v=${video.youtubeId}`}
                onClick={(e) => {
                  if (isRestrictedForMe) {
                    e.preventDefault();
                    router.push(`/watch?v=${video.youtubeId}`);
                  }
                }}
              >
                <h3 className="line-clamp-2 text-base font-semibold text-zinc-100 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h3>
              </Link>

              <div className="flex items-center gap-1">
                {showRemove ? (
                  <button
                    onClick={handleRemove}
                    title="Remove"
                    className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition"
                  >
                    <Icons.Trash2 size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleToggleSave}
                    title={isSaved ? "Saved in Library" : "Save to Library"}
                    className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
                  >
                    {isSaved ? (
                      <Icons.BookmarkFilled size={18} className="text-red-500" />
                    ) : (
                      <Icons.Bookmark size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
              <span>{video.channelTitle}</span>
              <span>•</span>
              <span>{video.viewCount}</span>
              <span>•</span>
              <span>{video.publishedAt}</span>
            </div>

            <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 shadow-md">
        <Link
          href={`/watch?v=${video.youtubeId}`}
          onClick={(e) => {
            if (isRestrictedForMe) {
              e.preventDefault();
              router.push(`/watch?v=${video.youtubeId}`);
            }
          }}
          className="block h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Duration Badge */}
        <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          {video.duration}
        </div>

        {/* Age Restricted Badge */}
        {isRestrictedForMe && (
          <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-red-600/95 border border-red-400 text-white px-2 py-0.5 text-[9px] font-bold shadow-md z-10">
            🛡️ Restricted ({currentGroup})
          </span>
        )}

        {/* Quick Save Hover Action */}
        <button
          onClick={handleToggleSave}
          title={isSaved ? "Saved to Library" : "Save to Library"}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/90 hover:scale-105"
        >
          {isSaved ? (
            <Icons.BookmarkFilled size={16} className="text-red-500" />
          ) : (
            <Icons.Bookmark size={16} />
          )}
        </button>
      </div>

      {/* Video Details */}
      <div className="flex items-start gap-3 px-0.5">
        {/* Channel Avatar */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 overflow-hidden ring-1 ring-zinc-700">
          {video.channelAvatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={video.channelAvatarUrl}
              alt={video.channelTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            video.channelTitle.charAt(0).toUpperCase()
          )}
        </div>

        {/* Title and metadata */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Link href={`/watch?v=${video.youtubeId}`}>
            <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-red-400 transition-colors leading-snug">
              {video.title}
            </h3>
          </Link>

          <span className="mt-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
            {video.channelTitle}
          </span>

          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
            <span>{video.viewCount}</span>
            <span>•</span>
            <span>{video.publishedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

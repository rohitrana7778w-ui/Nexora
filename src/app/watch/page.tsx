"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Video, ModerationDecision } from "@/lib/types";
import { getVideoById, CURATED_VIDEOS } from "@/lib/youtube";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Icons } from "@/components/ui/Icons";
import { LocalStore } from "@/lib/storage";
import { ChildModeBanner } from "@/components/profiles/ChildModeBanner";
import { RestrictedVideoNotice } from "@/components/video/RestrictedVideoNotice";
import { useUserProfile } from "@/context/UserProfileContext";
import { useChildProfile } from "@/context/ChildProfileContext";

function WatchContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || CURATED_VIDEOS[0].youtubeId;

  const { checkVideoAccess } = useUserProfile();
  const { activeProfile } = useChildProfile();

  const [video, setVideo] = useState<Video | null>(null);
  const [moderationDecision, setModerationDecision] = useState<ModerationDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadVideo() {
      setLoading(true);
      try {
        const found = await getVideoById(videoId);
        setVideo(found);
        if (found) {
          // Check server-side moderation access
          const decision = await checkVideoAccess(found, activeProfile?.id);
          setModerationDecision(decision);

          if (decision.allowed) {
            LocalStore.addToHistory(found);
            setIsSaved(LocalStore.isSaved(found.youtubeId));
          }
        }
      } catch (err) {
        console.error("Error loading video", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoId, activeProfile?.id, checkVideoAccess]);

  const handleToggleSave = () => {
    if (!video) return;
    const nextSaved = LocalStore.toggleSave(video);
    setIsSaved(nextSaved);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const relatedVideos = CURATED_VIDEOS.filter((v) => v.youtubeId !== videoId).slice(0, 10);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent mb-3" />
        <p className="text-sm">Loading stream...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-white">Video not found</h2>
        <Link href="/" className="mt-4 inline-block text-red-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ChildModeBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Watch Area (Player + Details) */}
        <div className="lg:col-span-2 space-y-4">
        {/* 16:9 YouTube Embedded Player OR Restricted Content Notice */}
        {moderationDecision && !moderationDecision.allowed ? (
          <RestrictedVideoNotice decision={moderationDecision} videoTitle={video.title} />
        ) : (
          <VideoPlayer youtubeId={video.youtubeId} title={video.title} />
        )}

        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {video.title}
        </h1>

        {/* Channel Info & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-white overflow-hidden ring-1 ring-zinc-700">
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
            <div>
              <h2 className="text-base font-semibold text-white">
                {video.channelTitle}
              </h2>
              <p className="text-xs text-zinc-400">SafeStream Verified Partner</p>
            </div>
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`ml-3 rounded-full px-4 py-2 text-xs font-semibold transition ${
                isSubscribed
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  : "bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/30"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Actions: Like, Save, Share */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition border ${
                isLiked
                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icons.ThumbsUp size={16} />
              <span>{isLiked ? "Liked" : video.likeCount || "Like"}</span>
            </button>

            {/* Save to Library Button */}
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition border ${
                isSaved
                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {isSaved ? (
                <Icons.BookmarkFilled size={16} className="text-red-500" />
              ) : (
                <Icons.Bookmark size={16} />
              )}
              <span>{isSaved ? "Saved" : "Save Video"}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              {copied ? <Icons.Check size={16} className="text-green-400" /> : <Icons.Share2 size={16} />}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Description Box */}
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-4 transition-all">
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-300 mb-2">
            <span>{video.viewCount}</span>
            <span>•</span>
            <span>Uploaded {video.publishedAt}</span>
            <span>•</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400 font-medium">
              {video.category}
            </span>
          </div>

          <p
            className={`text-sm text-zinc-300 whitespace-pre-line leading-relaxed ${
              !isDescExpanded ? "line-clamp-3" : ""
            }`}
          >
            {video.description}
          </p>

          {video.tags && video.tags.length > 0 && isDescExpanded && (
            <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800">
              {video.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-zinc-800/80 px-2.5 py-1 text-xs text-red-400 hover:bg-zinc-700 hover:text-red-300 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-3 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            {isDescExpanded ? "Show less" : "...Show more"}
          </button>
        </div>
      </div>

      {/* Right Column: Related Videos */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Related Streams</h3>
        <div className="space-y-3">
          {relatedVideos.map((item) => (
            <Link
              key={item.youtubeId}
              href={`/watch?v=${item.youtubeId}`}
              className="group flex gap-3 rounded-xl p-1.5 hover:bg-zinc-900/70 transition"
            >
              <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.2 text-[10px] font-medium text-white">
                  {item.duration}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-start overflow-hidden">
                <h4 className="line-clamp-2 text-xs font-semibold text-zinc-200 group-hover:text-red-400 transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] text-zinc-400">{item.channelTitle}</p>
                <p className="text-[10px] text-zinc-500">{item.viewCount}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-zinc-500">
          Loading player...
        </div>
      }
    >
      <WatchContent />
    </Suspense>
  );
}

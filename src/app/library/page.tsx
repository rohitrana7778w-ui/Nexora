"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SavedVideo, WatchHistoryItem } from "@/lib/types";
import { LocalStore } from "@/lib/storage";
import { VideoCard } from "@/components/video/VideoCard";
import { Icons } from "@/components/ui/Icons";

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") === "history" ? "history" : "saved";

  const [activeTab, setActiveTab] = useState<"saved" | "history">(initialTab);
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [historyItems, setHistoryItems] = useState<WatchHistoryItem[]>([]);

  const loadData = () => {
    setSavedVideos(LocalStore.getSavedVideos());
    setHistoryItems(LocalStore.getHistory());
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("safestream_storage_updated", handleStorageChange);
    return () => {
      window.removeEventListener("safestream_storage_updated", handleStorageChange);
    };
  }, []);

  const handleTabChange = (tab: "saved" | "history") => {
    setActiveTab(tab);
    router.replace(`/library?tab=${tab}`);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your entire watch history?")) {
      LocalStore.clearHistory();
    }
  };

  const handleRemoveSaved = (youtubeId: string) => {
    LocalStore.removeSaved(youtubeId);
  };

  const handleRemoveHistory = (youtubeId: string) => {
    LocalStore.removeFromHistory(youtubeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Icons.Library className="text-red-500" size={28} />
            <span>Personal Library</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your saved stream bookmarks and recently viewed watch history.
          </p>
        </div>

        {/* Action button: Clear history if on history tab */}
        {activeTab === "history" && historyItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:border-red-500/40 hover:text-red-400 transition"
          >
            <Icons.Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-800/80">
        <button
          onClick={() => handleTabChange("saved")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "saved"
              ? "border-red-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Icons.Bookmark size={18} className={activeTab === "saved" ? "text-red-500" : ""} />
          <span>Saved Videos</span>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
            {savedVideos.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("history")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "history"
              ? "border-red-500 text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Icons.History size={18} className={activeTab === "history" ? "text-red-500" : ""} />
          <span>Watch History</span>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
            {historyItems.length}
          </span>
        </button>
      </div>

      {/* Tab Content: Saved Videos */}
      {activeTab === "saved" && (
        <div>
          {savedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 px-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mb-4">
                <Icons.Bookmark size={26} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-200">No saved videos yet</h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Click the bookmark button on any video to save it here and watch it whenever you want.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-500 transition"
              >
                <span>Discover Videos</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl">
              {savedVideos.map((item) => (
                <VideoCard
                  key={item.id}
                  video={item.video}
                  layout="horizontal"
                  showRemove
                  onRemove={() => handleRemoveSaved(item.video.youtubeId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Watch History */}
      {activeTab === "history" && (
        <div>
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 px-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mb-4">
                <Icons.History size={26} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-200">Your watch history is clear</h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Videos you watch on SafeStream will be automatically logged here for easy access.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-500 transition"
              >
                <span>Start Watching</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl">
              {historyItems.map((item) => (
                <VideoCard
                  key={item.id}
                  video={item.video}
                  layout="horizontal"
                  showRemove
                  onRemove={() => handleRemoveHistory(item.video.youtubeId)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-zinc-500">
          Loading your library...
        </div>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}

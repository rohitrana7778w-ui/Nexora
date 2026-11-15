import { Video, SavedVideo, WatchHistoryItem } from "./types";

const SAVED_KEY = "safestream_saved_videos";
const HISTORY_KEY = "safestream_watch_history";

export const LocalStore = {
  // Saved Videos
  getSavedVideos(): SavedVideo[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(SAVED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isSaved(youtubeId: string): boolean {
    const list = this.getSavedVideos();
    return list.some((item) => item.video.youtubeId === youtubeId);
  },

  toggleSave(video: Video, userId: string = "guest"): boolean {
    const list = this.getSavedVideos();
    const existingIndex = list.findIndex((item) => item.video.youtubeId === video.youtubeId);

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("safestream_storage_updated"));
      return false; // now unsaved
    } else {
      const newItem: SavedVideo = {
        id: `saved-${Date.now()}`,
        userId,
        videoId: video.id,
        video,
        createdAt: new Date().toISOString(),
      };
      list.unshift(newItem);
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("safestream_storage_updated"));
      return true; // now saved
    }
  },

  removeSaved(youtubeId: string): void {
    const list = this.getSavedVideos().filter((item) => item.video.youtubeId !== youtubeId);
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("safestream_storage_updated"));
  },

  // Watch History
  getHistory(): WatchHistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addToHistory(video: Video, userId: string = "guest"): void {
    if (typeof window === "undefined") return;
    try {
      let list = this.getHistory();
      // Remove previous entry of this video if present (bring to top)
      list = list.filter((item) => item.video.youtubeId !== video.youtubeId);
      const newItem: WatchHistoryItem = {
        id: `hist-${Date.now()}`,
        userId,
        videoId: video.id,
        video,
        watchedAt: new Date().toISOString(),
      };
      list.unshift(newItem);
      // Keep max 100 history items
      if (list.length > 100) list = list.slice(0, 100);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("safestream_storage_updated"));
    } catch (e) {
      console.warn("Could not save history item", e);
    }
  },

  removeFromHistory(youtubeId: string): void {
    const list = this.getHistory().filter((item) => item.video.youtubeId !== youtubeId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("safestream_storage_updated"));
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event("safestream_storage_updated"));
  },
};

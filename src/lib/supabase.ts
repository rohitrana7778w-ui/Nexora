// Supabase Client Wrapper
// Automatically connects if NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are provided.

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    null;
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

/**
 * Server-side helper to record watch history in Supabase if configured
 */
export async function recordSupabaseHistory(userId: string, videoId: string, videoData: any) {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured || !url || !anonKey) return false;

  try {
    const res = await fetch(`${url}/rest/v1/watch_history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        youtube_video_id: videoId,
        video_data: videoData,
        watched_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn("Supabase record history failed", err);
    return false;
  }
}

/**
 * Server-side helper to save/unsave video in Supabase if configured
 */
export async function toggleSupabaseSaved(userId: string, videoId: string, videoData: any) {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured || !url || !anonKey) return null;

  try {
    // Check if already saved
    const checkRes = await fetch(
      `${url}/rest/v1/saved_videos?user_id=eq.${userId}&youtube_video_id=eq.${videoId}`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      }
    );
    if (!checkRes.ok) return null;
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      // Delete
      await fetch(
        `${url}/rest/v1/saved_videos?user_id=eq.${userId}&youtube_video_id=eq.${videoId}`,
        {
          method: "DELETE",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
        }
      );
      return false; // unsaved
    } else {
      // Insert
      await fetch(`${url}/rest/v1/saved_videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          user_id: userId,
          youtube_video_id: videoId,
          video_data: videoData,
        }),
      });
      return true; // saved
    }
  } catch (err) {
    console.warn("Supabase toggle save failed", err);
    return null;
  }
}

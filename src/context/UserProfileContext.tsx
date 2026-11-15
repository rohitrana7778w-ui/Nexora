"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { UserProfile, UserProfileInput, UserAgeGroup, ModerationDecision, Video } from "@/lib/types";
import { evaluateVideoAccess } from "@/lib/moderation/classifier";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  profileCheckComplete: boolean;
  error: string | null;
  isOnboarded: boolean;
  ageGroup: UserAgeGroup;
  effectiveAge: number;
  effectiveAgeGroup: UserAgeGroup;
  saveProfile: (input: UserProfileInput) => Promise<{ success: boolean; profile?: UserProfile; error?: string }>;
  refreshProfile: () => Promise<void>;
  checkVideoAccess: (video: Video, activeChildProfileId?: string | null) => Promise<ModerationDecision>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileCheckComplete, setProfileCheckComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!isSignedIn || !user) {
      setProfile(null);
      setError(null);
      setProfileCheckComplete(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProfileCheckComplete(false);

    try {
      const res = await fetch("/api/user-profile", { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Unable to verify your Nexora profile.");
      }

      setProfile(json.profile || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to verify your Nexora profile.";
      setProfile(null);
      setError(message);
    } finally {
      setProfileCheckComplete(true);
      setLoading(false);
    }
  }, [isSignedIn, user]);

  // Initial fetch
  useEffect(() => {
    if (isUserLoaded) {
      void refreshProfile();
    }
  }, [isUserLoaded, refreshProfile]);

  // Save / Update profile
  const saveProfile = async (
    input: UserProfileInput
  ): Promise<{ success: boolean; profile?: UserProfile; error?: string }> => {
    if (!isSignedIn || !user) {
      return { success: false, error: "Authentication required." };
    }

    try {
      const res = await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.profile) {
        return { success: false, error: data.error || "Failed to save your profile." };
      }

      setProfile(data.profile);
      setError(null);
      setProfileCheckComplete(true);
      return { success: true, profile: data.profile };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to save your profile.",
      };
    }
  };

  // Video Access & Moderation Evaluator
  const checkVideoAccess = useCallback(async (
    video: Video,
    activeChildProfileId?: string | null
  ): Promise<ModerationDecision> => {
    try {
      const res = await fetch("/api/moderation/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video,
          activeChildProfileId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.decision) {
          return data.decision;
        }
      }
    } catch (err) {
      console.warn("Server moderation check failed, falling back to local evaluator", err);
    }

    // Local client-side fallback evaluator
    const effectiveAge = profile?.age || 18;
    const effectiveAgeGroup = profile?.ageGroup || "adult";

    return evaluateVideoAccess(
      {
        id: video.id || video.youtubeId,
        youtubeId: video.youtubeId,
        title: video.title,
        description: video.description,
        tags: video.tags || [],
        category: video.category,
      },
      effectiveAge,
      effectiveAgeGroup
    );
  }, [profile]);

  const effectiveAge = profile?.age ?? 18;
  const effectiveAgeGroup = profile?.ageGroup ?? "adult";
  const isOnboarded = Boolean(profile?.isOnboarded);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        profileCheckComplete,
        error,
        isOnboarded,
        ageGroup: effectiveAgeGroup,
        effectiveAge,
        effectiveAgeGroup,
        saveProfile,
        refreshProfile,
        checkVideoAccess,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}

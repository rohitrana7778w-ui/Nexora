"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { ChildProfile, CreateChildProfileInput, UpdateChildProfileInput } from "@/lib/types";
import { calculateAge, getAgeGroup } from "@/lib/child-profiles/constants";

interface ChildProfileContextType {
  profiles: ChildProfile[];
  activeProfile: ChildProfile | null;
  loading: boolean;
  error: string | null;
  isParentMode: boolean;
  createProfile: (input: CreateChildProfileInput) => Promise<{ success: boolean; profile?: ChildProfile; error?: string }>;
  updateProfile: (id: string, input: UpdateChildProfileInput) => Promise<{ success: boolean; profile?: ChildProfile; error?: string }>;
  deleteProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  selectProfile: (profileId: string | null) => void;
  refreshProfiles: () => Promise<void>;
}

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(undefined);

const LOCAL_STORAGE_PROFILES_KEY = "safestream_child_profiles_cache";
const LOCAL_STORAGE_ACTIVE_ID_KEY = "safestream_active_child_profile_id";

export function ChildProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const saveLocalActiveProfile = useCallback((profileId: string | null) => {
    if (typeof window === "undefined") return;
    if (profileId) {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, profileId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_ID_KEY);
    }
  }, []);

  // Fetch profiles from API with fallback
  const refreshProfiles = useCallback(async () => {
    if (!isSignedIn) {
      setProfiles([]);
      setActiveProfileId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/child-profiles");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.profiles)) {
          setProfiles(json.profiles);
        } else {
          setProfiles([]);
          setError(json.error || "Unable to load child profiles.");
        }
      } else {
        const json = await res.json().catch(() => ({}));
        setProfiles([]);
        setError(json.error || "Unable to load child profiles.");
      }
    } catch (err: any) {
      console.warn("Failed fetching from /api/child-profiles", err);
      setProfiles([]);
      setError(err?.message || "Unable to load child profiles.");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  // Initial load
  useEffect(() => {
    if (isUserLoaded) {
      refreshProfiles();
      if (typeof window !== "undefined") {
        const savedActiveId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_ID_KEY);
        if (savedActiveId) {
          setActiveProfileId(savedActiveId);
        }
      }
    }
  }, [isUserLoaded, refreshProfiles]);

  // Derive active profile object
  const activeProfile = activeProfileId
    ? profiles.find((p) => p.id === activeProfileId) || null
    : null;

  // Switch or select profile
  const selectProfile = (profileId: string | null) => {
    setActiveProfileId(profileId);
    if (typeof window !== "undefined") {
      saveLocalActiveProfile(profileId);
      window.dispatchEvent(new CustomEvent("safestream_active_child_changed", { detail: { profileId } }));
    }
  };

  // Create profile
  const createProfile = async (
    input: CreateChildProfileInput
  ): Promise<{ success: boolean; profile?: ChildProfile; error?: string }> => {
    if (!isSignedIn || !user) {
      return { success: false, error: "Please sign in to create a child profile." };
    }

    try {
      // 1. Send to server API
      const res = await fetch("/api/child-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (res.ok && data.success && data.profile) {
        const newProfile: ChildProfile = data.profile;
        const updatedList = [...profiles, newProfile];
        setProfiles(updatedList);
        setError(null);
        return { success: true, profile: newProfile };
      } else {
        return { success: false, error: data.error || "Failed to create child profile." };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to create child profile." };
    }
  };

  // Update profile
  const updateProfile = async (
    id: string,
    input: UpdateChildProfileInput
  ): Promise<{ success: boolean; profile?: ChildProfile; error?: string }> => {
    if (!isSignedIn) {
      return { success: false, error: "Please sign in to update a child profile." };
    }

    try {
      const res = await fetch(`/api/child-profiles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      let updatedProfile: ChildProfile;

      if (res.ok && data.success && data.profile) {
        updatedProfile = data.profile;
      } else {
        return { success: false, error: data.error || "Failed to update child profile." };
      }

      const updatedList = profiles.map((p) => (p.id === id ? updatedProfile : p));
      setProfiles(updatedList);

      return { success: true, profile: updatedProfile };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to update profile" };
    }
  };

  // Delete profile
  const deleteProfile = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSignedIn) {
      return { success: false, error: "Please sign in to delete a child profile." };
    }

    try {
      const response = await fetch(`/api/child-profiles/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || "Failed to delete child profile." };
      }

      const updatedList = profiles.filter((p) => p.id !== id);
      setProfiles(updatedList);

      if (activeProfileId === id) {
        selectProfile(null);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to delete child profile." };
    }
  };

  return (
    <ChildProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        loading,
        error,
        isParentMode: activeProfile === null,
        createProfile,
        updateProfile,
        deleteProfile,
        selectProfile,
        refreshProfiles,
      }}
    >
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const context = useContext(ChildProfileContext);
  if (!context) {
    throw new Error("useChildProfile must be used within a ChildProfileProvider");
  }
  return context;
}

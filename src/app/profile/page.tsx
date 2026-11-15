"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useUserProfile } from "@/context/UserProfileContext";
import { useChildProfile } from "@/context/ChildProfileContext";
import { SUPPORTED_LANGUAGES, calculateAge } from "@/lib/child-profiles/constants";
import { UserProfileInput } from "@/lib/types";
import { Icons } from "@/components/ui/Icons";
import { LocalStore } from "@/lib/storage";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const { profile, effectiveAge, effectiveAgeGroup, saveProfile } = useUserProfile();
  const { profiles: childProfiles } = useChildProfile();

  const [savedCount, setSavedCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSavedCount(LocalStore.getSavedVideos().length);
    setHistoryCount(LocalStore.getHistory().length);
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setDateOfBirth(profile.dateOfBirth);
      setPreferredLanguage(profile.preferredLanguage || "en");
    }
  }, [profile]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    if (!fullName.trim() || !dateOfBirth) {
      setSaveError("Full name and date of birth are required.");
      return;
    }

    const date = new Date(dateOfBirth);
    if (Number.isNaN(date.getTime()) || date > new Date()) {
      setSaveError("Enter a valid date of birth.");
      return;
    }

    setIsSaving(true);
    const input: UserProfileInput = {
      fullName: fullName.trim(),
      dateOfBirth,
      preferredLanguage,
    };
    const result = await saveProfile(input);
    setIsSaving(false);

    if (!result.success) {
      setSaveError(result.error || "Unable to update your profile.");
      return;
    }

    setSaveSuccess("Profile updated successfully.");
    setIsEditing(false);
  };

  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === profile?.preferredLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-xl ring-2 ring-zinc-700">
              <Icons.User size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {profile?.fullName || user?.fullName || "Nexora Viewer"}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    effectiveAgeGroup === "child"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : effectiveAgeGroup === "teen"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {effectiveAgeGroup === "child"
                    ? `Child Guard (<13)`
                    : effectiveAgeGroup === "teen"
                    ? `Teen Guard (13-17)`
                    : "Adult Account (18+)"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {user?.primaryEmailAddress?.emailAddress || "Authenticated Account"} • Age {effectiveAge} • {lang.flag} {lang.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setSaveError(null);
                setSaveSuccess(null);
                setIsEditing(true);
              }}
              className="rounded-full bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
            >
              Edit Profile
            </button>

            {isSignedIn && (
              <SignOutButton>
                <button className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition">
                  Sign Out
                </button>
              </SignOutButton>
            )}
          </div>
        </div>
      </div>

      {saveError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{saveError}</div>
      )}
      {saveSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{saveSuccess}</div>
      )}

      {isEditing && (
        <form onSubmit={handleSave} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Edit your profile</h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-zinc-400 hover:text-white">Cancel</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
              Full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white" required />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
              Date of birth
              <input type="date" value={dateOfBirth} max={new Date().toISOString().split("T")[0]} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white" required />
              <span className="block text-[11px] font-normal text-zinc-500">Current age: {calculateAge(dateOfBirth)}</span>
            </label>
          </div>
          <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
            Preferred language
            <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white">
              {SUPPORTED_LANGUAGES.map((option) => <option key={option.code} value={option.code}>{option.flag} {option.name}</option>)}
            </select>
          </label>
          <button type="submit" disabled={isSaving} className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Child Profiles</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <span className="text-base">👶</span>
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{childProfiles.length}</div>
          <p className="mt-1 text-xs text-zinc-500">Active child streaming profiles managed</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Saved Videos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Icons.Bookmark size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{savedCount}</div>
          <p className="mt-1 text-xs text-zinc-500">Bookmarked in your personal list</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Watch History</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Icons.History size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{historyCount}</div>
          <p className="mt-1 text-xs text-zinc-500">Total videos streamed in your catalog</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Icons.ShieldCheck size={20} className="text-red-500" />
          <span>Account security</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Authentication, email verification, password reset, sessions, and sign-out are managed securely by Clerk. Nexora stores only your profile details in Supabase and never stores your password.
        </p>
      </div>

      {/* Fast Navigation Shortcuts */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/profiles"
          className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
        >
          Manage Family & Child Profiles →
        </Link>
        <Link
          href="/library"
          className="rounded-full bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
        >
          View Library & Bookmarks
        </Link>
      </div>
    </div>
  );
}

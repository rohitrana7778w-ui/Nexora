"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useChildProfile } from "@/context/ChildProfileContext";
import { ChildProfile, CreateChildProfileInput, UpdateChildProfileInput } from "@/lib/types";
import { getAvatarById, getAgeGroupInfo, SUPPORTED_LANGUAGES } from "@/lib/child-profiles/constants";
import { ChildProfileModal } from "@/components/profiles/ChildProfileModal";
import { DeleteConfirmationModal } from "@/components/profiles/DeleteConfirmationModal";
import { Icons } from "@/components/ui/Icons";

export default function ProfilesManagementPage() {
  const { isSignedIn, isLoaded: isUserLoaded, user } = useUser();
  const {
    profiles,
    activeProfile,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    isParentMode,
  } = useChildProfile();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ChildProfile | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<ChildProfile | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  const handleSaveProfile = async (
    data: CreateChildProfileInput | UpdateChildProfileInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (editingProfile) {
      const res = await updateProfile(editingProfile.id, data);
      if (res.success) {
        showNotification(`Profile for ${res.profile?.name || "child"} updated successfully.`);
      }
      return res;
    } else {
      const res = await createProfile(data as CreateChildProfileInput);
      if (res.success) {
        showNotification(`Child profile for ${res.profile?.name || "child"} created successfully!`);
      }
      return res;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProfile) return;
    const name = deletingProfile.name;
    const res = await deleteProfile(deletingProfile.id);
    if (res.success) {
      showNotification(`Profile for ${name} was deleted.`);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 pb-12">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-zinc-950/95 px-4 py-3 text-sm text-emerald-300 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3">
          <span className="text-base">✨</span>
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
              <span className="text-sm">🛡️</span>
              <span>Parental Dashboard & Controls</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Child Profiles & Safe Streaming
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Create and manage personalized profiles for each of your children. Each profile features age-calculated classification, tailored interests, and independent watch preferences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSignedIn && (
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition cursor-pointer"
              >
                <span className="text-base font-bold">+</span>
                <span>Create Child Profile</span>
              </button>
            )}

            <button
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
            >
              <span>Database Setup</span>
              <span className="text-[10px] text-zinc-500">({showSqlGuide ? "Hide" : "SQL"})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SQL Setup Drawer (Collapsible) */}
      {showSqlGuide && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="text-base">🗄️</span>
              <span>Supabase PostgreSQL Schema & Row Level Security</span>
            </div>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Child profiles are saved to your Supabase PostgreSQL database table <code className="text-red-400 bg-zinc-800 px-1 py-0.5 rounded">child_profiles</code> with Row Level Security enforcing that each parent only has access to their own children. Run the SQL script located at <code className="text-zinc-300 font-mono">supabase/schema.sql</code> in your Supabase dashboard SQL editor.
          </p>
          <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-[11px] font-mono text-zinc-400 overflow-x-auto">
            CREATE TABLE IF NOT EXISTS public.child_profiles (id UUID PRIMARY KEY, parent_id TEXT, name TEXT, date_of_birth DATE, calculated_age INTEGER, age_group TEXT, avatar_id TEXT, preferred_language TEXT, content_preferences JSONB);
          </div>
        </div>
      )}

      {/* Authentication Check */}
      {isUserLoaded && !isSignedIn && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-2xl">
            🔒
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Sign In to Manage Child Profiles</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Child profiles remain securely linked to your authenticated parent account via Clerk and Supabase Row Level Security.
            </p>
          </div>
          <div className="pt-2">
            <SignInButton mode="modal">
              <button className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition">
                Sign In with Clerk
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* Active Mode Controller */}
      {isSignedIn && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-lg border border-zinc-700">
              {activeProfile ? "👶" : "🛡️"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Current Session Mode
                </span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-semibold border ${
                    activeProfile
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }`}
                >
                  {activeProfile ? `Child Mode (${activeProfile.name})` : "Parent Mode (Full Access)"}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {activeProfile
                  ? `Currently streaming content suited for ${activeProfile.name} (Age ${activeProfile.age}, ${activeProfile.ageGroup}).`
                  : "Browsing with full catalog access and parental controls."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isParentMode && (
              <button
                onClick={() => selectProfile(null)}
                className="rounded-full bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
              >
                Switch to Parent Mode
              </button>
            )}
          </div>
        </div>
      )}

      {/* Profiles Grid Section */}
      {isSignedIn && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Your Children&apos;s Profiles</span>
              <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.2 text-xs font-semibold text-zinc-400">
                {profiles.length}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              <p className="text-xs">Loading family profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/80 text-3xl">
                🎨
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-base font-bold text-white">No child profiles created yet</h3>
                <p className="text-xs text-zinc-400">
                  Add your child&apos;s profile to personalize their streaming catalog, calculate their age group, and tailor content preferences.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition cursor-pointer"
              >
                <span>+</span>
                <span>Create First Child Profile</span>
              </button>
            </div>
          ) : (
            /* Profiles Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {profiles.map((profile) => {
                const avatar = getAvatarById(profile.avatarId);
                const ageGroup = getAgeGroupInfo(profile.ageGroup);
                const isSelected = activeProfile?.id === profile.id;
                const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === profile.preferredLanguage);

                return (
                  <div
                    key={profile.id}
                    className={`relative flex flex-col justify-between rounded-3xl border p-5 transition-all duration-300 ${
                      isSelected
                        ? "border-emerald-500/50 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-emerald-950/20 shadow-xl shadow-emerald-950/20"
                        : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div>
                      {/* Top Row: Avatar & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${avatar.bgColor} text-3xl shadow-lg ring-2 ${
                              isSelected ? "ring-emerald-500" : "ring-zinc-700"
                            }`}
                          >
                            {avatar.emoji}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white truncate max-w-[150px]">
                              {profile.name}
                            </h3>
                            <p className="text-xs text-zinc-400">
                              {avatar.name}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => selectProfile(profile.id)}
                            className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                          >
                            Switch to Child
                          </button>
                        )}
                      </div>

                      {/* Age & Age Group Badges */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${ageGroup.badgeColor}`}>
                          {ageGroup.icon} {ageGroup.label} • Age {profile.age}
                        </span>

                        <span className="rounded-full bg-zinc-800 border border-zinc-700/80 px-2.5 py-0.5 text-xs text-zinc-300 font-medium">
                          {langInfo ? `${langInfo.flag} ${langInfo.name.split(" ")[0]}` : "English"}
                        </span>
                      </div>

                      {/* DOB Details */}
                      <div className="mt-2 text-[11px] text-zinc-400">
                        DOB: {new Date(profile.dateOfBirth).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </div>

                      {/* Content Preferences Pills */}
                      {profile.contentPreferences && profile.contentPreferences.length > 0 && (
                        <div className="mt-3.5 space-y-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Interests & Themes
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.contentPreferences.slice(0, 4).map((pref) => (
                              <span
                                key={pref}
                                className="rounded-full bg-zinc-800/90 border border-zinc-700/60 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300"
                              >
                                {pref}
                              </span>
                            ))}
                            {profile.contentPreferences.length > 4 && (
                              <span className="rounded-full bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400">
                                +{profile.contentPreferences.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Actions */}
                    <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                      <div className="flex items-center gap-1.5">
                        {isSelected ? (
                          <button
                            onClick={() => selectProfile(null)}
                            className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-semibold hover:bg-emerald-500/30 transition"
                          >
                            Exit Mode
                          </button>
                        ) : (
                          <button
                            onClick={() => selectProfile(profile.id)}
                            className="rounded-full bg-zinc-800 text-zinc-200 px-3 py-1 text-xs font-semibold hover:bg-zinc-700 hover:text-white transition"
                          >
                            Select Mode
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingProfile(profile);
                            setIsCreateModalOpen(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                          title="Edit profile"
                        >
                          <Icons.Settings size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingProfile(profile)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition"
                          title="Delete profile"
                        >
                          <Icons.Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Profile Card */}
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setIsCreateModalOpen(true);
                }}
                className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group min-h-[260px] cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition shadow">
                  <span className="text-xl font-bold">+</span>
                </div>
                <h4 className="mt-3 text-sm font-bold text-white group-hover:text-red-400 transition">
                  Add Another Child
                </h4>
                <p className="mt-1 text-xs text-zinc-400 max-w-[200px]">
                  Setup a separate avatar, age bracket and preferences.
                </p>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Safety & Architecture Information */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-bold text-base">
          <Icons.ShieldCheck size={20} className="text-red-500" />
          <span>Age-Based Filtering & Future AI Content Engine</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
          Nexora child profiles never ask children to create independent login credentials or reveal personal email addresses. Every profile is protected under your master parent identity. The calculated age groups (<code className="text-zinc-300">0-4 Little Kids</code>, <code className="text-zinc-300">5-8 Younger Kids</code>, <code className="text-zinc-300">9-12 Older Kids</code>, <code className="text-zinc-300">13+ Teens</code>) will directly integrate with our forthcoming automated AI video safety classifier.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-3.5 space-y-1">
            <div className="text-base">🎈 Little Kids (0-4)</div>
            <p className="text-[11px] text-zinc-400">Gentle sensory, lullabies, nursery rhymes, zero mature elements.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-3.5 space-y-1">
            <div className="text-base">🎨 Younger Kids (5-8)</div>
            <p className="text-[11px] text-zinc-400">Early reading, elementary science, friendly cartoons, beginner crafts.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-3.5 space-y-1">
            <div className="text-base">🚀 Older Kids (9-12)</div>
            <p className="text-[11px] text-zinc-400">STEM concepts, DIY, moderated gaming, creative arts, documentaries.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-3.5 space-y-1">
            <div className="text-base">🎧 Teens (13+)</div>
            <p className="text-[11px] text-zinc-400">High school topics, coding tutorials, world history, teen music.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChildProfileModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveProfile}
        existingProfile={editingProfile}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deletingProfile)}
        profile={deletingProfile}
        onClose={() => setDeletingProfile(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

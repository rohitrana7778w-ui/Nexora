"use client";

import React, { useState, useEffect } from "react";
import { ChildProfile, CreateChildProfileInput, UpdateChildProfileInput } from "@/lib/types";
import {
  CHILD_AVATARS,
  CONTENT_PREFERENCE_OPTIONS,
  SUPPORTED_LANGUAGES,
  calculateAge,
  getAgeGroup,
  getAgeGroupInfo,
  getAvatarById,
} from "@/lib/child-profiles/constants";
import { Icons } from "../ui/Icons";

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateChildProfileInput | UpdateChildProfileInput
  ) => Promise<{ success: boolean; error?: string }>;
  existingProfile?: ChildProfile | null;
}

export function ChildProfileModal({
  isOpen,
  onClose,
  onSave,
  existingProfile,
}: ChildProfileModalProps) {
  const isEditing = Boolean(existingProfile);

  // Form State
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState(CHILD_AVATARS[0].id);
  const [language, setLanguage] = useState("en");
  const [preferences, setPreferences] = useState<string[]>([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name);
      setDob(existingProfile.dateOfBirth);
      setSelectedAvatarId(existingProfile.avatarId);
      setLanguage(existingProfile.preferredLanguage);
      setPreferences(existingProfile.contentPreferences || []);
    } else {
      // Defaults for create mode
      setName("");
      // Default to 6 years ago for quick selection
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() - 6);
      setDob(defaultDate.toISOString().split("T")[0]);
      setSelectedAvatarId(CHILD_AVATARS[0].id);
      setLanguage("en");
      setPreferences(["Cartoons & Animation", "Science & Nature"]);
    }
    setFormError(null);
    setFormSuccess(null);
  }, [existingProfile, isOpen]);

  if (!isOpen) return null;

  // Real-time Age and Age Group calculation
  const calculatedAge = calculateAge(dob);
  const calculatedAgeGroup = getAgeGroup(calculatedAge);
  const ageGroupInfo = getAgeGroupInfo(calculatedAgeGroup);
  const currentAvatar = getAvatarById(selectedAvatarId);

  // Toggle content preference
  const togglePreference = (prefId: string) => {
    setPreferences((prev) =>
      prev.includes(prefId) ? prev.filter((p) => p !== prefId) : [...prev, prefId]
    );
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Please enter the child's display name or nickname.");
      return;
    }
    if (trimmedName.length > 30) {
      setFormError("Display name must be 30 characters or fewer.");
      return;
    }
    if (!dob) {
      setFormError("Please select the child's date of birth.");
      return;
    }
    const enteredDate = new Date(dob);
    if (isNaN(enteredDate.getTime())) {
      setFormError("Please enter a valid date.");
      return;
    }
    if (enteredDate > new Date()) {
      setFormError("Date of birth cannot be in the future.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateChildProfileInput = {
        name: trimmedName,
        dateOfBirth: dob,
        avatarId: selectedAvatarId,
        preferredLanguage: language,
        contentPreferences: preferences,
      };

      const result = await onSave(payload);

      if (result.success) {
        setFormSuccess(
          isEditing
            ? `Successfully updated ${trimmedName}'s profile!`
            : `Child profile for ${trimmedName} created successfully!`
        );
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setFormError(result.error || "Failed to save profile. Please try again.");
      }
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md transition-opacity">
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-red-950/20 text-zinc-100 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-600/30">
              <span className="text-xl">👶</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isEditing ? `Edit ${existingProfile?.name}'s Profile` : "Create Child Profile"}
              </h2>
              <p className="text-xs text-zinc-400">
                Personalize their safe streaming experience, age bracket & interests.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
            aria-label="Close"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Notifications */}
          {formError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 flex items-center gap-2.5">
              <span className="text-base">⚠️</span>
              <p className="font-medium">{formError}</p>
            </div>
          )}

          {formSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 flex items-center gap-2.5">
              <span className="text-base">✨</span>
              <p className="font-medium">{formSuccess}</p>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-950 p-4">
            <div className="flex items-center gap-4">
              <div
                className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${currentAvatar.bgColor} text-3xl shadow-lg ring-2 ring-zinc-700/80`}
              >
                {currentAvatar.emoji}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold border border-zinc-700">
                  {ageGroupInfo.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white truncate">
                    {name.trim() || "Child's Name"}
                  </h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${ageGroupInfo.badgeColor}`}>
                    {ageGroupInfo.label} • Age {calculatedAge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Avatar: <span className="text-zinc-200 font-medium">{currentAvatar.name}</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                  {ageGroupInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Name and Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Child&apos;s Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Leo, Maya, Alex"
                maxLength={30}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
              />
              <p className="text-[11px] text-zinc-500">
                Visible during their personal streaming session.
              </p>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
              />
              <p className="text-[11px] text-zinc-400">
                Current Age: <span className="font-semibold text-white">{calculatedAge} yrs old</span> ({ageGroupInfo.title})
              </p>
            </div>
          </div>

          {/* Age Group Explanation Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5 flex items-start gap-3">
            <span className="text-xl mt-0.5">{ageGroupInfo.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-200">
                  Assigned Age Group: {ageGroupInfo.label} ({ageGroupInfo.minAge} - {ageGroupInfo.maxAge === 18 ? "18+" : ageGroupInfo.maxAge} yrs)
                </span>
                <span className="rounded bg-red-500/10 border border-red-500/20 px-1.5 py-0.2 text-[10px] font-mono text-red-400">
                  AI Ready
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {ageGroupInfo.description} (Future video filters will automatically adapt to this age bracket).
              </p>
            </div>
          </div>

          {/* Section 2: Avatar Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Choose an Avatar <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-zinc-400">
                Selected: <span className="text-white font-medium">{currentAvatar.name}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {CHILD_AVATARS.map((avatar) => {
                const isSelected = avatar.id === selectedAvatarId;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 shadow-md shadow-red-600/20 scale-105"
                        : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-800/80"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${avatar.bgColor} text-2xl shadow-md transition-transform group-hover:scale-110`}
                    >
                      {avatar.emoji}
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-zinc-300 truncate w-full text-center">
                      {avatar.name.split(" ")[0]}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px]">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Preferred Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Preferred Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              Helps personalize video titles and recommendations in their preferred tongue.
            </p>
          </div>

          {/* Section 4: Content Preferences & Interests */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Content Preferences & Interests (Optional)
            </label>
            <p className="text-[11px] text-zinc-400">
              Select topics that this child enjoys. SafeStream will prioritize these themes in their home feed.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {CONTENT_PREFERENCE_OPTIONS.map((item) => {
                const isSelected = preferences.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePreference(item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {isSelected && <span className="ml-1 text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4 mt-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Icons.Check size={14} />
                <span>{isEditing ? "Update Child Profile" : "Create Child Profile"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

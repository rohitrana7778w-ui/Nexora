"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserProfile } from "@/context/UserProfileContext";
import { calculateAge, SUPPORTED_LANGUAGES } from "@/lib/child-profiles/constants";
import { determineUserAgeGroup } from "@/lib/moderation/classifier";
import { UserAgeGroup, UserProfileInput } from "@/lib/types";
import { Icons } from "@/components/ui/Icons";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { profile, saveProfile } = useUserProfile();

  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [language, setLanguage] = useState("en");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate initial values from Clerk or existing profile
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.firstName || "");
    }
    if (profile) {
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.dateOfBirth) setDateOfBirth(profile.dateOfBirth);
      if (profile.preferredLanguage) setLanguage(profile.preferredLanguage);
    } else {
      setDateOfBirth("");
    }
  }, [user, profile]);

  const calculatedAge = calculateAge(dateOfBirth);
  const calculatedAgeGroup: UserAgeGroup = determineUserAgeGroup(calculatedAge);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = fullName.trim();
    if (!trimmed) {
      setError("Please enter your full name.");
      return;
    }

    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime()) || dob > new Date()) {
      setError("Please enter a valid date of birth.");
      return;
    }

    setLoading(true);

    try {
      const input: UserProfileInput = {
        fullName: trimmed,
        dateOfBirth,
        preferredLanguage: language,
      };

      const result = await saveProfile(input);

      if (result.success) {
        setStep(2); // Move to confirmation step
      } else {
        setError(result.error || "Failed to save profile. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    router.replace("/");
  };

  if (!isUserLoaded) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Progress Steps Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
          <span className={step === 1 ? "text-red-500" : "text-zinc-500"}>
            1. Profile & Age Setup
          </span>
          <span className={step === 2 ? "text-emerald-400" : "text-zinc-500"}>
            Confirmation
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500 ${
              step === 1 ? "w-1/2" : "w-full"
            }`}
          />
        </div>
      </div>

      {step === 1 ? (
        /* Step 1: Form */
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="space-y-2 border-b border-zinc-800 pb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
              <Icons.ShieldCheck size={14} />
              <span>Profile Setup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome to Nexora SafeStream
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Enter the minimum details needed to personalize your Nexora account. Your age is calculated automatically from your date of birth.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 flex items-center gap-2.5">
              <span className="text-lg">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Live Age Tier Banner */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-2xl shadow-lg ring-2 ring-zinc-700">
                  <Icons.User size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {fullName.trim() || "Your Name"}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        calculatedAgeGroup === "child"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : calculatedAgeGroup === "teen"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {calculatedAgeGroup === "child"
                        ? "Child Account (<13)"
                        : calculatedAgeGroup === "teen"
                        ? "Teen Account (13-17)"
                        : "Adult Account (18+)"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Calculated Age: <span className="text-white font-semibold">{calculatedAge} years old</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Your age group is calculated automatically from your date of birth and saved with your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Name & DOB inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <p className="text-[11px] text-zinc-400">
                  Used for verified age classification. Saved securely in Supabase.
                </p>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-zinc-950 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Save Profile</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Step 2: Confirmation & Age Protection Status */
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-3xl shadow-lg">
              ✨
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Profile Setup Complete!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Your Nexora profile has been saved successfully. You&apos;re ready to start watching.
            </p>
          </div>

          {/* Status Details */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-white shadow"
                >
                  <Icons.User size={22} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{fullName}</h4>
                  <p className="text-xs text-zinc-400">
                    Age {calculatedAge} • {language.toUpperCase()}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border ${
                  calculatedAgeGroup === "child"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : calculatedAgeGroup === "teen"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {calculatedAgeGroup === "child"
                  ? "Child account"
                  : calculatedAgeGroup === "teen"
                  ? "Teen account"
                  : "Adult account"}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
              Your date of birth is stored with your profile, and your current age is recalculated from it when your profile is saved.
            </div>
          </div>

          {/* Action to Start Streaming */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              ← Edit Profile
            </button>

            <button
              onClick={handleFinish}
              className="w-full sm:w-auto rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition cursor-pointer"
            >
              Continue to Nexora →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

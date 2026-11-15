"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUserProfile } from "@/context/UserProfileContext";
import { useChildProfile } from "@/context/ChildProfileContext";
import { RESTRICTED_CATEGORIES } from "@/lib/moderation/classifier";
import { Icons } from "../ui/Icons";

export function AgeProtectionBadge() {
  const { profile, effectiveAge, effectiveAgeGroup, isOnboarded } = useUserProfile();
  const { activeProfile } = useChildProfile();
  const [showModal, setShowModal] = useState(false);

  if (!isOnboarded && !profile) return null;

  const currentAge = activeProfile ? activeProfile.age : effectiveAge;
  const currentGroup = activeProfile
    ? activeProfile.age < 13
      ? "child"
      : "teen"
    : effectiveAgeGroup;

  const badgeConfig = {
    child: {
      label: "Child Guard",
      sub: `<13 yrs (${currentAge})`,
      icon: "🎈",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    },
    teen: {
      label: "Teen Guard",
      sub: `13-17 yrs (${currentAge})`,
      icon: "🎧",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
    },
    adult: {
      label: "Adult Account",
      sub: `18+ (${currentAge})`,
      icon: "🛡️",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    },
  }[currentGroup] || {
    label: "Protected",
    sub: `${currentAge}`,
    icon: "🛡️",
    color: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border transition ${badgeConfig.color}`}
        title="View your age-based safety tier and active policies"
      >
        <span>{badgeConfig.icon}</span>
        <span>{badgeConfig.label}</span>
      </button>

      {/* Policy Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-xl">
                  {badgeConfig.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Age-Based Content Protection Status
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Active Tier: <span className="text-white font-medium">{badgeConfig.label} ({badgeConfig.sub})</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <Icons.X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Category Restrictions for {badgeConfig.label}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {Object.values(RESTRICTED_CATEGORIES).map((cat) => {
                  const isRestricted = cat.restrictedFor.includes(currentGroup);
                  return (
                    <div
                      key={cat.id}
                      className={`flex items-start gap-2 rounded-xl border p-2 text-xs ${
                        isRestricted
                          ? "border-red-500/20 bg-red-500/5 text-zinc-300"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white truncate text-[11px]">
                            {cat.name}
                          </span>
                          <span
                            className={`rounded text-[9px] px-1 font-mono ${
                              isRestricted
                                ? "bg-red-500/20 text-red-400 font-bold"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {isRestricted ? "Blocked" : "Allowed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-[11px] text-zinc-400 flex items-start gap-2">
              <Icons.ShieldCheck size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>
                Protected by Nexora server-side moderation. Content policies are verified securely and cannot be bypassed via browser developer tools.
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <Link
                href="/profiles"
                onClick={() => setShowModal(false)}
                className="text-xs text-red-400 hover:underline font-semibold"
              >
                Manage Family Profiles →
              </Link>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useChildProfile } from "@/context/ChildProfileContext";
import { getAvatarById, getAgeGroupInfo } from "@/lib/child-profiles/constants";

export function ChildModeBanner() {
  const { activeProfile, selectProfile } = useChildProfile();

  if (!activeProfile) return null;

  const avatar = getAvatarById(activeProfile.avatarId);
  const ageGroup = getAgeGroupInfo(activeProfile.ageGroup);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-zinc-950 p-4 shadow-lg shadow-emerald-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatar.bgColor} text-2xl shadow-md ring-2 ring-emerald-500/50`}
          >
            {avatar.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Child Safe Mode: {activeProfile.name}
              </span>
              <span className={`rounded-full px-2 py-0.2 text-[10px] font-semibold border ${ageGroup.badgeColor}`}>
                Age {activeProfile.age} • {ageGroup.label}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Personalized safe browsing active. AI content filters will align with {activeProfile.name}&apos;s profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/profiles"
            className="rounded-full bg-zinc-800/80 border border-zinc-700/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
          >
            Manage Profiles
          </Link>
          <button
            onClick={() => selectProfile(null)}
            className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition"
          >
            Exit Child Mode
          </button>
        </div>
      </div>
    </div>
  );
}

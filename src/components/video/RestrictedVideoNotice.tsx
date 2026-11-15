"use client";

import React from "react";
import Link from "next/link";
import { ModerationDecision } from "@/lib/types";
import { RESTRICTED_CATEGORIES } from "@/lib/moderation/classifier";
import { Icons } from "../ui/Icons";

interface RestrictedVideoNoticeProps {
  decision: ModerationDecision;
  videoTitle?: string;
}

export function RestrictedVideoNotice({ decision, videoTitle }: RestrictedVideoNoticeProps) {
  const isChild = decision.userAgeGroup === "child";
  const isTeen = decision.userAgeGroup === "teen";

  const categoryNames = decision.restrictedCategories
    .map((c) => RESTRICTED_CATEGORIES[c]?.name || c)
    .join(", ");

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-red-600/5 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-4">
        {/* Shield Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/10">
          <Icons.ShieldCheck size={32} />
        </div>

        {/* Headline */}
        <div className="space-y-1">
          <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400">
            {decision.requiresReview ? "Parental Review Required" : "Content Restricted"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {decision.requiresReview
              ? "Review Required for Safe Playback"
              : "Not Available for Your Age Tier"}
          </h2>
        </div>

        {/* Friendly explanation */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {decision.friendlyMessage ||
            `This stream has been filtered because it contains themes (${categoryNames}) restricted under the ${decision.userAgeGroup} safety policy.`}
        </p>

        {/* Protection Tier Badge */}
        <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
          <span>Active Protection:</span>
          <span className="font-semibold text-white">
            {isChild
              ? `Child Guard (Age ${decision.userAge})`
              : isTeen
              ? `Teen Guard (Age ${decision.userAge})`
              : "Standard Policy"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
          >
            <Icons.Home size={14} />
            <span>Browse Safe Streams</span>
          </Link>

          <Link
            href="/profiles"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <span>Family Profiles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

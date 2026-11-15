"use client";

import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";

export default function WelcomePage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 p-8 sm:p-12 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-24 h-72 w-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3.5 py-1 text-xs font-semibold text-red-400">
            <Icons.ShieldCheck size={14} />
            <span>Next-Gen Child Safety & Video Streaming</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stream Smarter. <br />
            <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
              Stream 100% Safely.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Nexora SafeStream combines rich global video entertainment with automatic age-based protection. Keep children and teenagers safe from inappropriate themes with verified server-side moderation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-red-600/30 hover:bg-red-500 transition"
            >
              <span>Create Free Account</span>
              <span>→</span>
            </Link>

            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 px-8 py-3.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Protection Tiers */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Built-in Age-Based Content Policies
          </h2>
          <p className="text-xs text-zinc-400">
            Content is automatically classified and filtered based on the viewer&apos;s verified age bracket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Child Tier */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-zinc-950 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎈</span>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                Ages 0 - 12
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Child Safety Tier</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Highest level of protection. Only family-vetted, sensory, educational, and creative content is allowed.
              </p>
            </div>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2 text-red-400">
                <span>✕</span> <span>Alcohol & Tobacco Blocked</span>
              </li>
              <li className="flex items-center gap-2 text-red-400">
                <span>✕</span> <span>Violence & Adult Themes Blocked</span>
              </li>
              <li className="flex items-center gap-2 text-red-400">
                <span>✕</span> <span>Gambling & Dangerous Challenges</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Parental Review on Sparse Metadata</span>
              </li>
            </ul>
          </div>

          {/* Teen Tier */}
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-zinc-950 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎧</span>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                Ages 13 - 17
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Teen Safety Tier</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Age-appropriate exploration. Allows technology, gaming, coding, tutorials, and music while blocking harmful content.
              </p>
            </div>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2 text-red-400">
                <span>✕</span> <span>Adult & Explicit Content Blocked</span>
              </li>
              <li className="flex items-center gap-2 text-red-400">
                <span>✕</span> <span>Drugs & Real Gambling Blocked</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Educational STEM & Tech Permitted</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Family-Friendly Gaming & Sports</span>
              </li>
            </ul>
          </div>

          {/* Adult Tier */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-zinc-950 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🛡️</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                Ages 18+
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Adult Standard Tier</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Full platform catalog access with master parental control capabilities to manage child profiles.
              </p>
            </div>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Full Unrestricted Catalog</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Create & Manage Child Profiles</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Parental PIN & Review Overrides</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-medium">
                <span>✓</span> <span>Personal Library & History</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to action footer */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to experience safe streaming?</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Create your account in under 30 seconds with Clerk authentication and Supabase PostgreSQL.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
        >
          <span>Get Started Now</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

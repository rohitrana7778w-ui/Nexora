"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useChildProfile } from "@/context/ChildProfileContext";
import { getAvatarById, getAgeGroupInfo } from "@/lib/child-profiles/constants";
import { Icons } from "../ui/Icons";

interface ProfileSwitcherProps {
  onOpenCreateModal: () => void;
}

export function ProfileSwitcher({ onOpenCreateModal }: ProfileSwitcherProps) {
  const { profiles, activeProfile, selectProfile, isParentMode } = useChildProfile();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeAvatar = activeProfile ? getAvatarById(activeProfile.avatarId) : null;
  const activeAgeGroup = activeProfile ? getAgeGroupInfo(activeProfile.ageGroup) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition border ${
          activeProfile
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/20"
            : "border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700 hover:text-white"
        }`}
        title="Switch between Child and Parent profiles"
      >
        {activeProfile && activeAvatar ? (
          <>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-sm ring-1 ring-emerald-500">
              {activeAvatar.emoji}
            </span>
            <span className="max-w-[90px] truncate">{activeProfile.name}</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono text-emerald-400">
              Kids
            </span>
          </>
        ) : (
          <>
            <span className="text-sm">🛡️</span>
            <span className="hidden sm:inline">Parent Mode</span>
            <span className="sm:hidden">Parent</span>
          </>
        )}
        <svg
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-zinc-100">
          <div className="px-3 py-2 border-b border-zinc-800/80">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Family & Profiles
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Switch browsing experience or personalize content.
            </p>
          </div>

          <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
            {/* Parent Mode Selection */}
            <button
              onClick={() => {
                selectProfile(null);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                isParentMode
                  ? "bg-red-500/10 text-white font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-sm">
                  🛡️
                </div>
                <div>
                  <div className="font-medium text-white">Parent Mode</div>
                  <div className="text-[10px] text-zinc-400">Unrestricted full catalog</div>
                </div>
              </div>
              {isParentMode && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">
                  ✓
                </span>
              )}
            </button>

            {/* Child Profiles List */}
            {profiles.length > 0 && (
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Child Profiles ({profiles.length})
                </div>
                {profiles.map((p) => {
                  const avatar = getAvatarById(p.avatarId);
                  const isSelected = activeProfile?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectProfile(p.id);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                        isSelected
                          ? "bg-emerald-500/10 text-emerald-300 font-semibold"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${avatar.bgColor} text-sm shadow`}
                        >
                          {avatar.emoji}
                        </div>
                        <div>
                          <div className="font-medium text-white">{p.name}</div>
                          <div className="text-[10px] text-zinc-400">
                            Age {p.age} • {p.ageGroup}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800/80 pt-1 mt-1 space-y-1">
            {/* Add Profile button */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenCreateModal();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-400 hover:bg-zinc-900 transition"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-xs">
                +
              </span>
              <span>Create Child Profile</span>
            </button>

            {/* Manage Profiles Link */}
            <Link
              href="/profiles"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
            >
              <span>Manage All Profiles</span>
              <span className="text-[10px] text-zinc-400">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

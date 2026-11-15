"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Icons } from "../ui/Icons";
import { ProfileSwitcher } from "../profiles/ProfileSwitcher";
import { AgeProtectionBadge } from "./AgeProtectionBadge";
import { ChildProfileModal } from "../profiles/ChildProfileModal";
import { useChildProfile } from "@/context/ChildProfileContext";
import { CreateChildProfileInput, UpdateChildProfileInput } from "@/lib/types";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createProfile } = useChildProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateProfile = async (
    data: CreateChildProfileInput | UpdateChildProfileInput
  ) => {
    return await createProfile(data as CreateChildProfileInput);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 backdrop-blur-md transition-all">
      {/* Left: Sidebar toggle & SafeStream Logo */}
      <div className="flex items-center gap-3 md:gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <Icons.Menu size={20} />
          </button>
        )}

        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-600/30 transition-transform group-hover:scale-105">
            <Icons.Play size={18} className="translate-x-0.5 fill-current" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
              Safe<span className="text-red-500">Stream</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex flex-1 max-w-xl mx-4">
        <form onSubmit={handleSearch} className="flex w-full items-center">
          <div className="relative flex w-full items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, tutorials, topics..."
              className="w-full rounded-l-full border border-zinc-700 bg-zinc-900/90 py-2.5 pl-4 pr-10 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-red-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-zinc-400 hover:text-zinc-200"
              >
                <Icons.X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            aria-label="Search"
            className="flex h-[42px] items-center justify-center rounded-r-full border border-l-0 border-zinc-700 bg-zinc-800 px-5 text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            <Icons.Search size={18} />
          </button>
        </form>
      </div>

      {/* Right: Quick actions & Clerk Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/explore"
          className="hidden md:flex items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white transition"
        >
          <Icons.Compass size={15} className="text-red-400" />
          <span>Explore</span>
        </Link>

        <Link
          href="/library"
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          title="Library & Saved"
        >
          <Icons.Bookmark size={20} />
        </Link>

        {/* Clerk Auth Section (mounted check prevents SSR hydration mismatch) */}
        {mounted ? (
          <>
            <Show when="signed-in">
              <AgeProtectionBadge />
              <ProfileSwitcher onOpenCreateModal={() => setIsCreateModalOpen(true)} />
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 ring-1 ring-zinc-700",
                  },
                }}
              />
            </Show>

            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition">
                    <span>Sign In</span>
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-500 transition">
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            </Show>
          </>
        ) : (
          <div className="h-8 w-20 rounded-full bg-zinc-900 animate-pulse border border-zinc-800" />
        )}
      </div>

      {/* Global Quick Create Child Profile Modal */}
      <ChildProfileModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProfile}
      />
    </header>
  );
}

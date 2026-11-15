"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "../ui/Icons";
import { CATEGORIES } from "@/lib/youtube";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const mainLinks = [
    { label: "Home", href: "/", icon: Icons.Home },
    { label: "Explore", href: "/explore", icon: Icons.Compass },
    { label: "Trending", href: "/search?q=trending", icon: Icons.Flame },
  ];

  const libraryLinks = [
    { label: "Library", href: "/library", icon: Icons.Library },
    { label: "Saved Videos", href: "/library?tab=saved", icon: Icons.Bookmark },
    { label: "History", href: "/library?tab=history", icon: Icons.History },
  ];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return Icons.GraduationCap;
      case "Laptop":
        return Icons.Laptop;
      case "Gamepad2":
        return Icons.Gamepad2;
      case "Trophy":
        return Icons.Trophy;
      case "Music":
        return Icons.Music;
      case "Film":
        return Icons.Film;
      case "Atom":
        return Icons.Atom;
      default:
        return Icons.Compass;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col border-r border-zinc-800/80 bg-zinc-950 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-500/10 text-red-500 font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  } ${!isOpen ? "lg:justify-center lg:px-2" : ""}`}
                  title={item.label}
                >
                  <Icon size={20} className={isActive ? "text-red-500" : "text-zinc-400"} />
                  <span className={!isOpen ? "lg:hidden" : ""}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <hr className="border-zinc-800/80" />

          {/* Library Section */}
          <div className="space-y-1">
            <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${!isOpen ? "lg:hidden" : ""}`}>
              You
            </div>
            {libraryLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-500/10 text-red-500 font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  } ${!isOpen ? "lg:justify-center lg:px-2" : ""}`}
                  title={item.label}
                >
                  <Icon size={20} className={isActive ? "text-red-500" : "text-zinc-400"} />
                  <span className={!isOpen ? "lg:hidden" : ""}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <hr className="border-zinc-800/80" />

          {/* Family & Child Profiles Section */}
          <div className="space-y-1">
            <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${!isOpen ? "lg:hidden" : ""}`}>
              Family
            </div>
            <Link
              href="/profiles"
              onClick={onClose}
              className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                pathname === "/profiles"
                  ? "bg-red-500/10 text-red-500 font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              } ${!isOpen ? "lg:justify-center lg:px-2" : ""}`}
              title="Child Profiles & Parental Controls"
            >
              <div className="flex h-5 w-5 items-center justify-center text-sm">
                👶
              </div>
              <div className={`flex items-center justify-between flex-1 ${!isOpen ? "lg:hidden" : ""}`}>
                <span>Child Profiles</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400">
                  Safe
                </span>
              </div>
            </Link>
          </div>

          <hr className="border-zinc-800/80" />

          {/* Categories / Explore */}
          <div className="space-y-1">
            <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${!isOpen ? "lg:hidden" : ""}`}>
              Explore
            </div>
            {CATEGORIES.filter((c) => c.id !== "All").map((cat) => {
              const Icon = getCategoryIcon(cat.iconName);
              const href = `/explore?category=${encodeURIComponent(cat.id)}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all ${
                    !isOpen ? "lg:justify-center lg:px-2" : ""
                  }`}
                  title={cat.label}
                >
                  <Icon size={18} />
                  <span className={!isOpen ? "lg:hidden" : ""}>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer info (only visible when expanded) */}
        {isOpen && (
          <div className="border-t border-zinc-800/80 p-4 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
              <Icons.ShieldCheck size={14} className="text-red-500" />
              <span>SafeStream v1.0</span>
            </div>
            <p>Clean, modern video platform powered by Next.js & YouTube.</p>
          </div>
        )}
      </aside>
    </>
  );
}

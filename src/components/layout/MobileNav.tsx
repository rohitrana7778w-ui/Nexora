"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "../ui/Icons";

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: Icons.Home },
    { label: "Explore", href: "/explore", icon: Icons.Compass },
    { label: "Kids", href: "/profiles", icon: Icons.ShieldCheck },
    { label: "Library", href: "/library", icon: Icons.Bookmark },
    { label: "Profile", href: "/profile", icon: Icons.User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-zinc-800 bg-zinc-950/95 px-2 backdrop-blur-lg lg:hidden">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition ${
              isActive ? "text-red-500 font-semibold" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Icon size={20} className={isActive ? "text-red-500" : "text-zinc-400"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import React, { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserProfile } from "@/context/UserProfileContext";

const PUBLIC_PATHS = ["/welcome", "/sign-in", "/sign-up"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-400">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        </div>
      }
    >
      <ProfileCompletionGateContent>{children}</ProfileCompletionGateContent>
    </Suspense>
  );
}

function ProfileCompletionGateContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { loading: isProfileLoading, profile, profileCheckComplete, error } = useUserProfile();

  const isPublic = isPublicPath(pathname);
  const isOnboarding = pathname === "/onboarding";

  useEffect(() => {
    if (!isClerkLoaded || !isSignedIn || isProfileLoading || !profileCheckComplete) {
      return;
    }

    if (!profile && !isOnboarding && !isPublic) {
      router.replace("/onboarding");
      return;
    }

    if (profile && isOnboarding) {
      router.replace("/");
    }
  }, [
    isClerkLoaded,
    isSignedIn,
    isProfileLoading,
    profileCheckComplete,
    profile,
    isOnboarding,
    isPublic,
    router,
  ]);

  if (!isClerkLoaded || (isSignedIn && (isProfileLoading || !profileCheckComplete))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-400">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="text-sm">Checking your Nexora profile…</p>
        </div>
      </div>
    );
  }

  if (isSignedIn && !profile && !isOnboarding && !isPublic) {
    return null;
  }

  if (error && isSignedIn && !isOnboarding && !isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h1 className="text-lg font-semibold">We couldn&apos;t verify your profile</h1>
          <p className="mt-2 text-sm text-zinc-300">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

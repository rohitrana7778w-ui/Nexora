import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ChildProfileProvider } from "@/context/ChildProfileContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { ProfileCompletionGate } from "@/components/auth/ProfileCompletionGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Opt every page out of Next 16 "instant navigation" validation (dev-only warning).
// Pages here are client components that read the Clerk session, so they cannot be prerendered.
export const instant = false;

export const metadata: Metadata = {
  title: "SafeStream — Modern Video Streaming Platform",
  description:
    "Explore, watch, and organize videos across Education, Technology, Gaming, Sports, Music, Entertainment, and Science.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <ClerkProvider
          telemetry={false}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <UserProfileProvider>
            <ChildProfileProvider>
              <ProfileCompletionGate>
                <AppShell>{children}</AppShell>
              </ProfileCompletionGate>
            </ChildProfileProvider>
          </UserProfileProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
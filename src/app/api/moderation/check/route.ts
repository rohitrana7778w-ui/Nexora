import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UserProfileDb } from "@/lib/user-profile/service";
import { ChildProfilesDb } from "@/lib/child-profiles/service";
import { evaluateVideoAccess, VideoMetadata } from "@/lib/moderation/classifier";
import { UserAgeGroup } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    const body = await request.json();
    const { video, activeChildProfileId } = body;

    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video data is required." },
        { status: 400 }
      );
    }

    let userAge = 18;
    let userAgeGroup: UserAgeGroup = "adult";

    // If authenticated, obtain true server-side profile
    if (userId) {
      // 1. If browsing as an active child profile
      if (activeChildProfileId) {
        const { data: childProfiles } = await ChildProfilesDb.getProfilesByParentId(userId);
        const activeChild = childProfiles.find((cp) => cp.id === activeChildProfileId);
        if (activeChild) {
          userAge = activeChild.age;
          userAgeGroup = activeChild.age < 13 ? "child" : "teen";
        }
      } else {
        // 2. Main user profile
        const { profile } = await UserProfileDb.getProfile(userId);
        if (profile) {
          userAge = profile.age;
          userAgeGroup = profile.ageGroup;
        }
      }
    } else {
      // Unauthenticated default policy: treat as child for maximum safety
      userAge = 10;
      userAgeGroup = "child";
    }

    const videoMeta: VideoMetadata = {
      id: video.id || video.youtubeId,
      youtubeId: video.youtubeId,
      title: video.title,
      description: video.description,
      tags: video.tags || [],
      category: video.category,
    };

    const decision = evaluateVideoAccess(videoMeta, userAge, userAgeGroup);

    return NextResponse.json({
      success: true,
      decision,
    });
  } catch (err: any) {
    console.error("POST /api/moderation/check error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

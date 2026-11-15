import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UserProfileDb } from "@/lib/user-profile/service";
import { UserProfileInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let accessToken: string | null = null;
    try {
      accessToken = await getToken({ template: "supabase" });
    } catch (tokenErr) {
      console.warn("Could not retrieve Supabase JWT template from Clerk:", tokenErr);
    }
    const { profile, error } = await UserProfileDb.getProfile(userId, accessToken || undefined);

    if (error) {
      console.warn("User profile fetch notice:", error);
    }

    return NextResponse.json({
      success: true,
      profile: profile || null,
      isOnboarded: profile ? profile.isOnboarded : false,
    });
  } catch (err: any) {
    console.error("GET /api/user-profile error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to setup profile." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, dateOfBirth, profilePicture, preferredLanguage } = body;

    // Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!dateOfBirth || isNaN(new Date(dateOfBirth).getTime())) {
      return NextResponse.json(
        { success: false, error: "A valid date of birth is required." },
        { status: 400 }
      );
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();
    if (dob > today) {
      return NextResponse.json(
        { success: false, error: "Date of birth cannot be in the future." },
        { status: 400 }
      );
    }

    const input: UserProfileInput = {
      fullName: fullName.trim(),
      dateOfBirth,
      profilePicture: profilePicture || undefined,
      preferredLanguage: preferredLanguage || "en",
    };

    let accessToken: string | null = null;
    try {
      accessToken = await getToken({ template: "supabase" });
    } catch (tokenErr) {
      console.warn("Could not retrieve Supabase JWT template from Clerk, proceeding with service key / anon fallback:", tokenErr);
    }
    const { profile, error } = await UserProfileDb.upsertProfile(userId, input, accessToken || undefined);

    if (error || !profile) {
      console.error("POST /api/user-profile: Database Error:", error);
      return NextResponse.json(
        { success: false, error: error || "Failed to save profile to database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile setup completed successfully!",
      profile,
    });
  } catch (err: any) {
    console.error("POST /api/user-profile error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ChildProfilesDb } from "@/lib/child-profiles/service";
import { CreateChildProfileInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to view your child profiles." },
        { status: 401 }
      );
    }

    const accessToken = await getToken({ template: "supabase" });
    const { data, fromDb, error } = await ChildProfilesDb.getProfilesByParentId(userId, accessToken || undefined);

    if (error && !fromDb) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, profiles: data, fromDb });
  } catch (err: any) {
    console.error("GET /api/child-profiles error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to retrieve child profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to create a child profile." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, dateOfBirth, avatarId, preferredLanguage, contentPreferences } = body;

    // Strict validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Child's name is required." },
        { status: 400 }
      );
    }

    if (name.trim().length > 40) {
      return NextResponse.json(
        { success: false, error: "Child's name must be under 40 characters." },
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

    if (!avatarId) {
      return NextResponse.json(
        { success: false, error: "Please choose an avatar for the child." },
        { status: 400 }
      );
    }

    const input: CreateChildProfileInput = {
      name: name.trim(),
      dateOfBirth,
      avatarId,
      preferredLanguage: preferredLanguage || "en",
      contentPreferences: Array.isArray(contentPreferences) ? contentPreferences : [],
    };

    const accessToken = await getToken({ template: "supabase" });
    const { profile, error } = await ChildProfilesDb.createProfile(userId, input, accessToken || undefined);

    if (error || !profile) {
      return NextResponse.json(
        { success: false, error: error || "Failed to create profile in database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${profile.name}'s profile created successfully!`,
        profile,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/child-profiles error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

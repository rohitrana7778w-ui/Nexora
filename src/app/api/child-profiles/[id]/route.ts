import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ChildProfilesDb } from "@/lib/child-profiles/service";
import { UpdateChildProfileInput } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Profile ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, dateOfBirth, avatarId, preferredLanguage, contentPreferences } = body;

    const input: UpdateChildProfileInput = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Child name cannot be empty." },
          { status: 400 }
        );
      }
      input.name = name.trim();
    }

    if (dateOfBirth !== undefined) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime()) || dob > new Date()) {
        return NextResponse.json(
          { success: false, error: "Valid past date of birth is required." },
          { status: 400 }
        );
      }
      input.dateOfBirth = dateOfBirth;
    }

    if (avatarId !== undefined) input.avatarId = avatarId;
    if (preferredLanguage !== undefined) input.preferredLanguage = preferredLanguage;
    if (contentPreferences !== undefined) input.contentPreferences = contentPreferences;

    const accessToken = await getToken({ template: "supabase" });
    const { profile, error } = await ChildProfilesDb.updateProfile(id, userId, input, accessToken || undefined);

    if (error || !profile) {
      return NextResponse.json(
        { success: false, error: error || "Failed to update profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${profile.name}'s profile updated successfully!`,
      profile,
    });
  } catch (err: any) {
    console.error("PUT /api/child-profiles/[id] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Profile ID is required." },
        { status: 400 }
      );
    }

    const accessToken = await getToken({ template: "supabase" });
    const { success, error } = await ChildProfilesDb.deleteProfile(id, userId, accessToken || undefined);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || "Failed to delete profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (err: any) {
    console.error("DELETE /api/child-profiles/[id] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

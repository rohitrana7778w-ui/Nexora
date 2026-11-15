import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UserProfileDb } from "@/lib/user-profile/service";
import { UserProfileInput } from "@/lib/types";
import { isValidCountryCode } from "@/lib/countries";
import { SUPPORTED_LANGUAGES } from "@/lib/child-profiles/constants";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const { profile, error } = await UserProfileDb.getProfile(userId);

    // A real DB error must not look like "no profile yet" (that would loop users into onboarding).
    if (error && !profile) {
      console.warn("User profile fetch error:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
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

function isRealDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to setup profile." },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const { fullName, dateOfBirth, country, profilePicture, preferredLanguage } = body ?? {};

    const name = typeof fullName === "string" ? fullName.trim().replace(/\s+/g, " ") : "";
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { success: false, error: "Full name must be between 2 and 80 characters." },
        { status: 400 }
      );
    }

    const dob = typeof dateOfBirth === "string" ? isRealDate(dateOfBirth.trim()) : null;
    if (!dob) {
      return NextResponse.json(
        { success: false, error: "A valid date of birth is required (YYYY-MM-DD)." },
        { status: 400 }
      );
    }
    if (dob > new Date() || dob.getFullYear() < 1900) {
      return NextResponse.json(
        { success: false, error: "Date of birth is not in a valid range." },
        { status: 400 }
      );
    }

    if (!isValidCountryCode(country)) {
      return NextResponse.json({ success: false, error: "Please select a valid country." }, { status: 400 });
    }

    const language = SUPPORTED_LANGUAGES.some((l) => l.code === preferredLanguage) ? preferredLanguage : "en";

    const input: UserProfileInput = {
      fullName: name,
      dateOfBirth: dateOfBirth.trim(),
      country: country.trim().toUpperCase(),
      profilePicture: profilePicture || undefined,
      preferredLanguage: language,
    };

    const { profile, error } = await UserProfileDb.upsertProfile(userId, input);

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
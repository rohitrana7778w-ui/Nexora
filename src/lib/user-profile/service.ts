import { UserProfile, UserProfileInput } from "../types";
import { getServerSupabaseClient } from "../supabase-server";
import { calculateAge } from "../child-profiles/constants";
import { determineUserAgeGroup } from "../moderation/classifier";

const SCHEMA_HINT =
  "The 'profiles' table is missing columns. Run supabase/profiles_fix.sql in the Supabase SQL Editor.";
const RLS_HINT =
  "Supabase blocked the write (row level security). Set SUPABASE_SERVICE_ROLE_KEY in .env.local and restart the server.";

export function getSupabaseClient(accessToken?: string | null) {
  return getServerSupabaseClient(accessToken);
}

function mapDbRowToUserProfile(row: any): UserProfile {
  const dateOfBirth: string = row.date_of_birth || "";
  // Always recompute from DOB so age/age-group never go stale.
  const age = dateOfBirth ? calculateAge(dateOfBirth) : typeof row.age === "number" ? row.age : 0;
  const fullName: string = row.display_name || row.full_name || "";
  const country: string = row.country || "";

  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    fullName,
    dateOfBirth,
    age,
    ageGroup: determineUserAgeGroup(age),
    profilePicture: row.avatar_url || row.profile_picture || undefined,
    preferredLanguage: row.preferred_language || "en",
    country,
    // A profile only counts as complete when name, DOB and country are all stored.
    isOnboarded: Boolean(fullName && dateOfBirth && country),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function friendlyError(error: { message: string; code?: string }): string {
  if (error.code === "PGRST204" || error.code === "42703" || /column/i.test(error.message)) {
    return SCHEMA_HINT;
  }
  if (error.code === "42501" || /row-level security/i.test(error.message)) {
    return RLS_HINT;
  }
  return error.message;
}

export const UserProfileDb = {
  /** Fetch a user profile by Clerk user ID */
  async getProfile(
    clerkUserId: string,
    _accessToken?: string
  ): Promise<{ profile: UserProfile | null; error?: string }> {
    const supabase = getSupabaseClient(null);
    if (!supabase) return { profile: null, error: "Database not configured" };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

      if (error) return { profile: null, error: friendlyError(error) };
      if (!data) return { profile: null };
      return { profile: mapDbRowToUserProfile(data) };
    } catch (err: any) {
      return { profile: null, error: err?.message || "Failed to fetch profile" };
    }
  },

  /** Create or update the profile. Age and age-group are computed on the server. */
  async upsertProfile(
    clerkUserId: string,
    input: UserProfileInput,
    _accessToken?: string
  ): Promise<{ profile: UserProfile | null; error?: string }> {
    const supabase = getSupabaseClient(null);
    if (!supabase) return { profile: null, error: "Database is not configured." };

    const age = calculateAge(input.dateOfBirth);

    const record: Record<string, any> = {
      clerk_user_id: clerkUserId,
      display_name: input.fullName.trim(),
      date_of_birth: input.dateOfBirth,
      age,
      age_group: determineUserAgeGroup(age),
      country: input.country.trim().toUpperCase(),
      preferred_language: input.preferredLanguage || "en",
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    };
    // Only overwrite the avatar when one was actually provided.
    if (input.profilePicture) record.avatar_url = input.profilePicture;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(record, { onConflict: "clerk_user_id" })
        .select()
        .single();

      // No silent fallback: a "saved" profile that lost DOB/country is the original bug.
      if (error) return { profile: null, error: friendlyError(error) };
      if (!data) return { profile: null, error: "Failed to save profile" };
      return { profile: mapDbRowToUserProfile(data) };
    } catch (err: any) {
      return { profile: null, error: err?.message || "Failed to save profile" };
    }
  },
};
import { UserProfile, UserProfileInput } from "../types";
import { getServerSupabaseClient } from "../supabase-server";
import { calculateAge } from "../child-profiles/constants";
import { determineUserAgeGroup } from "../moderation/classifier";

export function getSupabaseClient(accessToken?: string | null) {
  return getServerSupabaseClient(accessToken);
}

function mapDbRowToUserProfile(row: any): UserProfile {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    fullName: row.display_name || row.full_name || "",
    dateOfBirth: row.date_of_birth || "",
    age: typeof row.age === "number" ? row.age : calculateAge(row.date_of_birth),
    ageGroup: row.age_group || determineUserAgeGroup(row.age || calculateAge(row.date_of_birth)),
    profilePicture: row.avatar_url || row.profile_picture || undefined,
    preferredLanguage: row.preferred_language || "en",
    isOnboarded: Boolean(row.is_onboarded ?? !!row.date_of_birth),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const UserProfileDb = {
  /**
   * Fetch a user profile by Clerk user ID
   */
  async getProfile(clerkUserId: string, accessToken?: string): Promise<{ profile: UserProfile | null; error?: string }> {
    // Always use server client without passes-through invalid/unmatched Clerk JWTs
    const supabase = getSupabaseClient(null);
    if (!supabase) {
      return { profile: null, error: "Database not configured" };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

      if (error) {
        return { profile: null, error: error.message };
      }

      if (!data) {
        return { profile: null };
      }

      return { profile: mapDbRowToUserProfile(data) };
    } catch (err: any) {
      return { profile: null, error: err?.message || "Failed to fetch profile" };
    }
  },

  /**
   * Create or update user profile with server-calculated age and age-group
   */
  async upsertProfile(
    clerkUserId: string,
    input: UserProfileInput,
    accessToken?: string
  ): Promise<{ profile: UserProfile | null; error?: string }> {
    // Always use server client without passes-through invalid/unmatched Clerk JWTs
    const supabase = getSupabaseClient(null);
    const age = calculateAge(input.dateOfBirth);
    const ageGroup = determineUserAgeGroup(age);

    const record: Record<string, any> = {
      clerk_user_id: clerkUserId,
      display_name: input.fullName.trim(),
      avatar_url: input.profilePicture || null,
    };

    if (input.dateOfBirth) {
      record.date_of_birth = input.dateOfBirth;
      record.age = age;
      record.age_group = ageGroup;
    }
    if (input.preferredLanguage) {
      record.preferred_language = input.preferredLanguage;
    }
    record.is_onboarded = true;
    record.updated_at = new Date().toISOString();

    if (!supabase) {
      return { profile: null, error: "Database is not configured." };
    }

    try {
      // Step 1: Try full upsert with extended columns
      const { data, error } = await supabase
        .from("profiles")
        .upsert(record, { onConflict: "clerk_user_id" })
        .select()
        .single();

      if (!error && data) {
        return { profile: mapDbRowToUserProfile(data) };
      }

      // Step 2: Fallback for basic 'profiles' schema if extra columns (age, date_of_birth, etc.) don't exist in Supabase
      if (error && (error.message.includes("column") || error.code === "PGRST204")) {
        console.warn("Extended columns missing in profiles table, saving minimal profile schema:", error.message);

        const minimalRecord = {
          clerk_user_id: clerkUserId,
          display_name: input.fullName.trim(),
          avatar_url: input.profilePicture || null,
        };

        const { data: minData, error: minError } = await supabase
          .from("profiles")
          .upsert(minimalRecord, { onConflict: "clerk_user_id" })
          .select()
          .single();

        if (minError) {
          return { profile: null, error: minError.message };
        }

        return {
          profile: mapDbRowToUserProfile({
            ...minData,
            date_of_birth: input.dateOfBirth,
            age,
            age_group: ageGroup,
            preferred_language: input.preferredLanguage || "en",
            is_onboarded: true,
          }),
        };
      }

      return { profile: null, error: error ? error.message : "Failed to save profile" };
    } catch (err: any) {
      return { profile: null, error: err?.message || "Failed to save profile" };
    }
  },
};

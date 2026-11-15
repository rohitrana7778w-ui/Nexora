import { ChildProfile, CreateChildProfileInput, UpdateChildProfileInput } from "../types";
import { getServerSupabaseClient } from "../supabase-server";
import { calculateAge, getAgeGroup } from "./constants";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Create server/client-side Supabase client if configured
export function getSupabaseClient(accessToken?: string) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
    },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  });
}

/**
 * Map raw database row from Supabase to frontend ChildProfile object
 */
export function mapDbRowToProfile(row: any): ChildProfile {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    dateOfBirth: row.date_of_birth,
    age: typeof row.calculated_age === "number" ? row.calculated_age : calculateAge(row.date_of_birth),
    ageGroup: row.age_group || getAgeGroup(row.calculated_age || calculateAge(row.date_of_birth)),
    avatarId: row.avatar_id,
    preferredLanguage: row.preferred_language || "en",
    contentPreferences: Array.isArray(row.content_preferences)
      ? row.content_preferences
      : typeof row.content_preferences === "string"
      ? JSON.parse(row.content_preferences)
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Server-side Database Service for Child Profiles
 */
export const ChildProfilesDb = {
  /**
   * Fetch all child profiles belonging to a specific parent (Clerk user ID)
   */
  async getProfilesByParentId(parentId: string, accessToken?: string): Promise<{ data: ChildProfile[]; fromDb: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: [], fromDb: false, error: "Supabase not configured" };
    }

    try {
      const { data, error } = await supabase
        .from("child_profiles")
        .select("*")
        .eq("parent_id", parentId)
        .order("created_at", { ascending: true });

      if (error) {
        return { data: [], fromDb: false, error: error.message };
      }

      return {
        data: (data || []).map(mapDbRowToProfile),
        fromDb: true,
      };
    } catch (err: any) {
      return { data: [], fromDb: false, error: err?.message || "Unknown error" };
    }
  },

  /**
   * Create a new child profile in Supabase
   */
  async createProfile(
    parentId: string,
    input: CreateChildProfileInput,
    accessToken?: string
  ): Promise<{ profile: ChildProfile | null; error?: string }> {
    const supabase = getSupabaseClient();
    const age = calculateAge(input.dateOfBirth);
    const ageGroup = getAgeGroup(age);

    const newProfileData = {
      parent_id: parentId,
      name: input.name.trim(),
      date_of_birth: input.dateOfBirth,
      calculated_age: age,
      age_group: ageGroup,
      avatar_id: input.avatarId,
      preferred_language: input.preferredLanguage || "en",
      content_preferences: input.contentPreferences || [],
    };

    if (!supabase) {
      return { profile: null, error: "Database is not configured." };
    }

    try {
      const { data, error } = await supabase
        .from("child_profiles")
        .insert([newProfileData])
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }

      return { profile: mapDbRowToProfile(data) };
    } catch (err: any) {
      return { profile: null, error: err?.message || "Database insert failed" };
    }
  },

  /**
   * Update an existing child profile in Supabase (strictly guarded by parent_id)
   */
  async updateProfile(
    profileId: string,
    parentId: string,
    input: UpdateChildProfileInput,
    accessToken?: string
  ): Promise<{ profile: ChildProfile | null; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { profile: null, error: "Database not connected" };
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.dateOfBirth !== undefined) {
      updates.date_of_birth = input.dateOfBirth;
      const age = calculateAge(input.dateOfBirth);
      updates.calculated_age = age;
      updates.age_group = getAgeGroup(age);
    }
    if (input.avatarId !== undefined) updates.avatar_id = input.avatarId;
    if (input.preferredLanguage !== undefined) updates.preferred_language = input.preferredLanguage;
    if (input.contentPreferences !== undefined) updates.content_preferences = input.contentPreferences;

    try {
      const { data, error } = await supabase
        .from("child_profiles")
        .update(updates)
        .eq("id", profileId)
        .eq("parent_id", parentId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }

      return { profile: mapDbRowToProfile(data) };
    } catch (err: any) {
      return { profile: null, error: err?.message || "Database update failed" };
    }
  },

  /**
   * Delete a child profile (strictly guarded by parent_id)
   */
  async deleteProfile(profileId: string, parentId: string, accessToken?: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: "Database not connected" };
    }

    try {
      const { error } = await supabase
        .from("child_profiles")
        .delete()
        .eq("id", profileId)
        .eq("parent_id", parentId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Database delete failed" };
    }
  },
};

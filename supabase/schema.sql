-- ==============================================================================
-- Nexora SafeStream: User Profiles, Child Profiles & Row Level Security (RLS)
-- Run this in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create table for registered user profiles (Master accounts & age tracking)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT NOT NULL UNIQUE,                -- Associated Clerk User ID (e.g. user_2...)
    full_name TEXT NOT NULL,                           -- User's full name
    date_of_birth DATE NOT NULL,                       -- Date of birth used for server-side age validation
    age INTEGER NOT NULL,                              -- Exact age in years
    age_group TEXT NOT NULL,                           -- "child" (<13) | "teen" (13-17) | "adult" (18+)
    profile_picture TEXT,                              -- Avatar URL or chosen identifier
    preferred_language TEXT NOT NULL DEFAULT 'en',     -- Language preference
    is_onboarded BOOLEAN NOT NULL DEFAULT false,       -- Profile setup completion flag
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON public.user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_age_group ON public.user_profiles(age_group);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- These policies require a Supabase JWT whose `sub` claim is the Clerk user ID.
-- Configure the Supabase Clerk JWT template before running the application.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
ON public.user_profiles FOR SELECT
USING ((auth.jwt() ->> 'sub') = clerk_user_id);

DROP POLICY IF EXISTS "Users can upsert their own profile" ON public.user_profiles;
CREATE POLICY "Users can upsert their own profile"
ON public.user_profiles FOR INSERT
WITH CHECK ((auth.jwt() ->> 'sub') = clerk_user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
USING ((auth.jwt() ->> 'sub') = clerk_user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = clerk_user_id);

-- 2. Create table for child profiles (Family mode)
CREATE TABLE IF NOT EXISTS public.child_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id TEXT NOT NULL,                          -- Associated Clerk User ID (e.g. user_2...)
    name TEXT NOT NULL,                               -- Child's display name / nickname
    date_of_birth DATE NOT NULL,                      -- Date of birth used for dynamic age calculation
    calculated_age INTEGER NOT NULL,                  -- Current age in years
    age_group TEXT NOT NULL,                          -- "0-4" | "5-8" | "9-12" | "13+"
    avatar_id TEXT NOT NULL,                          -- Selected child avatar identifier
    preferred_language TEXT NOT NULL DEFAULT 'en',    -- Language preference (en, es, fr, hi, etc.)
    content_preferences JSONB NOT NULL DEFAULT '[]'::jsonb, -- Preferred categories & interests
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_child_profiles_parent_id ON public.child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_child_profiles_age_group ON public.child_profiles(age_group);

ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their own child profiles" ON public.child_profiles;
CREATE POLICY "Parents can view their own child profiles"
ON public.child_profiles FOR SELECT
USING ((auth.jwt() ->> 'sub') = parent_id);

DROP POLICY IF EXISTS "Parents can insert their own child profiles" ON public.child_profiles;
CREATE POLICY "Parents can insert their own child profiles"
ON public.child_profiles FOR INSERT
WITH CHECK ((auth.jwt() ->> 'sub') = parent_id);

DROP POLICY IF EXISTS "Parents can update their own child profiles" ON public.child_profiles;
CREATE POLICY "Parents can update their own child profiles"
ON public.child_profiles FOR UPDATE
USING ((auth.jwt() ->> 'sub') = parent_id)
WITH CHECK ((auth.jwt() ->> 'sub') = parent_id);

DROP POLICY IF EXISTS "Parents can delete their own child profiles" ON public.child_profiles;
CREATE POLICY "Parents can delete their own child profiles"
ON public.child_profiles FOR DELETE
USING ((auth.jwt() ->> 'sub') = parent_id);

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_child_profiles_updated_at ON public.child_profiles;
CREATE TRIGGER set_child_profiles_updated_at
BEFORE UPDATE ON public.child_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

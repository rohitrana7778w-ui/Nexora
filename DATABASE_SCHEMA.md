# SafeStream — Supabase Database Architecture & Schema Specification

This document details the complete PostgreSQL database architecture, table definitions, relationships, indexes, security policies (RLS), and ready-to-run SQL queries for **SafeStream** on Supabase.

---

## 1. Entity Relationship (ER) Overview

```
                 +------------------------+
                 |        PROFILES        |
                 +------------------------+
                 | id (PK, UUID)          |
                 | clerk_user_id (UNIQUE) |<---+
                 | display_name           |<---+---+
                 | avatar_url             |    |   |
                 | created_at             |    |   |
                 +------------------------+    |   |
                                               |   |
                 +------------------------+    |   |
                 |         VIDEOS         |    |   |
                 +------------------------+    |   |
                 | id (PK, UUID)          |    |   |
                 | youtube_video_id (UNIQ)|    |   |
                 | title                  |    |   |
                 | description            |    |   |
                 | thumbnail_url          |    |   |
                 | channel_title          |    |   |
                 | duration               |    |   |
                 | category               |    |   |
                 | created_at             |    |   |
                 +------------------------+    |   |
                                               |   |
        +--------------------------------------+   |
        |                                          |
+-------v----------------+                +--------v---------------+
|      SAVED_VIDEOS      |                |     WATCH_HISTORY      |
+------------------------+                +------------------------+
| id (PK, UUID)          |                | id (PK, UUID)          |
| user_id (FK -> clerk)  |                | user_id (FK -> clerk)  |
| youtube_video_id       |                | youtube_video_id       |
| video_data (JSONB)     |                | video_data (JSONB)     |
| created_at             |                | watched_at             |
+------------------------+                +------------------------+
```

---

## 2. Table Specifications

### 2.1 `profiles`
Stores user profile information synced from Clerk.
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Unique profile identifier |
| `clerk_user_id` | `TEXT` | `UNIQUE NOT NULL` | Clerk User Identifier (e.g. `user_2...`) |
| `display_name` | `TEXT` | `NULLABLE` | User's full or display name |
| `avatar_url` | `TEXT` | `NULLABLE` | URL pointing to user's profile picture |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc', now()) NOT NULL` | Profile creation timestamp |

### 2.2 `videos`
Cache table storing metadata for YouTube streams.
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Internal database ID |
| `youtube_video_id` | `TEXT` | `UNIQUE NOT NULL` | Official 11-char YouTube ID (e.g. `SqcY0GlETPk`) |
| `title` | `TEXT` | `NOT NULL` | Video headline / title |
| `description` | `TEXT` | `NULLABLE` | Full video description |
| `thumbnail_url` | `TEXT` | `NULLABLE` | High-res thumbnail image URL |
| `channel_title` | `TEXT` | `NULLABLE` | Name of creator / channel |
| `duration` | `TEXT` | `NULLABLE` | Formatted video duration (e.g. `14:22`) |
| `category` | `TEXT` | `DEFAULT 'All'` | Stream category (Education, Tech, etc.) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc', now()) NOT NULL` | Record creation timestamp |

### 2.3 `saved_videos`
User bookmarks / Watch Later list.
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Unique record ID |
| `user_id` | `TEXT` | `NOT NULL` | Clerk user ID or guest identifier |
| `youtube_video_id` | `TEXT` | `NOT NULL` | The YouTube video ID |
| `video_data` | `JSONB` | `NULLABLE` | Cached snapshot of video metadata |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc', now()) NOT NULL` | Bookmark creation timestamp |
| **Constraint** | `UNIQUE` | `(user_id, youtube_video_id)` | Prevents duplicate bookmarks |

### 2.4 `watch_history`
Chronological viewing log for signed-in users.
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Unique record ID |
| `user_id` | `TEXT` | `NOT NULL` | Clerk user ID or guest identifier |
| `youtube_video_id` | `TEXT` | `NOT NULL` | The YouTube video ID |
| `video_data` | `JSONB` | `NULLABLE` | Cached snapshot of video metadata |
| `watched_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc', now()) NOT NULL` | Time when video was opened/viewed |

---

## 3. Complete Supabase Setup SQL

Copy the SQL block below and run it inside the **Supabase SQL Editor**:

```sql
-- ==============================================================================
-- SAFESTREAM: SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. Profiles Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id 
  ON public.profiles(clerk_user_id);

-- ------------------------------------------------------------------------------
-- 3. Videos Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  channel_title TEXT,
  duration TEXT,
  category TEXT DEFAULT 'All',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_videos_youtube_id 
  ON public.videos(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_videos_category 
  ON public.videos(category);

-- ------------------------------------------------------------------------------
-- 4. Saved Videos Table (Bookmarks)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  video_data JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_saved_video UNIQUE (user_id, youtube_video_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_videos_user 
  ON public.saved_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_videos_created 
  ON public.saved_videos(created_at DESC);

-- ------------------------------------------------------------------------------
-- 5. Watch History Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  video_data JSONB,
  watched_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_watch_history_user 
  ON public.watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_time 
  ON public.watch_history(watched_at DESC);

-- ------------------------------------------------------------------------------
-- 6. Row Level Security (RLS) Setup
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public videos can be read by all" 
  ON public.videos FOR SELECT USING (true);

CREATE POLICY "Public profiles can be read by all" 
  ON public.profiles FOR SELECT USING (true);

-- User operations policies
CREATE POLICY "Users can manage their saved videos" 
  ON public.saved_videos FOR ALL USING (true);

CREATE POLICY "Users can manage their watch history" 
  ON public.watch_history FOR ALL USING (true);
```

---

## 4. Useful Application Queries

### 4.1 Fetch a User's Saved Videos
```sql
SELECT 
  id,
  user_id,
  youtube_video_id,
  video_data,
  created_at
FROM public.saved_videos
WHERE user_id = 'user_your_clerk_id_here'
ORDER BY created_at DESC;
```

### 4.2 Save / Bookmark a Video
```sql
INSERT INTO public.saved_videos (user_id, youtube_video_id, video_data)
VALUES (
  'user_your_clerk_id_here',
  'SqcY0GlETPk',
  '{"title": "React Tutorial", "channelTitle": "Programming with Mosh", "duration": "1:18:24"}'::jsonb
)
ON CONFLICT (user_id, youtube_video_id) DO NOTHING;
```

### 4.3 Remove a Saved Video
```sql
DELETE FROM public.saved_videos
WHERE user_id = 'user_your_clerk_id_here' 
  AND youtube_video_id = 'SqcY0GlETPk';
```

### 4.4 Fetch a User's Watch History
```sql
SELECT 
  id,
  user_id,
  youtube_video_id,
  video_data,
  watched_at
FROM public.watch_history
WHERE user_id = 'user_your_clerk_id_here'
ORDER BY watched_at DESC
LIMIT 50;
```

### 4.5 Record a Video in Watch History
```sql
INSERT INTO public.watch_history (user_id, youtube_video_id, video_data, watched_at)
VALUES (
  'user_your_clerk_id_here',
  'SqcY0GlETPk',
  '{"title": "React Tutorial", "channelTitle": "Programming with Mosh", "duration": "1:18:24"}'::jsonb,
  NOW()
);
```

### 4.6 Clear Watch History for a User
```sql
DELETE FROM public.watch_history
WHERE user_id = 'user_your_clerk_id_here';
```

---

## 5. How to Deploy to Supabase

1. Open your project on **[supabase.com](https://supabase.com)**.
2. Go to **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Paste the SQL from **Section 3** above.
5. Click **Run** (or `Cmd + Enter`).
6. All 4 tables, indexes, and RLS policies are now live!

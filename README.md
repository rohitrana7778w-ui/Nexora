# SafeStream — Video Streaming Platform

SafeStream is a modern, responsive video-streaming web application inspired by YouTube. It enables users to discover, search, watch, and organize videos across creative, technical, and academic categories with embedded playback, personalized library management, and watch history.

---

## 🚀 Key Features

- **Homepage Video Feed**: Filterable categories, featured stream banner, and responsive video cards.
- **Category Browsing (Explore)**: Dedicated category sections (Education, Technology, Gaming, Sports, Music, Entertainment, Science).
- **Video Search**: Fast search with list and grid layouts.
- **Embedded Playback (Watch)**: 16:9 responsive YouTube player with like counters, save to library, share link, and related video suggestions.
- **Personal Library**: Saved video bookmarks and automatic watch history tracking with clear and remove options.
- **User Profile**: Account statistics, streaming metrics, and service connection overview.
- **Authentication Ready**: Built for Clerk with built-in guest mode fallback.
- **Cloud Database Ready**: Built for Supabase PostgreSQL with local storage fallback for offline/development testing.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL (`supabase/schema.sql`)
- **Authentication**: Clerk
- **Video Playback**: YouTube Data API v3 & YouTube Embedded Player

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root shell layout with header, sidebar, and theme
│   ├── page.tsx                # Homepage (Featured video, Category pills, Grid)
│   ├── explore/page.tsx        # Explore categories
│   ├── search/page.tsx         # Search query results (/search?q=...)
│   ├── watch/page.tsx          # Watch page (/watch?v=[id]) with embedded player
│   ├── library/page.tsx        # Saved videos and watch history
│   ├── profile/page.tsx        # User profile & account overview
│   ├── sign-in/page.tsx        # Sign In page
│   ├── sign-up/page.tsx        # Sign Up page
│   └── api/
│       ├── videos/route.ts     # Video search & category API
│       └── library/            # Library endpoints (saved & history)
├── components/
│   ├── layout/                 # Navbar, Sidebar, AppShell, MobileNav
│   ├── video/                  # VideoCard, VideoGrid, VideoPlayer, CategoryPills
│   └── ui/                     # Icons, buttons, and shared primitives
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── youtube.ts              # YouTube Data API client & curated catalog
│   ├── supabase.ts             # Supabase cloud database client
│   └── storage.ts              # Local & cloud persistence manager
└── supabase/
    └── schema.sql              # Supabase PostgreSQL schema with RLS policies
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` to configure live external integrations:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | Guest mode fallback |
| `CLERK_SECRET_KEY` | Clerk Secret Key | Optional |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Local storage fallback |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Public Key | Local storage fallback |
| `YOUTUBE_API_KEY` | YouTube Data API v3 Key | Curated catalog fallback |

---

## 🏃 Getting Started

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

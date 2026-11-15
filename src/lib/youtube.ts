import { Video, VideoCategory, CategoryInfo } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "All",
    label: "All",
    description: "Browse all trending and recommended videos",
    iconName: "Compass",
    colorGradient: "from-red-600 to-rose-500",
    featuredQuery: "trending",
  },
  {
    id: "Education",
    label: "Education",
    description: "Learn new concepts, tutorials, and academic topics",
    iconName: "GraduationCap",
    colorGradient: "from-blue-600 to-indigo-500",
    featuredQuery: "education tutorial course",
  },
  {
    id: "Technology",
    label: "Technology",
    description: "Software engineering, hardware, AI, and futuristic gadgets",
    iconName: "Laptop",
    colorGradient: "from-cyan-500 to-blue-600",
    featuredQuery: "technology software development",
  },
  {
    id: "Gaming",
    label: "Gaming",
    description: "Game reviews, playthroughs, esports, and industry news",
    iconName: "Gamepad2",
    colorGradient: "from-purple-600 to-pink-500",
    featuredQuery: "gaming gameplay highlights",
  },
  {
    id: "Sports",
    label: "Sports",
    description: "Match highlights, athletic training, and championship moments",
    iconName: "Trophy",
    colorGradient: "from-emerald-500 to-teal-600",
    featuredQuery: "sports highlights athletes",
  },
  {
    id: "Music",
    label: "Music",
    description: "Official music videos, acoustic live sets, and concerts",
    iconName: "Music",
    colorGradient: "from-amber-500 to-orange-600",
    featuredQuery: "music live performance concert",
  },
  {
    id: "Entertainment",
    label: "Entertainment",
    description: "Cinema, comedy shows, creative animations, and podcasts",
    iconName: "Film",
    colorGradient: "from-rose-500 to-red-600",
    featuredQuery: "entertainment movies comedy",
  },
  {
    id: "Science",
    label: "Science",
    description: "Astrophysics, biology, quantum mechanics, and nature",
    iconName: "Atom",
    colorGradient: "from-violet-600 to-indigo-600",
    featuredQuery: "science universe physics documentary",
  },
];

// Curated high quality real playable YouTube videos across categories
export const CURATED_VIDEOS: Video[] = [
  // Technology
  {
    id: "v-tech-1",
    youtubeId: "SqcY0GlETPk",
    title: "React Tutorial for Beginners [2024]",
    description:
      "React JS Tutorial for Beginners - Learn React 18 with TypeScript and build a real-world project step by step.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Programming with Mosh",
    channelAvatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    duration: "1:18:24",
    publishedAt: "2 weeks ago",
    viewCount: "840K views",
    category: "Technology",
    tags: ["React", "JavaScript", "TypeScript", "Frontend", "Web Development"],
    likeCount: "42K",
  },
  {
    id: "v-tech-2",
    youtubeId: "843nec-IvW0",
    title: "Building Modern Web Apps with Next.js App Router",
    description:
      "A deep dive into Server Components, Server Actions, streaming SSR, and edge deployments with Next.js.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    channelTitle: "TechVisionary",
    channelAvatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    duration: "24:15",
    publishedAt: "3 days ago",
    viewCount: "192K views",
    category: "Technology",
    tags: ["Next.js", "React", "Fullstack", "WebDev"],
    likeCount: "14K",
  },
  {
    id: "v-tech-3",
    youtubeId: "aircAruvnKk",
    title: "Neural Networks from Scratch — Deep Learning Foundation",
    description:
      "How artificial neural networks actually calculate forward propagation and gradient descent backprop.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    channelTitle: "3Blue1Brown",
    channelAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    duration: "19:13",
    publishedAt: "1 month ago",
    viewCount: "3.4M views",
    category: "Technology",
    tags: ["Machine Learning", "AI", "Mathematics", "Deep Learning"],
    likeCount: "210K",
  },

  // Education
  {
    id: "v-edu-1",
    youtubeId: "bBC-nXj3Ng4",
    title: "How Does the Human Brain Store and Retrieve Memories?",
    description:
      "Explore the complex neurochemistry and synaptic connections that allow the brain to form long-term memories.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80",
    channelTitle: "TED-Ed",
    channelAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    duration: "05:42",
    publishedAt: "4 days ago",
    viewCount: "1.2M views",
    category: "Education",
    tags: ["Neuroscience", "Education", "Biology", "Brain"],
    likeCount: "89K",
  },
  {
    id: "v-edu-2",
    youtubeId: "W6NZfCO5SIk",
    title: "JavaScript Crash Course for Beginners",
    description:
      "Complete JavaScript course to master DOM manipulation, variables, functions, asynchronous promises, and ES6+.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Traversy Media",
    channelAvatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    duration: "1:40:29",
    publishedAt: "2 weeks ago",
    viewCount: "540K views",
    category: "Education",
    tags: ["JavaScript", "Programming", "Coding", "Tutorial"],
    likeCount: "38K",
  },
  {
    id: "v-edu-3",
    youtubeId: "zOjov-2OZ0E",
    title: "A Brief History of Modern Economic Thought",
    description:
      "From Adam Smith to Keynes and game theory: how modern financial systems and market dynamics evolved.",
    thumbnailUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
    channelTitle: "CrashCourse",
    channelAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    duration: "12:50",
    publishedAt: "3 weeks ago",
    viewCount: "680K views",
    category: "Education",
    tags: ["Economics", "History", "Finance"],
    likeCount: "25K",
  },

  // Science
  {
    id: "v-sci-1",
    youtubeId: "GoW8Tf7hTGA",
    title: "What If We Detonated a Nuclear Bomb in the Mariana Trench?",
    description:
      "A scientific simulation of hydrothermal pressure, shockwaves, and what happens miles beneath the ocean surface.",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Kurzgesagt – In a Nutshell",
    channelAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    duration: "09:30",
    publishedAt: "5 days ago",
    viewCount: "4.8M views",
    category: "Science",
    tags: ["Science", "Physics", "Ocean", "Kurzgesagt"],
    likeCount: "390K",
  },
  {
    id: "v-sci-2",
    youtubeId: "uD4izuDMUQA",
    title: "TIMELAPSE OF THE FUTURE: A Journey to the End of Time",
    description:
      "How will our universe end? Journey billions of trillions of years into deep cosmological time.",
    thumbnailUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    channelTitle: "MELODYSHEEP",
    channelAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    duration: "29:21",
    publishedAt: "2 months ago",
    viewCount: "12M views",
    category: "Science",
    tags: ["Cosmology", "Space", "Universe", "Astronomy"],
    likeCount: "1.1M",
  },
  {
    id: "v-sci-3",
    youtubeId: "k720K8jX7w0",
    title: "The Bizarre Physics of Superconductors at Absolute Zero",
    description:
      "Why magnetic levitation happens when matter drops to ultra-cryogenic temperatures. Quantum physics explained.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Veritasium",
    channelAvatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    duration: "18:04",
    publishedAt: "1 week ago",
    viewCount: "2.1M views",
    category: "Science",
    tags: ["Physics", "Quantum", "Superconductors", "Veritasium"],
    likeCount: "155K",
  },

  // Gaming
  {
    id: "v-gam-1",
    youtubeId: "eaW0tYpxyp0",
    title: "Cyberpunk 2077: Path Tracing Overdrive Graphics Review",
    description:
      "Full ray tracing and ray reconstruction benchmarked on next-gen hardware with ultra settings enabled.",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Digital Foundry",
    channelAvatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    duration: "21:40",
    publishedAt: "6 days ago",
    viewCount: "720K views",
    category: "Gaming",
    tags: ["Gaming", "Cyberpunk", "RayTracing", "Benchmarks"],
    likeCount: "35K",
  },
  {
    id: "v-gam-2",
    youtubeId: "8X2kIfS6fb8",
    title: "Top 10 Most Anticipated Open World Games of 2025/2026",
    description:
      "Comprehensive breakdown of the highest budget RPGs, survival sandboxes, and adventure releases coming soon.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Gameranx",
    channelAvatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80",
    duration: "15:22",
    publishedAt: "3 days ago",
    viewCount: "950K views",
    category: "Gaming",
    tags: ["Gaming", "OpenWorld", "Upcoming", "Review"],
    likeCount: "48K",
  },

  // Music
  {
    id: "v-mus-1",
    youtubeId: "5qap5aO4i9A",
    title: "Lofi Hip Hop Radio — Beats to Relax/Study to",
    description:
      "Peaceful chill lofi beats, soothing instrumentation, and mellow rhythms for deep focus and study sessions.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Lofi Girl",
    channelAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    duration: "3:45:00",
    publishedAt: "Live",
    viewCount: "38M views",
    category: "Music",
    tags: ["Lofi", "Chill", "Study", "Focus", "Instrumental"],
    likeCount: "2.3M",
  },
  {
    id: "v-mus-2",
    youtubeId: "kJQP7kiw5Fk",
    title: "Despacito (Acoustic Classical Spanish Guitar Cover)",
    description:
      "Fingerstyle classical Spanish acoustic guitar performance recorded with high fidelity studio microphones.",
    thumbnailUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Acoustic Vibes",
    channelAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    duration: "04:12",
    publishedAt: "1 year ago",
    viewCount: "5.4M views",
    category: "Music",
    tags: ["Acoustic", "Guitar", "Fingerstyle", "Music"],
    likeCount: "320K",
  },

  // Sports
  {
    id: "v-spo-1",
    youtubeId: "zVzC8d0m0hY",
    title: "Impossible Athletic Moments Captured in 4K 120FPS",
    description:
      "Spectacular feats of human agility, world records, gymnast routines, and track and field finishes.",
    thumbnailUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Epic Sports Highlights",
    channelAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    duration: "11:05",
    publishedAt: "2 weeks ago",
    viewCount: "1.8M views",
    category: "Sports",
    tags: ["Sports", "Athletics", "Highlights", "4K"],
    likeCount: "94K",
  },

  // Entertainment
  {
    id: "v-ent-1",
    youtubeId: "dQw4w9WgXcQ",
    title: "The Ultimate Classic — High Energy Musical Showcase",
    description:
      "Remastered official musical production and timeless upbeat dance track with iconic choreography.",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Rick Astley Official",
    channelAvatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    duration: "03:33",
    publishedAt: "Classic",
    viewCount: "1.5B views",
    category: "Entertainment",
    tags: ["Music", "Pop", "Classic", "Entertainment"],
    likeCount: "16M",
  },
  {
    id: "v-ent-2",
    youtubeId: "tVj0ZTS4WF4",
    title: "How Christopher Nolan Films Mind-Bending Practical Effects",
    description:
      "Behind the scenes on Inception, Interstellar, and Oppenheimer: building rotating hallway sets and IMAX rigs.",
    thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    channelTitle: "Cinema Insights",
    channelAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    duration: "16:48",
    publishedAt: "3 weeks ago",
    viewCount: "890K views",
    category: "Entertainment",
    tags: ["Cinema", "Filmmaking", "Nolan", "Hollywood"],
    likeCount: "62K",
  },
];

/**
 * Get videos filtered by category and optional search query
 */
export async function getVideos({
  category = "All",
  searchQuery = "",
  limit = 24,
}: {
  category?: VideoCategory;
  searchQuery?: string;
  limit?: number;
} = {}): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // Try real YouTube API if configured
  if (apiKey && (searchQuery.trim() || category !== "All")) {
    try {
      const q = searchQuery.trim() || (category !== "All" ? `${category} video` : "popular");
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${encodeURIComponent(
        q
      )}&type=video&key=${apiKey}`;

      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any, idx: number) => ({
            id: item.id?.videoId || `yt-${idx}`,
            youtubeId: item.id?.videoId,
            title: item.snippet?.title || "Video",
            description: item.snippet?.description || "",
            thumbnailUrl:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url,
            channelTitle: item.snippet?.channelTitle || "YouTube Creator",
            channelId: item.snippet?.channelId,
            duration: "10:00",
            publishedAt: new Date(item.snippet?.publishedAt || Date.now()).toLocaleDateString(),
            viewCount: "Available",
            category: category === "All" ? "Technology" : category,
            tags: [category],
          }));
        }
      }
    } catch (err) {
      console.warn("YouTube API call failed, falling back to curated library", err);
    }
  }

  // Filter curated videos
  let results = [...CURATED_VIDEOS];

  if (category && category !== "All") {
    results = results.filter((v) => v.category.toLowerCase() === category.toLowerCase());
  }

  if (searchQuery && searchQuery.trim()) {
    const qLower = searchQuery.toLowerCase().trim();
    results = results.filter(
      (v) =>
        v.title.toLowerCase().includes(qLower) ||
        v.description.toLowerCase().includes(qLower) ||
        v.channelTitle.toLowerCase().includes(qLower) ||
        v.tags?.some((t) => t.toLowerCase().includes(qLower))
    );
  }

  return results.slice(0, limit);
}

/**
 * Get single video by YouTube ID
 */
export async function getVideoById(youtubeId: string): Promise<Video | null> {
  const found = CURATED_VIDEOS.find((v) => v.youtubeId === youtubeId);
  if (found) return found;

  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${youtubeId}&key=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
          return {
            id: item.id,
            youtubeId: item.id,
            title: item.snippet?.title || "Untitled Video",
            description: item.snippet?.description || "",
            thumbnailUrl:
              item.snippet?.thumbnails?.maxres?.url ||
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url,
            channelTitle: item.snippet?.channelTitle || "YouTube Creator",
            channelId: item.snippet?.channelId,
            duration: item.contentDetails?.duration || "10:00",
            publishedAt: new Date(item.snippet?.publishedAt || Date.now()).toLocaleDateString(),
            viewCount: item.statistics?.viewCount ? `${parseInt(item.statistics.viewCount).toLocaleString()} views` : "Available",
            category: "Technology",
            likeCount: item.statistics?.likeCount ? parseInt(item.statistics.likeCount).toLocaleString() : undefined,
          };
        }
      }
    } catch (err) {
      console.warn("YouTube video fetch failed", err);
    }
  }

  // Fallback placeholder with the requested YouTube ID so embed still plays!
  return {
    id: youtubeId,
    youtubeId: youtubeId,
    title: `SafeStream Video (${youtubeId})`,
    description: "Enjoy streaming this video on SafeStream with high quality YouTube playback.",
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    channelTitle: "SafeStream Creator",
    duration: "10:00",
    publishedAt: "Recently added",
    viewCount: "Playing now",
    category: "Technology",
    likeCount: "1.2K",
  };
}

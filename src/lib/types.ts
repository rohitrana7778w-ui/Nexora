export interface Video {
  id: string; // internal id or youtube id
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId?: string;
  channelAvatarUrl?: string;
  duration: string; // e.g. "14:22"
  publishedAt: string;
  viewCount: string; // e.g. "1.2M views"
  category: VideoCategory;
  tags?: string[];
  likeCount?: string;
}

export type VideoCategory =
  | "All"
  | "Education"
  | "Technology"
  | "Gaming"
  | "Sports"
  | "Music"
  | "Entertainment"
  | "Science";

export interface CategoryInfo {
  id: VideoCategory;
  label: string;
  description: string;
  iconName: string;
  colorGradient: string;
  featuredQuery: string;
}

export interface SavedVideo {
  id: string;
  userId: string;
  videoId: string;
  video: Video;
  createdAt: string;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  videoId: string;
  video: Video;
  watchedAt: string;
}

// User Profiles & Age-Based Protection Types
export type UserAgeGroup = "child" | "teen" | "adult";

export interface UserProfile {
  id: string;
  clerkUserId: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  age: number; // calculated age in years
  ageGroup: UserAgeGroup; // "child" (<13) | "teen" (13-17) | "adult" (18+)
  profilePicture?: string;
  preferredLanguage: string;
  country: string; // ISO 3166-1 alpha-2 code, e.g. "IN"
  isOnboarded: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfileInput {
  fullName: string;
  dateOfBirth: string;
  country: string; // ISO 3166-1 alpha-2 code
  profilePicture?: string;
  preferredLanguage?: string;
}

// Restricted Content Categories for Moderation
export type RestrictedCategory =
  | "alcohol"
  | "tobacco"
  | "drugs"
  | "violence"
  | "adult"
  | "gambling"
  | "dangerous_challenges"
  | "other_inappropriate";

export interface RestrictedCategoryInfo {
  id: RestrictedCategory;
  name: string;
  description: string;
  icon: string;
  restrictedFor: UserAgeGroup[]; // e.g. ["child", "teen"]
}

export interface ModerationDecision {
  allowed: boolean;
  userAgeGroup: UserAgeGroup;
  userAge: number;
  requiresReview: boolean;
  restrictedCategories: RestrictedCategory[];
  reason?: string;
  friendlyMessage?: string;
  severity?: "low" | "medium" | "high" | "critical";
  matchedKeywords?: string[];
  reviewedAt: string;
}


// Child Profiles & Age-Based Personalization Types
export type AgeGroup = "0-4" | "5-8" | "9-12" | "13+";

export interface AgeGroupInfo {
  id: AgeGroup;
  label: string;
  title: string;
  minAge: number;
  maxAge: number;
  description: string;
  badgeColor: string;
  gradient: string;
  icon: string;
}

export interface ChildAvatar {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface ChildProfile {
  id: string;
  parentId: string; // Clerk user ID
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  age: number; // calculated age in years
  ageGroup: AgeGroup; // 0-4 | 5-8 | 9-12 | 13+
  avatarId: string;
  preferredLanguage: string; // e.g. "en", "es", "fr", "hi"
  contentPreferences: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateChildProfileInput {
  name: string;
  dateOfBirth: string;
  avatarId: string;
  preferredLanguage: string;
  contentPreferences?: string[];
}

export interface UpdateChildProfileInput {
  name?: string;
  dateOfBirth?: string;
  avatarId?: string;
  preferredLanguage?: string;
  contentPreferences?: string[];
}
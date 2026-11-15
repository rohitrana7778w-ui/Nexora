import { ModerationDecision, RestrictedCategory, RestrictedCategoryInfo, UserAgeGroup } from "../types";

export const RESTRICTED_CATEGORIES: Record<RestrictedCategory, RestrictedCategoryInfo> = {
  alcohol: {
    id: "alcohol",
    name: "Alcohol & Drinking",
    description: "Depictions of alcoholic beverages, heavy drinking, bar culture, or drunkenness.",
    icon: "🍺",
    restrictedFor: ["child", "teen"],
  },
  tobacco: {
    id: "tobacco",
    name: "Smoking, Tobacco & Vaping",
    description: "Cigarettes, e-cigarettes, vaping devices, cigars, or nicotine use.",
    icon: "🚬",
    restrictedFor: ["child", "teen"],
  },
  drugs: {
    id: "drugs",
    name: "Drug-Related Content",
    description: "Illegal narcotics, cannabis, prescription abuse, or drug paraphernalia.",
    icon: "💊",
    restrictedFor: ["child", "teen"],
  },
  violence: {
    id: "violence",
    name: "Violence & Disturbing Content",
    description: "Graphic violence, physical assaults, severe injuries, bloodshed, or gore.",
    icon: "⚔️",
    restrictedFor: ["child", "teen"],
  },
  adult: {
    id: "adult",
    name: "Adult & Sexually Explicit",
    description: "Sexual themes, nudity, suggestive behavior, or adult services.",
    icon: "🔞",
    restrictedFor: ["child", "teen"],
  },
  gambling: {
    id: "gambling",
    name: "Gambling & Betting",
    description: "Casinos, sports betting, poker tournaments, slot machines, or lottery games.",
    icon: "🎰",
    restrictedFor: ["child", "teen"],
  },
  dangerous_challenges: {
    id: "dangerous_challenges",
    name: "Dangerous Challenges & Stunts",
    description: "Harmful stunts, risky viral internet challenges, choking games, or self-harm.",
    icon: "⚠️",
    restrictedFor: ["child", "teen"],
  },
  other_inappropriate: {
    id: "other_inappropriate",
    name: "Other Age-Inappropriate Content",
    description: "Extreme profanity, psychological horror, hate speech, or dangerous activities.",
    icon: "🚫",
    restrictedFor: ["child"],
  },
};

// Keyword patterns for classification
const CATEGORY_KEYWORDS: Record<RestrictedCategory, string[]> = {
  alcohol: [
    "alcohol", "beer", "wine", "whiskey", "vodka", "rum", "tequila",
    "cocktail", "drinking game", "get drunk", "pub crawl", "shots of",
    "liquor", "champagne", "brewery", "bartending", "binge drinking"
  ],
  tobacco: [
    "smoking", "cigarette", "tobacco", "vape", "vaping", "e-cig",
    "juul", "cigar", "nicotine", "hookah", "smoke tricks", "smoke weed"
  ],
  drugs: [
    "drugs", "cocaine", "heroin", "meth", "weed", "marijuana",
    "cannabis", "psychedelics", "lsd", "shrooms", "bong", "high on",
    "narcotics", "overdose", "cartel", "drug deal"
  ],
  violence: [
    "violence", "bloodshed", "brutal fight", "brawl", "gory",
    "execution", "murder", "stabbing", "shooting", "beating up",
    "disturbing", "massacre", "decapitation", "torture", "assault",
    "gun violence", "knife attack"
  ],
  adult: [
    "porn", "nsfw", "sex", "erotic", "nude", "nudity", "strip club",
    "onlyfans", "stripper", "sensual", "horny", "intercourse",
    "sexual", "fetish", "xxx", "uncensored naked"
  ],
  gambling: [
    "casino", "gambling", "slot machine", "sports betting", "poker night",
    "blackjack", "roulette", "jackpot win", "lottery", "stake casino",
    "betting tips", "crypto gambling"
  ],
  dangerous_challenges: [
    "tide pod challenge", "choking game", "pass out challenge",
    "dangerous stunt", "roof jumping", "train surfing", "self harm",
    "suicide", "bleach drinking", "fire challenge", "extreme prank gone wrong"
  ],
  other_inappropriate: [
    "f***ing", "motherfucker", "profanity", "explicit lyrics",
    "jumpscare horror", "terrifying real", "disturbing urban legend",
    "gruesome accident"
  ]
};

export interface VideoMetadata {
  id?: string;
  youtubeId?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
}

/**
 * Classify a video against restricted categories using metadata.
 */
export function classifyVideoContent(video: VideoMetadata): {
  flaggedCategories: RestrictedCategory[];
  matchedKeywords: string[];
  isInsufficientInfo: boolean;
} {
  const title = (video.title || "").toLowerCase();
  const description = (video.description || "").toLowerCase();
  const tags = (video.tags || []).map((t) => t.toLowerCase());
  const combinedText = `${title} ${description} ${tags.join(" ")}`;

  const flaggedCategories: RestrictedCategory[] = [];
  const matchedKeywords: string[] = [];

  // Helper to escape special regex characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Check each category
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [RestrictedCategory, string[]][]) {
    for (const kw of keywords) {
      // Word boundary match with escaped keywords
      const escapedKw = escapeRegExp(kw);
      const regex = new RegExp(`\\b${escapedKw}\\b`, "i");
      if (regex.test(combinedText)) {
        if (!flaggedCategories.includes(category)) {
          flaggedCategories.push(category);
        }
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
        }
      }
    }
  }

  // Check for insufficient info
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const isInsufficientInfo = (
    title.trim().length < 4 ||
    (wordCount < 4 && tags.length === 0 && !video.category)
  );

  return {
    flaggedCategories,
    matchedKeywords,
    isInsufficientInfo,
  };
}

/**
 * Evaluates access to a video based on the user's age and assigned age group.
 */
export function evaluateVideoAccess(
  video: VideoMetadata,
  userAge: number,
  userAgeGroup: UserAgeGroup
): ModerationDecision {
  const { flaggedCategories, matchedKeywords, isInsufficientInfo } = classifyVideoContent(video);
  const now = new Date().toISOString();

  // 1. Adults (18+): Standard platform policy
  if (userAgeGroup === "adult" || userAge >= 18) {
    return {
      allowed: true,
      userAgeGroup: "adult",
      userAge,
      requiresReview: false,
      restrictedCategories: flaggedCategories,
      matchedKeywords,
      reviewedAt: now,
    };
  }

  // 2. Children (< 13): Strict protection
  if (userAgeGroup === "child" || userAge < 13) {
    // If insufficient metadata, fail-safe: require review and restrict
    if (isInsufficientInfo) {
      return {
        allowed: false,
        userAgeGroup: "child",
        userAge,
        requiresReview: true,
        restrictedCategories: ["other_inappropriate"],
        reason: "Insufficient video metadata for automated child safety validation.",
        friendlyMessage:
          "This video doesn't have enough verified information yet to ensure it is suitable for children. It has been marked for parental review.",
        severity: "medium",
        matchedKeywords: [],
        reviewedAt: now,
      };
    }

    // If any restricted category is flagged, restrict it
    if (flaggedCategories.length > 0) {
      const categoryNames = flaggedCategories
        .map((cat) => RESTRICTED_CATEGORIES[cat]?.name || cat)
        .join(", ");

      return {
        allowed: false,
        userAgeGroup: "child",
        userAge,
        requiresReview: false,
        restrictedCategories: flaggedCategories,
        reason: `Content flagged for categories: ${categoryNames}`,
        friendlyMessage: `This video contains themes related to ${categoryNames}, which are not permitted for Child accounts.`,
        severity: flaggedCategories.some((c) => ["violence", "adult", "drugs"].includes(c))
          ? "critical"
          : "high",
        matchedKeywords,
        reviewedAt: now,
      };
    }

    return {
      allowed: true,
      userAgeGroup: "child",
      userAge,
      requiresReview: false,
      restrictedCategories: [],
      matchedKeywords: [],
      reviewedAt: now,
    };
  }

  // 3. Teenagers (13 - 17): Age-appropriate restrictions
  // Block: adult, drugs, tobacco, gambling, dangerous challenges, extreme violence
  const teenRestricted = flaggedCategories.filter((cat) =>
    ["adult", "drugs", "tobacco", "gambling", "dangerous_challenges", "violence"].includes(cat)
  );

  if (teenRestricted.length > 0) {
    const categoryNames = teenRestricted
      .map((cat) => RESTRICTED_CATEGORIES[cat]?.name || cat)
      .join(", ");

    return {
      allowed: false,
      userAgeGroup: "teen",
      userAge,
      requiresReview: false,
      restrictedCategories: teenRestricted,
      reason: `Restricted for teenagers under 18: ${categoryNames}`,
      friendlyMessage: `This video contains content (${categoryNames}) restricted for users under 18.`,
      severity: "high",
      matchedKeywords,
      reviewedAt: now,
    };
  }

  return {
    allowed: true,
    userAgeGroup: "teen",
    userAge,
    requiresReview: isInsufficientInfo,
    restrictedCategories: [],
    matchedKeywords: [],
    reviewedAt: now,
  };
}

/**
 * Determine age group from exact age
 */
export function determineUserAgeGroup(age: number): UserAgeGroup {
  if (age < 13) return "child";
  if (age < 18) return "teen";
  return "adult";
}

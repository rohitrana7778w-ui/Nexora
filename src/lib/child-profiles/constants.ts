import { AgeGroup, AgeGroupInfo, ChildAvatar } from "../types";

export const CHILD_AVATARS: ChildAvatar[] = [
  {
    id: "avatar-lion",
    name: "Leo the Lion",
    emoji: "🦁",
    bgColor: "from-amber-500 to-orange-600",
    borderColor: "border-amber-400/50",
    description: "Brave & adventurous",
  },
  {
    id: "avatar-astronaut",
    name: "Cosmo Astronaut",
    emoji: "🚀",
    bgColor: "from-indigo-600 to-cyan-500",
    borderColor: "border-indigo-400/50",
    description: "Space explorer & dreamer",
  },
  {
    id: "avatar-panda",
    name: "Pip the Panda",
    emoji: "🐼",
    bgColor: "from-emerald-600 to-teal-500",
    borderColor: "border-emerald-400/50",
    description: "Gentle & thoughtful",
  },
  {
    id: "avatar-fox",
    name: "Spark Fox",
    emoji: "🦊",
    bgColor: "from-orange-500 to-rose-600",
    borderColor: "border-orange-400/50",
    description: "Clever & curious",
  },
  {
    id: "avatar-artist",
    name: "Maya the Artist",
    emoji: "🎨",
    bgColor: "from-fuchsia-600 to-pink-500",
    borderColor: "border-fuchsia-400/50",
    description: "Creative & imaginative",
  },
  {
    id: "avatar-dolphin",
    name: "Echo Dolphin",
    emoji: "🐬",
    bgColor: "from-sky-500 to-blue-600",
    borderColor: "border-sky-400/50",
    description: "Playful & friendly",
  },
  {
    id: "avatar-hero",
    name: "Nova Hero",
    emoji: "🦸",
    bgColor: "from-red-600 to-rose-500",
    borderColor: "border-red-400/50",
    description: "Strong & kind-hearted",
  },
  {
    id: "avatar-owl",
    name: "Oliver Owl",
    emoji: "🦉",
    bgColor: "from-purple-600 to-violet-500",
    borderColor: "border-purple-400/50",
    description: "Wise & inquisitive",
  },
  {
    id: "avatar-unicorn",
    name: "Star Unicorn",
    emoji: "🦄",
    bgColor: "from-pink-500 to-purple-600",
    borderColor: "border-pink-400/50",
    description: "Magical & optimistic",
  },
  {
    id: "avatar-robot",
    name: "Gizmo Robot",
    emoji: "🤖",
    bgColor: "from-cyan-500 to-teal-600",
    borderColor: "border-cyan-400/50",
    description: "Tech genius & builder",
  },
  {
    id: "avatar-dino",
    name: "Rex the Dino",
    emoji: "🦖",
    bgColor: "from-lime-600 to-emerald-600",
    borderColor: "border-lime-400/50",
    description: "Energetic & bold",
  },
  {
    id: "avatar-koala",
    name: "Koko Koala",
    emoji: "🐨",
    bgColor: "from-teal-600 to-cyan-600",
    borderColor: "border-teal-400/50",
    description: "Calm & peaceful",
  },
];

export const AGE_GROUPS: Record<AgeGroup, AgeGroupInfo> = {
  "0-4": {
    id: "0-4",
    label: "Little Kids",
    title: "Preschool & Nursery (Ages 0 - 4)",
    minAge: 0,
    maxAge: 4,
    description: "Gentle animations, sensory songs, nursery rhymes, and early motor skills.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    gradient: "from-amber-500 to-yellow-600",
    icon: "🎈",
  },
  "5-8": {
    id: "5-8",
    label: "Younger Kids",
    title: "Early Elementary (Ages 5 - 8)",
    minAge: 5,
    maxAge: 8,
    description: "Curious exploration, fundamental science, interactive learning, and fun cartoons.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    gradient: "from-emerald-500 to-teal-600",
    icon: "🎨",
  },
  "9-12": {
    id: "9-12",
    label: "Older Kids",
    title: "Pre-Teens (Ages 9 - 12)",
    minAge: 9,
    maxAge: 12,
    description: "STEM topics, DIY projects, creative challenges, and family-friendly gaming.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    gradient: "from-blue-500 to-indigo-600",
    icon: "🚀",
  },
  "13+": {
    id: "13+",
    label: "Teens",
    title: "Young Adults (Ages 13+)",
    minAge: 13,
    maxAge: 18,
    description: "In-depth tutorials, programming, music production, sports, and advanced topics.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    gradient: "from-purple-500 to-rose-600",
    icon: "🎧",
  },
};

export const CONTENT_PREFERENCE_OPTIONS = [
  { id: "Cartoons & Animation", label: "Cartoons & Animation", icon: "🎬" },
  { id: "Science & Nature", label: "Science & Nature", icon: "🔬" },
  { id: "Learning & Math", label: "Learning & Math", icon: "📚" },
  { id: "Gaming & Play", label: "Gaming & Play", icon: "🎮" },
  { id: "Arts & Crafts", label: "Arts & Crafts", icon: "🎨" },
  { id: "Music & Songs", label: "Music & Songs", icon: "🎵" },
  { id: "Animals & Wildlife", label: "Animals & Wildlife", icon: "🐾" },
  { id: "Storybooks & Reading", label: "Storybooks & Reading", icon: "📖" },
  { id: "Sports & Movement", label: "Sports & Movement", icon: "⚽" },
  { id: "Building & LEGO", label: "Building & LEGO", icon: "🧱" },
];

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish (Español)", flag: "🇪🇸" },
  { code: "fr", name: "French (Français)", flag: "🇫🇷" },
  { code: "de", name: "German (Deutsch)", flag: "🇩🇪" },
  { code: "hi", name: "Hindi (हिन्दी)", flag: "🇮🇳" },
  { code: "zh", name: "Mandarin (中文)", flag: "🇨🇳" },
  { code: "ja", name: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese (Português)", flag: "🇧🇷" },
];

/**
 * Accurately calculate the current age from a date of birth string (YYYY-MM-DD).
 */
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;

  // Parse YYYY-MM-DD string to avoid timezone issues
  const [year, month, day] = dobString.split("-").map(Number);
  const dob = new Date(year, month - 1, day);

  if (isNaN(dob.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Determine the appropriate age group based on calculated age.
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age <= 4) return "0-4";
  if (age <= 8) return "5-8";
  if (age <= 12) return "9-12";
  return "13+";
}

/**
 * Retrieve metadata for a specific age group.
 */
export function getAgeGroupInfo(ageGroup: AgeGroup): AgeGroupInfo {
  return AGE_GROUPS[ageGroup] || AGE_GROUPS["5-8"];
}

/**
 * Retrieve avatar by its id.
 */
export function getAvatarById(avatarId: string): ChildAvatar {
  const found = CHILD_AVATARS.find((a) => a.id === avatarId);
  return found || CHILD_AVATARS[0];
}

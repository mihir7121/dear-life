import type { Category } from "@/types";

export interface CategoryMeta {
  value: Category;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: "concert",
    label: "Concert",
    icon: "🎵",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.15)",
    description: "Live music, festivals, performances",
  },
  {
    value: "restaurant",
    label: "Restaurant",
    icon: "🍽️",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    description: "Memorable meals and dining experiences",
  },
  {
    value: "cafe",
    label: "Café",
    icon: "☕",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
    description: "Coffee shops, bakeries, afternoon escapes",
  },
  {
    value: "travel",
    label: "Travel",
    icon: "✈️",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    description: "Trips, journeys, explorations",
  },
  {
    value: "landmark",
    label: "Landmark",
    icon: "🏛️",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    description: "Historical sites, monuments, iconic places",
  },
  {
    value: "moment",
    label: "Life Moment",
    icon: "✨",
    color: "#f43f5e",
    bgColor: "rgba(244, 63, 94, 0.15)",
    description: "Spontaneous, beautiful, ordinary extraordinary moments",
  },
  {
    value: "milestone",
    label: "Milestone",
    icon: "🎉",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    description: "Birthdays, anniversaries, achievements",
  },
  {
    value: "nature",
    label: "Nature",
    icon: "🌿",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
    description: "Hikes, landscapes, wildlife, natural wonders",
  },
  {
    value: "art",
    label: "Art & Culture",
    icon: "🎨",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.15)",
    description: "Museums, galleries, exhibitions, theatre",
  },
  {
    value: "sports",
    label: "Sports",
    icon: "⚽",
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.15)",
    description: "Games, matches, athletic events",
  },
  {
    value: "other",
    label: "Other",
    icon: "📌",
    color: "#6b7280",
    bgColor: "rgba(107, 114, 128, 0.15)",
    description: "Anything else worth remembering",
  },
];

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const MOODS = [
  { value: "transcendent", label: "Transcendent", emoji: "🌌" },
  { value: "joyful", label: "Joyful", emoji: "😄" },
  { value: "peaceful", label: "Peaceful", emoji: "🌸" },
  { value: "awe", label: "Awe", emoji: "🤩" },
  { value: "contemplative", label: "Contemplative", emoji: "💭" },
  { value: "reverent", label: "Reverent", emoji: "🙏" },
  { value: "euphoric", label: "Euphoric", emoji: "🎉" },
  { value: "nostalgic", label: "Nostalgic", emoji: "🌅" },
  { value: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { value: "meditative", label: "Meditative", emoji: "🧘" },
  { value: "cosmic", label: "Cosmic", emoji: "🌠" },
  { value: "satisfied", label: "Satisfied", emoji: "😌" },
  { value: "resilient", label: "Resilient", emoji: "💪" },
  { value: "celebratory", label: "Celebratory", emoji: "🥂" },
  { value: "primal", label: "Primal", emoji: "🦁" },
  { value: "melancholic", label: "Melancholic", emoji: "🌧️" },
  { value: "grateful", label: "Grateful", emoji: "🌻" },
];

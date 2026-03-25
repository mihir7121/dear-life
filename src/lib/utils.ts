import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isThisYear } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, showYear = true): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (!showYear || isThisYear(d)) {
    return format(d, "MMMM d");
  }
  return format(d, "MMMM d, yyyy");
}

export function formatDateRange(start: Date | string, end?: Date | string | null): string {
  const s = typeof start === "string" ? new Date(start) : start;
  if (!end) return formatDate(s, true);
  const e = typeof end === "string" ? new Date(end) : end;
  if (format(s, "MMMM yyyy") === format(e, "MMMM yyyy")) {
    return `${format(s, "MMMM d")} – ${format(e, "d, yyyy")}`;
  }
  return `${formatDate(s)} – ${formatDate(e)}`;
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy");
}

export function formatMonth(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMMM yyyy");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const group = key(item);
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// Get a stable cluster ID for nearby coordinates (used for globe marker grouping)
export function getLocationClusterId(lat: number, lng: number, precision = 1): string {
  return `${lat.toFixed(precision)},${lng.toFixed(precision)}`;
}

// Convert array of memories into globe marker clusters
export function clusterMemoriesByLocation<T extends { latitude: number; longitude: number }>(
  memories: T[],
  precision = 1,
): Map<string, T[]> {
  const clusters = new Map<string, T[]>();
  for (const memory of memories) {
    const key = getLocationClusterId(memory.latitude, memory.longitude, precision);
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key)!.push(memory);
  }
  return clusters;
}

// Extract dominant color from category
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    concert: "#8b5cf6",
    restaurant: "#f97316",
    cafe: "#f59e0b",
    travel: "#3b82f6",
    landmark: "#10b981",
    moment: "#f43f5e",
    milestone: "#eab308",
    nature: "#22c55e",
    art: "#a855f7",
    sports: "#06b6d4",
    other: "#6b7280",
  };
  return colors[category] ?? colors.other;
}

export function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================
// Atlas of Me — Core Type Definitions
// ============================================================

export type Category =
  | "concert"
  | "restaurant"
  | "cafe"
  | "travel"
  | "landmark"
  | "moment"
  | "milestone"
  | "nature"
  | "art"
  | "sports"
  | "other";

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  memoryId: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string | null;
  publicId?: string | null;
  caption?: string | null;
  orderIndex: number;
  width?: number | null;
  height?: number | null;
  createdAt: Date;
}

export interface Memory {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: Category;
  date: Date;
  endDate?: Date | null;
  locationName: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  tags: string[];
  mood?: string | null;
  colorTheme?: string | null;
  rating?: number | null;
  favorite: boolean;
  published: boolean;
  coverMediaId?: string | null;
  mediaItems: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  clerkId: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Globe marker type
export interface GlobeMarker {
  lat: number;
  lng: number;
  memories: Memory[];
  id: string;
  color: string;
  size: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Memory form data (for create/edit)
export interface MemoryFormData {
  title: string;
  description: string;
  category: Category;
  date: string;
  endDate?: string;
  locationName: string;
  latitude: number | string;
  longitude: number | string;
  address?: string;
  city?: string;
  country?: string;
  tags: string[];
  mood?: string;
  colorTheme?: string;
  rating?: number;
  favorite: boolean;
  published: boolean;
}

// Upload response from Cloudinary
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  width?: number;
  height?: number;
  thumbnail_url?: string;
}

// Stats for dashboard
export interface UserStats {
  totalMemories: number;
  totalCountries: number;
  totalCities: number;
  favoriteCount: number;
  categoryCounts: Record<string, number>;
}

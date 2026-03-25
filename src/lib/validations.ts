import { z } from "zod";

export const memorySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(5000, "Description too long").optional(),
  category: z.enum([
    "concert", "restaurant", "cafe", "travel", "landmark",
    "moment", "milestone", "nature", "art", "sports", "other",
  ]),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional().nullable(),
  locationName: z.string().min(1, "Location name is required").max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(300).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  mood: z.string().max(50).optional().nullable(),
  colorTheme: z.string().max(7).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  favorite: z.boolean().default(false),
  published: z.boolean().default(true),
  coverMediaId: z.string().optional().nullable(),
});

export const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  publicId: z.string().optional().nullable(),
  caption: z.string().max(200).optional().nullable(),
  orderIndex: z.number().int().min(0),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
});

export type MemoryInput = z.infer<typeof memorySchema>;
export type MediaItemInput = z.infer<typeof mediaItemSchema>;

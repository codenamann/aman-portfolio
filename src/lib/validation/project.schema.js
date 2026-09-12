import { z } from "zod";
import {
  SUPPORTED_FORMATS,
  SUPPORTED_STATUSES,
  PROJECT_FORMATS,
  PROJECT_STATUSES,
} from "@/lib/constants/limits";

export const projectSchema = z.object({
  id: z
    .string()
    .min(1, "Project ID is required")
    .regex(/^[a-z0-9-_]+$/, "ID must only contain lowercase alphanumeric characters, dashes, or underscores"),
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  subtitle: z.string().max(200).optional().default(""),
  category: z.string().optional().default(""),
  client: z.string().optional().default(""),
  year: z.string().default(() => new Date().getFullYear().toString()),
  duration: z.string().optional().default(""),
  tools: z.array(z.string()).default([]),
  platform: z.enum(["youtube", "instagram", "vimeo", "custom", "drive", "other"]).default("youtube"),
  format: z.enum(SUPPORTED_FORMATS).default(PROJECT_FORMATS.LONG_FORM),
  videoUrl: z.string().url("Must be a valid video URL"),
  youtubeId: z.string().optional().nullable(),
  instagramUrl: z.string().optional().default(""),
  links: z
    .object({
      youtube: z.string().optional().default(""),
      instagram: z.string().optional().default(""),
    })
    .optional()
    .default({}),
  thumbnail: z.string().optional().default(""),
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().min(0).max(999).optional().nullable(),
  spotlight: z.boolean().optional().default(false),
  status: z.enum(SUPPORTED_STATUSES).default(PROJECT_STATUSES.PUBLISHED),
  description: z.string().max(2000).optional().default(""),
  stats: z
    .object({
      rawViews: z.number().nullable().optional(),
      rawLikes: z.number().nullable().optional(),
      views: z.string().optional().default(""),
      likes: z.string().optional().default(""),
    })
    .optional()
    .default({}),
  tags: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  order: z.number().int().optional().default(0),
});

export const projectUpdateSchema = projectSchema.partial().extend({
  id: z.string().min(1),
});

export const featuredReorderSchema = z.object({
  format: z.enum(SUPPORTED_FORMATS),
  featuredIds: z
    .array(z.string())
    .max(4, "Cannot exceed 4 featured items per format"),
});
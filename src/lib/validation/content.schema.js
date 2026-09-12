import { z } from "zod";
import { CONTENT_SECTIONS } from "@/lib/constants/limits";

/**
 * 1. Profile & Global Contact Schema
 * Strict Zero-Default: purely scalar fields and one canonical socialLinks array.
 * No nested { label, value, href } objects, no fake initial data.
 */
export const profileContentSchema = z.object({
  name: z.string().optional().default(""),
  displayName: z.string().optional().default(""),
  role: z.string().optional().default(""),
  tagline: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
  email: z.string().optional().default(""),
  bookingUrl: z.string().optional().default(""),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(["instagram", "youtube", "linkedin", "behance", "dribbble", "x"]),
        url: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
});

/**
 * 2. About Bio & Work History Schema
 * Headings ("Designing experiences that make sense.") stay static in code.
 * Signature is the image URL reference to the authentic red signature. Zero script font fallbacks.
 */
export const aboutContentSchema = z.object({
  paragraphs: z.array(z.string()).optional().default([]),
  signature: z.string().optional().default(""),
  workHistory: z
    .array(
      z.object({
        id: z.string().optional(),
        company: z.string().optional().default(""),
        role: z.string().optional().default(""),
        period: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
});

/**
 * 3. Services Section Schema
 * Heading ("What I help you to Shape...") stays static in code.
 */
export const servicesContentSchema = z.object({
  services: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().optional().default(""),
        description: z.string().optional().default(""),
        icon: z
          .enum(["shortform", "motion", "color", "sound", "brand"])
          .optional()
          .default("shortform"),
        tags: z.array(z.string()).optional().default([]),
        variant: z.enum(["dark", "accent"]).optional().default("dark"),
      })
    )
    .optional()
    .default([]),
});

/**
 * 4. Creative Tools Catalog Selection Schema
 * Firestore stores strictly the list of enabled tool IDs.
 * Real SVG vector marks and brand colors live permanently in code (/logos/svg/*.svg & src/lib/logos.js).
 */
export const creativeToolsContentSchema = z.object({
  enabledTools: z.array(z.string()).optional().default([]),
});

/**
 * 5. Client Testimonials Schema
 * Rating is an optional number without default 5.
 */
export const testimonialsContentSchema = z.object({
  testimonials: z
    .array(
      z.object({
        id: z.string(),
        quote: z.string().optional().default(""),
        author: z.string().optional().default(""),
        role: z.string().optional().default(""),
        company: z.string().optional().default(""),
        avatar: z.string().optional().default(""),
        rating: z.number().min(1).max(5).optional(),
      })
    )
    .optional()
    .default([]),
});

/**
 * 6. Viewer Reactions Schema
 */
export const viewerReactionsContentSchema = z.object({
  reactions: z
    .array(
      z.object({
        id: z.string(),
        username: z.string().optional().default(""),
        comment: z.string().optional().default(""),
        age: z.string().optional().default(""),
        likes: z.string().optional().default(""),
        avatar: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
});

/**
 * 7. Testimonials / Marquee Display Config Schema
 */
export const testimonialsConfigSchema = z.object({
  showTestimonials: z.boolean().optional().default(true),
  showViewerReactions: z.boolean().optional().default(true),
});

/**
 * 8. Social Proof & Brand Logos Schema
 * Avatar stack is 100% hardcoded in code and excluded from Firestore.
 */
export const socialProofContentSchema = z.object({
  satisfiedClients: z.string().optional().default(""),
  rating: z.number().min(1).max(5).optional(),
  clientBrandLogos: z
    .array(
      z.object({
        src: z.string().optional().default(""),
        alt: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
});

/**
 * 9. FAQs & Discovery CTA Schema
 * Discovery CTA reuses profile.avatar and profile.bookingUrl from content/profile.
 */
export const faqsContentSchema = z.object({
  faqs: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().optional().default(""),
        answer: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  cta: z
    .object({
      title: z.string().optional().default(""),
      description: z.union([z.string(), z.array(z.string())]).optional().default([]),
    })
    .optional()
    .default({}),
});

/**
 * 10. Philosophy Quote Schema
 * "self" reuses content/profile (zero duplication); "testimonial" allows bespoke attribution fields.
 */
export const quoteContentSchema = z.object({
  type: z.enum(["self", "testimonial"]).optional().default("self"),
  quote: z.string().optional().default(""),
  author: z.string().optional().default(""),
  role: z.string().optional().default(""),
  company: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
});

export const genericSectionSchema = z.record(z.any());

/**
 * Validates content for a given section name.
 * @param {string} section
 * @param {Object} data
 */
export function validateContentSection(section, data) {
  switch (section) {
    case CONTENT_SECTIONS.PROFILE:
      return profileContentSchema.parse(data);
    case CONTENT_SECTIONS.ABOUT:
      return aboutContentSchema.parse(data);
    case CONTENT_SECTIONS.SERVICES:
      return servicesContentSchema.parse(data);
    case CONTENT_SECTIONS.CREATIVE_TOOLS:
      return creativeToolsContentSchema.parse(data);
    case CONTENT_SECTIONS.TESTIMONIALS:
      return testimonialsContentSchema.parse(data);
    case CONTENT_SECTIONS.VIEWER_REACTIONS:
      return viewerReactionsContentSchema.parse(data);
    case CONTENT_SECTIONS.TESTIMONIALS_CONFIG:
      return testimonialsConfigSchema.parse(data);
    case CONTENT_SECTIONS.SOCIAL_PROOF:
      return socialProofContentSchema.parse(data);
    case CONTENT_SECTIONS.FAQS:
      return faqsContentSchema.parse(data);
    case CONTENT_SECTIONS.QUOTE:
      return quoteContentSchema.parse(data);
    default:
      return genericSectionSchema.parse(data);
  }
}

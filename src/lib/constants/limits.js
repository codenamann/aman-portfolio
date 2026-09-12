/**
 * Central Portfolio & CMS Business Limits & Canonical Constants
 */

// Featured slot constraints on homepage (Strict 4+4 model)
export const MAX_FEATURED_SHORT_FORM = 4;
export const MAX_FEATURED_LONG_FORM = 4;

// Canonical Project Formats
export const PROJECT_FORMATS = {
  SHORT_FORM: "short-form",
  LONG_FORM: "long-form",
};

export const SUPPORTED_FORMATS = [
  PROJECT_FORMATS.SHORT_FORM,
  PROJECT_FORMATS.LONG_FORM,
];

// Project Publication Statuses
export const PROJECT_STATUSES = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

export const SUPPORTED_STATUSES = [
  PROJECT_STATUSES.PUBLISHED,
  PROJECT_STATUSES.DRAFT,
  PROJECT_STATUSES.ARCHIVED,
];

// Ingestion Source Types
export const INGESTION_SOURCES = {
  DATA_API_V3: "data-api-v3",
  OEMBED_FALLBACK: "oembed-fallback",
  MANUAL: "manual",
};

// Content Section Singletons in Firestore
export const CONTENT_SECTIONS = {
  PROFILE: "profile",
  ABOUT: "about",
  SERVICES: "services",
  CREATIVE_TOOLS: "creative-tools",
  TESTIMONIALS: "testimonials",
  VIEWER_REACTIONS: "viewer-reactions",
  TESTIMONIALS_CONFIG: "testimonials-config",
  FAQS: "faqs",
  SOCIAL_PROOF: "social-proof",
  QUOTE: "quote",
  SITE: "site",
  FOOTER: "footer",
};

export const SUPPORTED_CONTENT_SECTIONS = Object.values(CONTENT_SECTIONS);

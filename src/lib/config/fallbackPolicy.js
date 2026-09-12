import { person } from "@/data/person";
import { aboutData } from "@/data/about";
import { services, tools } from "@/data/services";
import { testimonialsData } from "@/data/testimonials";
import { viewerReactionsData } from "@/data/viewerReactions";
import { faqsData, discoveryCTAData } from "@/data/faqs";
import { socialProofData } from "@/data/socialProof";
import { defaultQuote } from "@/data/quote";
import { siteConfig } from "@/data/site";
import { footerData } from "@/data/footer";

/**
 * ============================================================================
 * LOCAL MASTER FALLBACK CONFIGURATION
 * ============================================================================
 * 
 * When MASTER_FALLBACK_ENABLED is false:
 * - NO section may use fallback under any circumstance.
 * - Firestore is strictly required.
 * - Missing Firestore docs resolve to clean empty / unconfigured states.
 */
export const MASTER_FALLBACK_ENABLED = false;

/**
 * Section-level fallback reference mapping (used ONLY if MASTER_FALLBACK_ENABLED is true).
 * Projects are ZERO-FALLBACK (Firestore only) and NEVER appear here.
 * Admin Panel never uses fallback under any circumstance.
 */
export const CONTENT_FALLBACK_CONFIG = {
  profile: {
    enabled: true,
    data: person,
  },
  about: {
    enabled: true,
    data: aboutData,
  },
  services: {
    enabled: true,
    data: { services },
  },
  "creative-tools": {
    enabled: true,
    data: { enabledTools: tools.map((t) => t.id) },
  },
  testimonials: {
    enabled: true,
    data: { testimonials: testimonialsData },
  },
  "viewer-reactions": {
    enabled: true,
    data: { reactions: viewerReactionsData },
  },
  "testimonials-config": {
    enabled: true,
    data: { showTestimonials: true, showViewerReactions: true },
  },
  faqs: {
    enabled: true,
    data: { faqs: faqsData, cta: discoveryCTAData },
  },
  "social-proof": {
    enabled: true,
    data: socialProofData,
  },
  quote: {
    enabled: true,
    data: defaultQuote,
  },
  site: {
    enabled: true,
    data: siteConfig,
  },
  footer: {
    enabled: true,
    data: footerData,
  },
};

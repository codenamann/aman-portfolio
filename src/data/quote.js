import { person } from "./person";

/**
 * Highlight / Credibility Quote Content
 *
 * Supports two modes:
 *
 * 1. Self-authored statement:
 *    {
 *      type: "self",
 *      quote: "Good design is about making the right things impossible to miss.",
 *      author: person.name,
 *      role: person.subtitle,
 *      avatar: person.avatar,
 *    }
 *
 * 2. External client testimonial:
 *    {
 *      type: "testimonial",
 *      quote: "...",
 *      author: "...",
 *      role: "...",
 *      company: "...",
 *      avatar: "/avatars/avatar4.jpg",
 *    }
 */
export const defaultQuote = {
  type: "self",
  quote: "Good design is about making the right things impossible to miss.",
  author: person.name,
  role: person.subtitle,
  avatar: person.avatar,
};

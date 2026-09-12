import "server-only";
import { getProjects } from "./getProjects";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
  PROJECT_FORMATS,
} from "@/lib/constants/limits";

/**
 * Retrieves the featured projects partitioned into short-form and long-form.
 * Strictly caps at 4 items per format (4+4 model).
 * 
 * @returns {Promise<{
 *   shortForm: Array<Object>,
 *   longForm: Array<Object>,
 *   all: Array<Object>
 * }>}
 */
export async function getFeaturedProjects() {
  const [shortFeatured, longFeatured] = await Promise.all([
    getProjects({
      format: PROJECT_FORMATS.SHORT_FORM,
      featured: true,
      status: "published",
      limit: MAX_FEATURED_SHORT_FORM,
    }),
    getProjects({
      format: PROJECT_FORMATS.LONG_FORM,
      featured: true,
      status: "published",
      limit: MAX_FEATURED_LONG_FORM,
    }),
  ]);

  // Enforce slice just in case
  const shortForm = shortFeatured.slice(0, MAX_FEATURED_SHORT_FORM);
  const longForm = longFeatured.slice(0, MAX_FEATURED_LONG_FORM);

  return {
    shortForm,
    longForm,
    all: [...shortForm, ...longForm],
  };
}

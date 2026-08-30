/**
 * Formats a numeric count or handles string count inputs for the client-count badge.
 *
 * @param {number|string} count - Numeric client count or pre-formatted string (e.g. "20+")
 * @returns {string} - Formatted display string
 */
export function formatClientCount(count) {
  if (typeof count === "string") {
    // If it's already a formatted string, just append "Happy clients"
    return `${count} Happy clients`;
  }

  if (typeof count !== "number" || isNaN(count)) {
    return "20+ Happy clients";
  }

  if (count < 150) {
    return "20+ Happy clients";
  }

  const bucket = Math.floor(count / 50) * 50;
  return `${bucket}+ Happy clients`;
}

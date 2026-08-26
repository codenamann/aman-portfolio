/**
 * Formats a numeric count into an editorial client-count bucket.
 *
 * Rules:
 *   - Numbers between 100 and 149 (or <150) format to "99+ Happy clients"
 *   - Numbers 150 and above round down to nearest 50 bucket (e.g. 150+, 200+, 250+)
 *
 * @param {number} count - Numeric client count
 * @returns {string} - Formatted display string
 */
export function formatClientCount(count) {
  if (typeof count !== "number" || isNaN(count)) {
    return "99+ Happy clients";
  }

  if (count < 150) {
    return "99+ Happy clients";
  }

  const bucket = Math.floor(count / 50) * 50;
  return `${bucket}+ Happy clients`;
}

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Raw 11-character ID strings
 *
 * @param {string} url - YouTube URL or video ID
 * @returns {string|null} - Extracted video ID or null if invalid
 */
export function getYouTubeVideoId(url) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // If already an 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex capturing standard youtube formats
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regex);

  return match ? match[1] : null;
}

/**
 * Returns the direct YouTube thumbnail URL for a given video ID or URL.
 * Standard resolutions:
 * - 'maxresdefault' (1280x720)
 * - 'sddefault' (640x480)
 * - 'hqdefault' (480x360)
 * - 'mqdefault' (320x180)
 *
 * @param {string} urlOrId - YouTube URL or Video ID
 * @param {'maxresdefault'|'sddefault'|'hqdefault'|'mqdefault'} quality
 * @returns {string} - Thumbnail URL
 */
export function getYouTubeThumbnail(urlOrId, quality = "maxresdefault") {
  const videoId = getYouTubeVideoId(urlOrId);
  if (!videoId) return "";
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Returns a privacy-enhanced YouTube embed URL.
 *
 * @param {string} urlOrId - YouTube URL or Video ID
 * @param {Object} options
 * @param {boolean} [options.autoplay=true]
 * @returns {string} - YouTube embed URL
 */
export function getYouTubeEmbedUrl(urlOrId, { autoplay = true } = {}) {
  const videoId = getYouTubeVideoId(urlOrId);
  if (!videoId) return "";
  const autoplayParam = autoplay ? "1" : "0";
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0&modestbranding=1&playsinline=1`;
}

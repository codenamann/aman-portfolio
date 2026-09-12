import "server-only";
import { PROJECT_FORMATS, PROJECT_STATUSES } from "@/lib/constants/limits";

/**
 * Parses an ISO 8601 duration string (e.g., PT1H2M30S, PT45S, PT3M) into seconds and MM:SS / HH:MM:SS format.
 * @param {string} isoString
 * @returns {{ seconds: number, formatted: string }}
 */
export function parseIsoDuration(isoString) {
  if (!isoString || typeof isoString !== "string") {
    return { seconds: 0, formatted: "00:00" };
  }

  const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return { seconds: 0, formatted: "00:00" };
  }

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  let formatted = "";
  if (hours > 0) {
    formatted = `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  } else {
    formatted = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return { seconds: totalSeconds, formatted };
}

/**
 * Formats a raw number count into compact human-readable string (e.g., 1.2M, 450K, 850)
 * @param {number | null | undefined} num
 * @returns {string}
 */
export function formatCompactNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toString();
}

/**
 * Generates a clean URL-friendly slug from title
 * @param {string} title
 * @returns {string}
 */
export function slugify(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes YouTube metadata into standard Project Schema.
 * 
 * @param {Object} fetchedResult - Output of fetchYouTubeMetadata
 * @returns {Object} Normalized project data payload
 */
export function normalizeYouTubeMetadata(fetchedResult) {
  const { raw, parsedUrl, source, isPartialMetadata, unavailableFields, warningMessage } =
    fetchedResult;

  const durationParsed = parseIsoDuration(raw.duration);

  // Determine format:
  // 1. Explicit /shorts/ URL
  // 2. Duration <= 60 seconds (unless explicitly overriden)
  let format = PROJECT_FORMATS.LONG_FORM;
  if (parsedUrl.isShorts || (durationParsed.seconds > 0 && durationParsed.seconds <= 60)) {
    format = PROJECT_FORMATS.SHORT_FORM;
  }

  // Select best available thumbnail URL
  const thumbs = raw.thumbnails || {};
  const thumbnail =
    thumbs.maxres?.url ||
    thumbs.standard?.url ||
    thumbs.high?.url ||
    thumbs.medium?.url ||
    thumbs.default?.url ||
    `https://i.ytimg.com/vi/${parsedUrl.videoId}/hqdefault.jpg`;

  const currentYear = new Date().getFullYear().toString();
  const publishedYear = raw.publishedAt
    ? new Date(raw.publishedAt).getFullYear().toString()
    : currentYear;

  const title = raw.title || "";
  const id = slugify(title) || `yt-${parsedUrl.videoId}`;

  return {
    id,
    title,
    subtitle: raw.channelTitle ? `Edited for ${raw.channelTitle}` : "Motion & Visual Edit",
    category: format === PROJECT_FORMATS.SHORT_FORM ? "Short-Form Edit" : "Video Editing & Motion",
    client: raw.channelTitle || "Aman Shrivastava",
    year: publishedYear,
    duration: durationParsed.formatted !== "00:00" ? durationParsed.formatted : "",
    tools: ["Premiere Pro", "After Effects"],
    platform: "youtube",
    format,
    videoUrl: parsedUrl.canonicalUrl,
    youtubeId: parsedUrl.videoId,
    thumbnail,
    featured: false,
    featuredOrder: null,
    spotlight: false,
    status: PROJECT_STATUSES.PUBLISHED,
    description: raw.description?.slice(0, 300) || "",
    stats: {
      rawViews: raw.viewCount,
      rawLikes: raw.likeCount,
      views: formatCompactNumber(raw.viewCount),
      likes: formatCompactNumber(raw.likeCount),
    },
    tags: raw.tags || [],
    deliverables: [
      "Visual Pacing & Narrative Cuts",
      "Motion Graphics & Titles",
      "Sound Design & SFX Mixing",
      "Color Grading",
    ],
    // Audit & Source Metadata
    ingestion: {
      source,
      isPartialMetadata,
      unavailableFields,
      warningMessage: warningMessage || null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

import "server-only";
import { parseYouTubeUrl } from "./parseUrl";
import { INGESTION_SOURCES } from "@/lib/constants/limits";

/**
 * Fetches video metadata via YouTube Data API v3.
 * @param {string} videoId
 * @param {string} apiKey
 * @returns {Promise<Object>}
 */
async function fetchViaDataApi(videoId, apiKey) {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 }, // no cache for ingestion
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      errorBody?.error?.message || `YouTube API returned status ${res.status}`;
    throw new Error(message);
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found or is private on YouTube");
  }

  const item = data.items[0];
  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};
  const statistics = item.statistics || {};

  return {
    source: INGESTION_SOURCES.DATA_API_V3,
    isPartialMetadata: false,
    unavailableFields: [],
    raw: {
      videoId,
      title: snippet.title || "",
      description: snippet.description || "",
      channelTitle: snippet.channelTitle || "",
      publishedAt: snippet.publishedAt || null,
      tags: snippet.tags || [],
      thumbnails: snippet.thumbnails || {},
      duration: contentDetails.duration || "", // ISO 8601, e.g. PT1M30S
      viewCount: statistics.viewCount ? parseInt(statistics.viewCount, 10) : null,
      likeCount: statistics.likeCount ? parseInt(statistics.likeCount, 10) : null,
      commentCount: statistics.commentCount
        ? parseInt(statistics.commentCount, 10)
        : null,
    },
  };
}

/**
 * Fetches video metadata via limited YouTube oEmbed endpoint.
 * Used as a graceful fallback when Data API v3 key is missing or quota is exhausted.
 * @param {string} videoId
 * @returns {Promise<Object>}
 */
async function fetchViaOembed(videoId) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  const res = await fetch(oembedUrl, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(
      `YouTube oEmbed endpoint failed with status ${res.status}. Video may not exist, is private, or embed is disabled.`
    );
  }

  const data = await res.json();

  return {
    source: INGESTION_SOURCES.OEMBED_FALLBACK,
    isPartialMetadata: true,
    unavailableFields: [
      "viewCount",
      "likeCount",
      "duration",
      "publishedAt",
      "tags",
      "fullDescription",
      "maxresThumbnail",
    ],
    warningMessage:
      "Limited metadata retrieved via oEmbed fallback (YouTube Data API v3 key not configured or quota reached). View count, exact duration, tags, and description should be reviewed and filled manually.",
    raw: {
      videoId,
      title: data.title || "",
      description: "",
      channelTitle: data.author_name || "",
      publishedAt: null,
      tags: [],
      thumbnails: {
        high: {
          url: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          width: data.thumbnail_width || 480,
          height: data.thumbnail_height || 360,
        },
      },
      duration: "",
      viewCount: null,
      likeCount: null,
      commentCount: null,
    },
  };
}

/**
 * Fetches YouTube video metadata with automatic Data API v3 -> oEmbed fallback.
 * 
 * @param {string} urlOrId
 * @returns {Promise<{
 *   source: string,
 *   isPartialMetadata: boolean,
 *   unavailableFields: string[],
 *   warningMessage?: string,
 *   parsedUrl: { videoId: string, isShorts: boolean, canonicalUrl: string },
 *   raw: Object
 * }>}
 */
export async function fetchYouTubeMetadata(urlOrId) {
  const parsed = parseYouTubeUrl(urlOrId);
  if (!parsed.isValid || !parsed.videoId) {
    throw new Error(parsed.error || "Invalid YouTube URL or ID");
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const data = await fetchViaDataApi(parsed.videoId, apiKey);
      return {
        ...data,
        parsedUrl: parsed,
      };
    } catch (err) {
      console.warn(
        `[YouTube Ingestion] Data API v3 failed for video ${parsed.videoId}: ${err.message}. Attempting oEmbed fallback...`
      );
      // Fallback to oEmbed
      const oembedData = await fetchViaOembed(parsed.videoId);
      return {
        ...oembedData,
        parsedUrl: parsed,
      };
    }
  } else {
    console.info(
      `[YouTube Ingestion] YOUTUBE_API_KEY is not set in environment. Using limited oEmbed fallback for video ${parsed.videoId}.`
    );
    const oembedData = await fetchViaOembed(parsed.videoId);
    return {
      ...oembedData,
      parsedUrl: parsed,
    };
  }
}

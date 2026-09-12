import "server-only";

// Allowed YouTube hostnames to prevent SSRF
const ALLOWED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

/**
 * Validates a YouTube URL or Video ID and safely extracts components.
 * Mitigates SSRF risks by enforcing strict hostname whitelisting and protocol checking.
 *
 * @param {string} input - YouTube URL or 11-char Video ID
 * @returns {{
 *   isValid: boolean,
 *   videoId: string | null,
 *   isShorts: boolean,
 *   canonicalUrl: string | null,
 *   error?: string
 * }}
 */
export function parseYouTubeUrl(input) {
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      videoId: null,
      isShorts: false,
      canonicalUrl: null,
      error: "Input must be a non-empty string",
    };
  }

  const trimmed = input.trim();

  // 1. Direct 11-character video ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      isValid: true,
      videoId: trimmed,
      isShorts: false,
      canonicalUrl: `https://www.youtube.com/watch?v=${trimmed}`,
    };
  }

  // 2. Parse URL safely
  let urlObj;
  try {
    // Add protocol if missing
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    urlObj = new URL(withProtocol);
  } catch {
    return {
      isValid: false,
      videoId: null,
      isShorts: false,
      canonicalUrl: null,
      error: "Invalid URL format",
    };
  }

  // 3. Protocol Whitelist (HTTPS/HTTP only)
  if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
    return {
      isValid: false,
      videoId: null,
      isShorts: false,
      canonicalUrl: null,
      error: "Only HTTP/HTTPS protocols are permitted",
    };
  }

  // 4. Hostname SSRF Check
  const hostname = urlObj.hostname.toLowerCase();
  if (!ALLOWED_YOUTUBE_HOSTS.has(hostname)) {
    return {
      isValid: false,
      videoId: null,
      isShorts: false,
      canonicalUrl: null,
      error: `Invalid hostname '${hostname}'. Only official YouTube URLs are accepted.`,
    };
  }

  let videoId = null;
  let isShorts = false;

  // 5. Extract Video ID from various YouTube URL patterns
  if (hostname === "youtu.be") {
    // youtu.be/VIDEO_ID
    const pathname = urlObj.pathname.slice(1); // remove leading slash
    const id = pathname.split("/")[0]?.split("?")[0];
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
      videoId = id;
    }
  } else {
    // youtube.com/...
    if (urlObj.pathname.startsWith("/shorts/")) {
      isShorts = true;
      const parts = urlObj.pathname.split("/shorts/");
      const id = parts[1]?.split("/")[0]?.split("?")[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        videoId = id;
      }
    } else if (urlObj.pathname.startsWith("/embed/")) {
      const parts = urlObj.pathname.split("/embed/");
      const id = parts[1]?.split("/")[0]?.split("?")[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        videoId = id;
      }
    } else if (urlObj.pathname.startsWith("/v/")) {
      const parts = urlObj.pathname.split("/v/");
      const id = parts[1]?.split("/")[0]?.split("?")[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        videoId = id;
      }
    } else {
      // Standard watch page: /watch?v=VIDEO_ID
      const v = urlObj.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        videoId = v;
      }
    }
  }

  if (!videoId) {
    return {
      isValid: false,
      videoId: null,
      isShorts: false,
      canonicalUrl: null,
      error: "Could not extract a valid 11-character YouTube video ID from the provided URL",
    };
  }

  const canonicalUrl = isShorts
    ? `https://www.youtube.com/shorts/${videoId}`
    : `https://www.youtube.com/watch?v=${videoId}`;

  return {
    isValid: true,
    videoId,
    isShorts,
    canonicalUrl,
  };
}

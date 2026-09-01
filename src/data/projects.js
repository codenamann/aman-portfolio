/**
 * Central Data-Driven Projects List & Work Archive
 *
 * Single Source of Truth for all portfolio projects.
 * - `videoUrl`: The canonical media link (YouTube or Instagram Reel).
 * - `thumbnail`: Optional art-directed override. If omitted, YouTube thumbnails
 *   are automatically resolved from the `videoUrl`.
 */
export const projects = [
  {
    id: "gaming-edit-intro",
    title: "Gaming Edit Intro",
    subtitle: "High-Energy Montage & SFX Mix",
    category: "Gaming & Intro Editing",
    client: "aman.mp4",
    year: "2025",
    duration: "00:45",
    tools: ["After Effects", "Premiere Pro"],
    platform: "youtube",
    format: "long-form",
    videoUrl: "https://youtu.be/A9oNxtGfWl8",
    featured: true,
    spotlight: true,
    description: "Vibrant and high-energy gaming montage intro featuring sync cuts, glow transitions, and impactful sound design.",
  },
  {
    id: "gameplay-edit",
    title: "Gameplay Edit",
    subtitle: "Dynamic Narrative Cutting & Sound Effects",
    category: "Gameplay Montage",
    client: "aman.mp4",
    year: "2024",
    duration: "01:15",
    tools: ["Premiere Pro", "After Effects"],
    platform: "youtube",
    format: "long-form",
    videoUrl: "https://youtu.be/e7f02vcAOxc",
    featured: true,
    description: "Clean narrative gameplay cut optimized for viewer retention, pacing, and visual storytelling.",
  },
  {
    id: "minimal-animation",
    title: "Minimal Animation",
    subtitle: "Sleek Vector Motion & Timing",
    category: "Kinetic Motion Graphics",
    client: "aman.mp4",
    year: "2025",
    duration: "00:15",
    tools: ["After Effects", "Illustrator"],
    platform: "youtube",
    format: "short",
    videoUrl: "https://youtube.com/shorts/CXAt1i7cgu4?si=zNbpTF7qYbH2YnwD",
    featured: true,
    description: "Minimalist vector animations focusing on fluid easing, clean visual timing, and typography layout.",
  },
  {
    id: "talking-head-short",
    title: "Talking Head Short",
    subtitle: "Dynamic Captions & Pacing Optimisation",
    category: "Vertical Short-form Content",
    client: "aman.mp4",
    year: "2025",
    duration: "00:30",
    tools: ["Premiere Pro", "CapCut"],
    platform: "youtube",
    format: "short",
    videoUrl: "https://youtube.com/shorts/hCdf8gzqH8s?si=AqMpThWjzU_sW2fK",
    featured: true,
    description: "Vertical edit optimizing spacing, silence truncation, and animated text overlay to sustain retention.",
  },
  {
    id: "edit-war-challenge",
    title: "Edit War Challenge",
    subtitle: "High-Pace Creator Showdown Edit",
    category: "Creative Challenge Film",
    client: "Tharun Speaks",
    year: "2025",
    duration: "03:40",
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    platform: "youtube",
    format: "long-form",
    videoUrl: "https://youtu.be/YtMKBc3Uacw",
    featured: true,
    description: "Fast-cut challenge edit for Tharun Speaks, featuring complex overlays, sound effects, and retention hacks.",
  },
  {
    id: "sound-design-assignment",
    title: "Sound Design Assignment",
    subtitle: "Immersive Foley & Sound Layering Showcase",
    category: "Audio Foley Design & Mix",
    client: "Tharun Speaks",
    year: "2024",
    duration: "02:10",
    tools: ["Audition", "Premiere Pro"],
    platform: "youtube",
    format: "long-form",
    videoUrl: "https://youtu.be/sVHXwQsEch8",
    featured: true,
    description: "Immersive foley and sound design showcase exploring layered sound effects, soundscapes, and audio leveling.",
  },
  {
    id: "talking-head-retargeting",
    title: "Talking Head Retargeting",
    subtitle: "Vertical Pacing & Text Layers",
    category: "Short-form Editing",
    client: "aman.mp4",
    year: "2025",
    duration: "00:40",
    tools: ["Premiere Pro", "After Effects"],
    platform: "youtube",
    format: "short",
    videoUrl: "https://youtube.com/shorts/b2uebu8LcOg?si=_StAKA0VBIkKreO9",
    featured: true,
    description: "Short-form talking head edit utilizing dynamic zooms, visual assets, and subtitles.",
  },
  {
    id: "podcast-edit",
    title: "Podcast Edit",
    subtitle: "Multi-Camera Audio Cuts & Overlays",
    category: "Podcast Shorts",
    client: "aman.mp4",
    year: "2025",
    duration: "00:45",
    tools: ["Premiere Pro", "DaVinci Resolve"],
    platform: "youtube",
    format: "short",
    videoUrl: "https://youtube.com/shorts/2GqPSviv6cE?si=se_2AHAqnlo7-2Bg",
    featured: true,
    description: "Smooth multi-cam podcast highlight clip showcasing dynamic camera switching, lower thirds, and B-roll integration.",
  },
  {
    id: "fast-pace-edit",
    title: "Fast Pace Edit",
    subtitle: "Tharun Speaks High-Retention Montage",
    category: "Retention-Driven Commercial Edit",
    client: "Tharun Speaks",
    year: "2025",
    duration: "02:50",
    tools: ["Premiere Pro", "After Effects"],
    platform: "youtube",
    format: "long-form",
    videoUrl: "https://youtu.be/LC4-6xBWY5A",
    featured: true,
    description: "Vibrant fast-paced montage re-edit focusing on pacing, retention, overlays, and custom typography.",
  },
  {
    id: "documentary-re-edit",
    title: "Documentary Re-Edit",
    subtitle: "Tharun Speaks Cinematic Storytelling",
    category: "Mini-Documentary Editorial",
    client: "Tharun Speaks",
    year: "2024",
    duration: "03:15",
    tools: ["DaVinci Resolve", "Premiere Pro"],
    platform: "youtube",
    format: "long-form",
    videoUrl: "https://youtu.be/Ti73LFimqPQ",
    featured: false,
    description: "Cinematic mini-documentary style re-edit featuring deep pacing, warm narrative color grading, and archival footage integration.",
  },
  {
    id: "typography-edit",
    title: "Typography Edit",
    subtitle: "Kinetic Layouts & Sound Rhythms",
    category: "Short-form Typography",
    client: "aman.mp4",
    year: "2025",
    duration: "00:35",
    tools: ["After Effects", "Photoshop"],
    platform: "youtube",
    format: "short",
    videoUrl: "https://youtube.com/shorts/HVHzhDXBdk0?si=8Zaqzf-u8g1D-jni",
    featured: true,
    description: "Kinetic typography layout and text motion sequence synced precisely to audio transients.",
  },
];

/**
 * Curated 4 vertical Shorts for homepage spotlight (only where featured !== false)
 */
export const featuredShorts = projects
  .filter((p) => p.featured !== false && (p.format === "short" || p.format === "reel"))
  .slice(0, 4);

/**
 * Curated 4 long-form videos for homepage (only where featured !== false)
 */
export const featuredLongForm = projects
  .filter((p) => p.featured !== false && p.format === "long-form")
  .slice(0, 4);

/**
 * Default featured projects on the homepage (4 vertical shorts)
 */
export const featuredProjects = featuredShorts;

/**
 * Filter categories available on the Work Archive page
 */
export const projectFilters = [
  { id: "all", label: "All Works" },
  { id: "long-form", label: "Long-form Film" },
  { id: "short", label: "Shorts & Reels" },
];

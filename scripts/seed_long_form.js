const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

// Ensure Node finds node_modules from creative-portfolio
const projectModules = path.resolve(__dirname, "../../node_modules");
module.paths.push(projectModules);

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function formatPrivateKey(key) {
  if (!key) return undefined;
  let formatted = key.trim();
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1);
  }
  return formatted.replace(/\\n/g, "\n");
}

const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase credentials!");
  process.exit(1);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });

const db = getFirestore(app);

const longFormProjects = [
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
    youtubeId: "A9oNxtGfWl8",
    thumbnail: "https://img.youtube.com/vi/A9oNxtGfWl8/maxresdefault.jpg",
    featured: true,
    featuredOrder: 1,
    spotlight: true,
    status: "published",
    description:
      "Vibrant and high-energy gaming montage intro featuring sync cuts, glow transitions, and impactful sound design.",
    links: {
      youtube: "https://youtu.be/A9oNxtGfWl8",
      instagram: "",
    },
    tags: ["gaming", "montage", "after-effects"],
    deliverables: ["4K Master", "Social Cuts"],
    order: 1,
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
    youtubeId: "e7f02vcAOxc",
    thumbnail: "https://img.youtube.com/vi/e7f02vcAOxc/maxresdefault.jpg",
    featured: true,
    featuredOrder: 2,
    spotlight: false,
    status: "published",
    description:
      "Clean narrative gameplay cut optimized for viewer retention, pacing, and visual storytelling.",
    links: {
      youtube: "https://youtu.be/e7f02vcAOxc",
      instagram: "",
    },
    tags: ["gameplay", "storytelling", "retention"],
    deliverables: ["Full Video"],
    order: 2,
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
    youtubeId: "YtMKBc3Uacw",
    thumbnail: "https://img.youtube.com/vi/YtMKBc3Uacw/maxresdefault.jpg",
    featured: true,
    featuredOrder: 3,
    spotlight: false,
    status: "published",
    description:
      "Fast-cut challenge edit for Tharun Speaks, featuring complex overlays, sound effects, and retention hacks.",
    links: {
      youtube: "https://youtu.be/YtMKBc3Uacw",
      instagram: "",
    },
    tags: ["challenge", "motion", "color-grade"],
    deliverables: ["Master Cut"],
    order: 3,
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
    youtubeId: "sVHXwQsEch8",
    thumbnail: "https://img.youtube.com/vi/sVHXwQsEch8/maxresdefault.jpg",
    featured: true,
    featuredOrder: 4,
    spotlight: false,
    status: "published",
    description:
      "Immersive foley and sound design showcase exploring layered sound effects, soundscapes, and audio leveling.",
    links: {
      youtube: "https://youtu.be/sVHXwQsEch8",
      instagram: "",
    },
    tags: ["foley", "sound-design", "mix"],
    deliverables: ["Dolby Audio Master"],
    order: 4,
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
    youtubeId: "LC4-6xBWY5A",
    thumbnail: "https://img.youtube.com/vi/LC4-6xBWY5A/maxresdefault.jpg",
    featured: true,
    featuredOrder: 5,
    spotlight: false,
    status: "published",
    description:
      "Vibrant fast-paced montage re-edit focusing on pacing, retention, overlays, and custom typography.",
    links: {
      youtube: "https://youtu.be/LC4-6xBWY5A",
      instagram: "",
    },
    tags: ["commercial", "fast-pace", "typography"],
    deliverables: ["Full Cut"],
    order: 5,
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
    youtubeId: "Ti73LFimqPQ",
    thumbnail: "https://img.youtube.com/vi/Ti73LFimqPQ/maxresdefault.jpg",
    featured: false,
    featuredOrder: null,
    spotlight: false,
    status: "published",
    description:
      "Cinematic mini-documentary style re-edit featuring deep pacing, warm narrative color grading, and archival footage integration.",
    links: {
      youtube: "https://youtu.be/Ti73LFimqPQ",
      instagram: "",
    },
    tags: ["documentary", "cinema", "color-grade"],
    deliverables: ["Archive Master"],
    order: 6,
  },
];

async function seed() {
  console.log("Seeding 6 long-form projects into Firestore...");
  const now = new Date().toISOString();

  for (const p of longFormProjects) {
    const docRef = db.collection("projects").doc(p.id);
    const existing = await docRef.get();
    if (!existing.exists) {
      await docRef.set({
        ...p,
        createdAt: now,
        updatedAt: now,
        createdBy: "seeder",
        updatedBy: "seeder",
      });
      console.log(`[Created] ${p.id} (${p.title})`);
    } else {
      await docRef.update({
        ...p,
        updatedAt: now,
        updatedBy: "seeder",
      });
      console.log(`[Updated] ${p.id} (${p.title})`);
    }
  }

  // Also update content/featured-showcase config with top 5 long-form projects!
  const showcaseRef = db.collection("content").doc("featured-showcase");
  await showcaseRef.set(
    {
      topFive: [
        "gaming-edit-intro",
        "gameplay-edit",
        "edit-war-challenge",
        "sound-design-assignment",
        "fast-pace-edit",
      ],
      updatedAt: now,
    },
    { merge: true }
  );

  console.log("[Success] All long-form projects successfully seeded into Firestore!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});

/**
 * Canonical Creative Tools Catalog for Portfolio Projects
 */
export const CREATIVE_TOOLS = [
  {
    id: "premiere-pro",
    name: "Premiere Pro",
    fullName: "Adobe Premiere Pro",
    logoKey: "premierePro",
    category: "editing",
  },
  {
    id: "after-effects",
    name: "After Effects",
    fullName: "Adobe After Effects",
    logoKey: "afterEffects",
    category: "motion",
  },
  {
    id: "davinci-resolve",
    name: "DaVinci Resolve",
    fullName: "DaVinci Resolve Studio",
    logoKey: "davinciResolve",
    category: "grading",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    fullName: "Adobe Photoshop",
    logoKey: "photoshop",
    category: "design",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    fullName: "Adobe Illustrator",
    logoKey: "illustrator",
    category: "design",
  },
  {
    id: "capcut",
    name: "CapCut",
    fullName: "CapCut Pro",
    logoKey: "capcut",
    category: "shortform",
  },
  {
    id: "blender",
    name: "Blender",
    fullName: "Blender 3D",
    logoKey: "blender",
    category: "3d",
  },
  {
    id: "final-cut-pro",
    name: "Final Cut Pro",
    fullName: "Final Cut Pro",
    logoKey: null,
    category: "editing",
  },
  {
    id: "cinema-4d",
    name: "Cinema 4D",
    fullName: "Cinema 4D",
    logoKey: null,
    category: "3d",
  },
  {
    id: "audition",
    name: "Audition",
    fullName: "Adobe Audition",
    logoKey: null,
    category: "audio",
  },
  {
    id: "figma",
    name: "Figma",
    fullName: "Figma",
    logoKey: "figma",
    category: "design",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    fullName: "Midjourney",
    logoKey: "midjourney",
    category: "ai",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    fullName: "ChatGPT / OpenAI",
    logoKey: "chatgpt",
    category: "ai",
  },
  {
    id: "claude",
    name: "Claude",
    fullName: "Claude AI",
    logoKey: "claude",
    category: "ai",
  },
];

/**
 * Find tool by name or id (case-insensitive)
 */
export function findCreativeTool(nameOrId) {
  if (!nameOrId || typeof nameOrId !== "string") return null;
  const query = nameOrId.trim().toLowerCase();
  return (
    CREATIVE_TOOLS.find(
      (t) =>
        t.name.toLowerCase() === query ||
        t.fullName.toLowerCase() === query ||
        t.id.toLowerCase() === query
    ) || null
  );
}

/**
 * Central Brand Logo Registry
 *
 * All local SVG brand marks reside in `/public/logos/svg/`
 * and resolve via `/logos/svg/<filename>.svg`.
 */
export const toolLogos = {
  photoshop: "/logos/svg/photoshop.svg",
  illustrator: "/logos/svg/illustrator.svg",
  premierePro: "/logos/svg/premiere-pro.svg",
  afterEffects: "/logos/svg/after-effects.svg",
  davinciResolve: "/logos/svg/davinci-resolve.svg",
  figma: "/logos/svg/figma.svg",
  framer: "/logos/svg/framer.svg",
  blender: "/logos/svg/blender.svg",
  canva: "/logos/svg/canva.svg",
  capcut: "/logos/svg/capcut.svg",
  notion: "/logos/svg/notion.svg",
  chatgpt: "/logos/svg/chatgpt.svg",
  openai: "/logos/svg/chatgpt.svg",
  claude: "/logos/svg/claude.svg",
  midjourney: "/logos/svg/midjourney.svg",
};

/**
 * Safely retrieve local SVG URL by key
 *
 * @param {string} key - Tool or brand identifier
 * @returns {string|null} - Local path to SVG asset
 */
export function getToolLogo(key) {
  if (!key) return null;
  const normalized = key.toLowerCase().replace(/[-_\s]/g, "");
  const matchKey = Object.keys(toolLogos).find(
    (k) => k.toLowerCase().replace(/[-_\s]/g, "") === normalized
  );
  return matchKey ? toolLogos[matchKey] : null;
}

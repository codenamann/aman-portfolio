"use client";

import { Check } from "lucide-react";
import { getToolLogo } from "@/lib/logos";

const AVAILABLE_TOOLS = [
  { id: "premiere-pro", name: "Adobe Premiere Pro", category: "Editing" },
  { id: "after-effects", name: "Adobe After Effects", category: "Motion & VFX" },
  { id: "davinci-resolve", name: "DaVinci Resolve", category: "Color & Post" },
  { id: "photoshop", name: "Adobe Photoshop", category: "Design" },
  { id: "illustrator", name: "Adobe Illustrator", category: "Vector" },
  { id: "blender", name: "Blender 3D", category: "3D & CGI" },
  { id: "figma", name: "Figma", category: "UI/UX" },
  { id: "framer", name: "Framer", category: "Interactive" },
  { id: "canva", name: "Canva", category: "Graphics" },
  { id: "capcut", name: "CapCut", category: "Fast Edit" },
  { id: "notion", name: "Notion", category: "Workflow" },
  { id: "chatgpt", name: "ChatGPT / OpenAI", category: "AI & Scripting" },
  { id: "claude", name: "Claude AI", category: "AI & Research" },
  { id: "midjourney", name: "Midjourney", category: "Generative AI" },
];

/**
 * 4. Creative Tools Editor
 * Strict Zero-Default: enabledTools is an array of selected tool IDs.
 * Real vector SVG logos are rendered from code (/logos/svg/*.svg).
 */
export default function CreativeToolsEditor({ data = {}, onChange }) {
  const content = data || {};
  const enabledTools = Array.isArray(content.enabledTools) ? content.enabledTools : [];

  const handleToggleTool = (toolId) => {
    if (enabledTools.includes(toolId)) {
      onChange({
        ...content,
        enabledTools: enabledTools.filter((id) => id !== toolId),
      });
    } else {
      onChange({
        ...content,
        enabledTools: [...enabledTools, toolId],
      });
    }
  };

  const handleSelectAll = () => {
    onChange({
      ...content,
      enabledTools: AVAILABLE_TOOLS.map((t) => t.id),
    });
  };

  const handleDeselectAll = () => {
    onChange({
      ...content,
      enabledTools: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Creative Tools Catalog ({enabledTools.length} / {AVAILABLE_TOOLS.length} Active)
            </h3>
            <p className="text-xs text-white/50">
              Toggle the software and tools displayed in the public Services &ldquo;Tools that I use&rdquo; grid.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {AVAILABLE_TOOLS.map((tool) => {
            const isEnabled = enabledTools.includes(tool.id);
            const logoPath = getToolLogo(tool.id);

            return (
              <div
                key={tool.id}
                onClick={() => handleToggleTool(tool.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                  isEnabled
                    ? "bg-[#e90c47]/10 border-[#e90c47]/40 text-white shadow-xs"
                    : "bg-[#1a1a1e] border-[#2b2b30] text-white/60 hover:bg-[#202024] hover:text-white/80"
                }`}
              >
                {/* Checkbox indicator */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition ${
                    isEnabled
                      ? "bg-[#e90c47] text-white"
                      : "border border-white/20 bg-transparent"
                  }`}
                >
                  {isEnabled && <Check size={13} strokeWidth={3} />}
                </div>

                {/* Real SVG Logo Icon */}
                {logoPath ? (
                  <div className="w-6 h-6 shrink-0 relative flex items-center justify-center">
                    <img
                      src={logoPath}
                      alt={tool.name}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-white/10 shrink-0" />
                )}

                {/* Tool Name & Category */}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-white/40 truncate mt-0.5">
                    {tool.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

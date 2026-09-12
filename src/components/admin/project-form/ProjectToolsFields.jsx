"use client";

import { useState, useMemo } from "react";
import { Plus, X, Search, Wrench, Check } from "lucide-react";
import { CREATIVE_TOOLS, findCreativeTool } from "@/lib/constants/tools";
import { getToolLogo } from "@/lib/logos";

/**
 * Compact Tool Logo Icon
 */
function ToolLogoIcon({ toolName, className = "w-3.5 h-3.5" }) {
  const toolDef = findCreativeTool(toolName);
  const logoKey = toolDef?.logoKey || toolName;
  const logoSrc = getToolLogo(logoKey);

  if (logoSrc) {
    return (
      <span
        className={`inline-block bg-current shrink-0 ${className}`}
        style={{
          maskImage: `url(${logoSrc})`,
          WebkitMaskImage: `url(${logoSrc})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        aria-hidden="true"
      />
    );
  }

  return <Wrench className={`text-zinc-500 shrink-0 ${className}`} />;
}

/**
 * Integrated, non-clipping Tools & Software Selector
 */
export default function ProjectToolsFields({
  selectedTools = [],
  onChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddTool = (toolName) => {
    const trimmed = toolName.trim();
    if (!trimmed) return;
    if (!selectedTools.includes(trimmed)) {
      onChange([...selectedTools, trimmed]);
    }
    setSearchQuery("");
  };

  const handleRemoveTool = (toolName) => {
    onChange(selectedTools.filter((t) => t !== toolName));
  };

  // Filter catalog tools based on search query, excluding already selected
  const availableTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CREATIVE_TOOLS.filter((t) => {
      const isSelected = selectedTools.includes(t.name);
      if (isSelected) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.fullName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedTools]);

  const queryTrimmed = searchQuery.trim();
  const isExactMatch = CREATIVE_TOOLS.some(
    (t) => t.name.toLowerCase() === queryTrimmed.toLowerCase()
  );
  const isAlreadySelected = selectedTools.some(
    (t) => t.toLowerCase() === queryTrimmed.toLowerCase()
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (availableTools.length > 0) {
        handleAddTool(availableTools[0].name);
      } else if (queryTrimmed && !isAlreadySelected) {
        handleAddTool(queryTrimmed);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
          Tools & Software
        </h3>
        <span className="text-[11px] font-mono text-[#6f6f76]">
          {selectedTools.length} selected
        </span>
      </div>

      {/* 1. Active Selected Tool Chips */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#a1a1a6] font-sans">
          Active Project Tools
        </label>
        <div className="min-h-[44px] p-2.5 rounded-xl bg-[#111113] border border-[#262628] flex flex-wrap items-center gap-2">
          {selectedTools.length === 0 ? (
            <span className="text-xs text-[#6f6f76] italic pl-1">
              No tools added yet. Select from the catalog below or type to add.
            </span>
          ) : (
            selectedTools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18181a] border border-[#262628] text-[#f2f2f2] text-xs font-medium transition hover:border-[#333338]"
              >
                <ToolLogoIcon toolName={tool} />
                <span>{tool}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTool(tool)}
                  className="text-[#6f6f76] hover:text-white p-0.5 -mr-1 rounded-sm transition cursor-pointer"
                  title={`Remove ${tool}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 2. Search & Catalog Quick-Add (Integrated in-flow, zero clipping) */}
      <div className="space-y-2.5 pt-1">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f76] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search catalog or type custom software (e.g. Descript)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111113] border border-[#262628] text-white text-xs sm:text-sm placeholder-[#6f6f76] focus:outline-hidden focus:border-[#e90c47] focus:ring-1 focus:ring-[#e90c47]/40 transition"
          />
        </div>

        {/* Available Quick-Add Pills Grid */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-[#6f6f76] block">
            {searchQuery ? "Matching Tools:" : "Available Catalog Tools (click to add):"}
          </span>

          <div className="flex flex-wrap items-center gap-1.5 max-h-48 overflow-y-auto pr-1 py-0.5">
            {availableTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleAddTool(tool.name)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18181a] hover:bg-[#1f1f22] active:bg-[#262628] border border-[#262628] hover:border-[#333338] text-[#a1a1a6] hover:text-white text-xs transition cursor-pointer"
              >
                <ToolLogoIcon toolName={tool.name} />
                <span>{tool.name}</span>
                <Plus size={12} className="text-[#6f6f76] group-hover:text-white ml-0.5" />
              </button>
            ))}

            {/* Custom Tool Button if query doesn't match catalog */}
            {queryTrimmed && !isExactMatch && !isAlreadySelected && (
              <button
                type="button"
                onClick={() => handleAddTool(queryTrimmed)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 border border-[#e90c47]/40 text-[#e90c47] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Plus size={13} />
                <span>Add custom &quot;{queryTrimmed}&quot;</span>
              </button>
            )}

            {availableTools.length === 0 && (!queryTrimmed || isAlreadySelected) && (
              <span className="text-xs text-[#6f6f76] font-mono py-1">
                {isAlreadySelected
                  ? "This tool is already added to the active list."
                  : "All catalog tools have been added."}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

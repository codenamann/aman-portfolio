"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ArrowRight, Video, FileEdit, Sparkles } from "lucide-react";
import { PROJECT_FORMATS } from "@/lib/constants/limits";
import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminAlert from "@/components/admin/ui/AdminAlert";

/**
 * Validates whether an input string is a recognizable YouTube video URL or ID
 */
export function isValidYouTubeUrl(input) {
  if (!input || typeof input !== "string") return false;
  const trimmed = input.trim();
  const ytPattern =
    /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/i;
  const rawIdPattern = /^[\w-]{11}$/;
  return ytPattern.test(trimmed) || rawIdPattern.test(trimmed);
}

/**
 * Enhanced Source Selection Step of Project Creation Flow
 * Supports both Automated YouTube Ingestion and Direct Blank Manual Creation.
 */
export default function ProjectSourceStep({
  url,
  onUrlChange,
  contentType,
  onContentTypeChange,
  onSubmit,
  onStartManual,
  loading = false,
  error = null,
}) {
  const [activeMode, setActiveMode] = useState("youtube"); // "youtube" | "manual"
  const inputRef = useRef(null);

  useEffect(() => {
    if (activeMode === "youtube" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeMode]);

  const isUrlValid = isValidYouTubeUrl(url);
  const isShortsUrl = url?.toLowerCase().includes("/shorts/");

  // Subtle notice if format and URL look inconsistent
  const showFormatWarning =
    isUrlValid &&
    ((isShortsUrl && contentType === PROJECT_FORMATS.LONG_FORM) ||
      (!isShortsUrl &&
        !url.includes("youtu.be") &&
        contentType === PROJECT_FORMATS.SHORT_FORM &&
        url.includes("watch?v=")));

  const handleYouTubeSubmit = (e) => {
    e.preventDefault();
    if (!isUrlValid || loading) return;
    onSubmit();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (onStartManual) onStartManual(contentType);
  };

  return (
    <div className="space-y-6 max-w-4xl min-w-0">
      {error && (
        <div className="space-y-2">
          <AdminAlert type="error" message={error} />
        </div>
      )}

      {/* Mode Selector Tabs (YouTube vs Manual) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setActiveMode("youtube")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3.5 select-none ${
            activeMode === "youtube"
              ? "bg-[#18181b] border-[#e90c47] shadow-[0_1px_3px_rgba(233,12,71,0.2)]"
              : "bg-[#151517] border-[#262628] hover:border-[#333338] text-zinc-400"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeMode === "youtube"
                ? "bg-[#e90c47]/15 text-[#e90c47]"
                : "bg-[#1f1f22] text-zinc-500"
            }`}
          >
            <Video size={18} />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${
                  activeMode === "youtube" ? "text-white" : "text-zinc-300"
                }`}
              >
                Import from YouTube
              </span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#e90c47]/20 text-[#e90c47]">
                Fast
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Auto-fetches title, duration, high-res thumbnail and YouTube ID.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("manual")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3.5 select-none ${
            activeMode === "manual"
              ? "bg-[#18181b] border-[#e90c47] shadow-[0_1px_3px_rgba(233,12,71,0.2)]"
              : "bg-[#151517] border-[#262628] hover:border-[#333338] text-zinc-400"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeMode === "manual"
                ? "bg-[#e90c47]/15 text-[#e90c47]"
                : "bg-[#1f1f22] text-zinc-500"
            }`}
          >
            <FileEdit size={18} />
          </div>
          <div className="space-y-1 min-w-0">
            <span
              className={`text-xs font-semibold block ${
                activeMode === "manual" ? "text-white" : "text-zinc-300"
              }`}
            >
              Create from Scratch
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Manually fill in title, video link, custom thumbnail, and tools.
            </p>
          </div>
        </button>
      </div>

      {/* Mode A: YouTube Form */}
      {activeMode === "youtube" && (
        <form
          onSubmit={handleYouTubeSubmit}
          className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-5"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#262628]/60">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
              YouTube Video Ingestion
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">
              oEmbed / v3 API
            </span>
          </div>

          {/* 1. YouTube URL Input */}
          <AdminFormField
            label="YouTube Video URL"
            description="Paste a standard YouTube URL (watch?v=...), Shorts URL (/shorts/...), or 11-char Video ID."
            required
          >
            <AdminInput
              ref={inputRef}
              type="url"
              required
              disabled={loading}
              placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </AdminFormField>

          {/* 2. Content Type Selection */}
          <AdminFormField
            label="Video Orientation & Format"
            description="Authoritative format rule: dictates whether this video appears in Long-form or Shorts."
            required
          >
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                disabled={loading}
                onClick={() => onContentTypeChange(PROJECT_FORMATS.LONG_FORM)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between disabled:opacity-50 select-none ${
                  contentType === PROJECT_FORMATS.LONG_FORM
                    ? "bg-[#e90c47]/10 border-[#e90c47] text-white"
                    : "bg-[#111113] border-[#262628] text-[#a1a1a6] hover:text-white hover:border-[#333338]"
                }`}
              >
                <span>Long-form</span>
                <span className="text-[10px] font-mono text-[#6f6f76]">
                  16:9
                </span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => onContentTypeChange(PROJECT_FORMATS.SHORT_FORM)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between disabled:opacity-50 select-none ${
                  contentType === PROJECT_FORMATS.SHORT_FORM
                    ? "bg-[#e90c47]/10 border-[#e90c47] text-white"
                    : "bg-[#111113] border-[#262628] text-[#a1a1a6] hover:text-white hover:border-[#333338]"
                }`}
              >
                <span>Short-form</span>
                <span className="text-[10px] font-mono text-[#6f6f76]">
                  9:16
                </span>
              </button>
            </div>
          </AdminFormField>

          {/* Inconsistent URL Warning */}
          {showFormatWarning && (
            <p className="text-[11px] text-amber-400/90 leading-relaxed font-mono">
              {isShortsUrl && contentType === PROJECT_FORMATS.LONG_FORM
                ? "Notice: You selected Long-form, but this URL appears to be a YouTube Short."
                : "Notice: You selected Short-form for a standard watch URL. Ensure this video is framed vertically."}
            </p>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={!isUrlValid || loading}
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Fetching Video Metadata...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Fetch & Pre-fill Form</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
            <span className="text-[11px] font-mono text-[#6f6f76] hidden sm:inline">
              Press Enter to fetch
            </span>
          </div>
        </form>
      )}

      {/* Mode B: Manual Blank Form Start */}
      {activeMode === "manual" && (
        <form
          onSubmit={handleManualSubmit}
          className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-5"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#262628]/60">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
              Manual Project Setup
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">
              Blank Template
            </span>
          </div>

          <AdminFormField
            label="Project Video Format"
            description="Choose whether this project belongs in the Short-form (9:16) or Long-form (16:9) portfolio section."
            required
          >
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => onContentTypeChange(PROJECT_FORMATS.LONG_FORM)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between select-none ${
                  contentType === PROJECT_FORMATS.LONG_FORM
                    ? "bg-[#e90c47]/10 border-[#e90c47] text-white"
                    : "bg-[#111113] border-[#262628] text-[#a1a1a6] hover:text-white hover:border-[#333338]"
                }`}
              >
                <span>Long-form</span>
                <span className="text-[10px] font-mono text-[#6f6f76]">
                  16:9
                </span>
              </button>

              <button
                type="button"
                onClick={() => onContentTypeChange(PROJECT_FORMATS.SHORT_FORM)}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between select-none ${
                  contentType === PROJECT_FORMATS.SHORT_FORM
                    ? "bg-[#e90c47]/10 border-[#e90c47] text-white"
                    : "bg-[#111113] border-[#262628] text-[#a1a1a6] hover:text-white hover:border-[#333338]"
                }`}
              >
                <span>Short-form</span>
                <span className="text-[10px] font-mono text-[#6f6f76]">
                  9:16
                </span>
              </button>
            </div>
          </AdminFormField>

          <div className="pt-2">
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <span>Open Project Editor</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

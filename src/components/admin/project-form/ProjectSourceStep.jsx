"use client";

import { useEffect, useRef } from "react";
import { Loader2, ArrowRight } from "lucide-react";
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
  const ytPattern = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/i;
  const rawIdPattern = /^[\w-]{11}$/;
  return ytPattern.test(trimmed) || rawIdPattern.test(trimmed);
}

/**
 * Source Section of Project Creation Flow
 * Allows manual URL entry, editing, format selection, and explicit trigger via Enter or button.
 */
export default function ProjectSourceStep({
  url,
  onUrlChange,
  contentType,
  onContentTypeChange,
  onSubmit,
  loading = false,
  error = null,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const isUrlValid = isValidYouTubeUrl(url);
  const isShortsUrl = url?.toLowerCase().includes("/shorts/");

  // Subtle notice if format and URL look inconsistent
  const showFormatWarning =
    isUrlValid &&
    ((isShortsUrl && contentType === PROJECT_FORMATS.LONG_FORM) ||
      (!isShortsUrl && !url.includes("youtu.be") && contentType === PROJECT_FORMATS.SHORT_FORM && url.includes("watch?v=")));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isUrlValid || loading) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl min-w-0">
      {error && (
        <div className="space-y-2">
          <AdminAlert type="error" message={error} />
        </div>
      )}

      {/* Standard Admin Form Card */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-5">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
          Source
        </h3>

        {/* 1. YouTube URL Input */}
        <AdminFormField
          label="YouTube Video URL"
          description="Paste a YouTube video URL or ID, then press Enter or click Fetch to import metadata."
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

        {/* 2. Content Type Selection (Authoritative) */}
        <AdminFormField
          label="Content Type"
          description="Dictates whether this video is horizontal (16:9) or vertical (9:16)."
          required
        >
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              disabled={loading}
              onClick={() => onContentTypeChange(PROJECT_FORMATS.LONG_FORM)}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between disabled:opacity-50 ${
                contentType === PROJECT_FORMATS.LONG_FORM
                  ? "bg-[#e90c47]/10 border-[#e90c47] text-white"
                  : "bg-[#111113] border-[#262628] text-[#a1a1a6] hover:text-white hover:border-[#333338]"
              }`}
            >
              <span>Long-form</span>
              <span className="text-[10px] font-mono text-[#6f6f76]">16:9</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onContentTypeChange(PROJECT_FORMATS.SHORT_FORM)}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between disabled:opacity-50 ${
                contentType === PROJECT_FORMATS.SHORT_FORM
                  ? "bg-[#e90c47]/10 border-[#e90c47] text-white"
                  : "bg-[#111113] border-[#262628] text-[#a1a1a6] hover:text-white hover:border-[#333338]"
              }`}
            >
              <span>Short-form</span>
              <span className="text-[10px] font-mono text-[#6f6f76]">9:16</span>
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

        {/* Action Button: Fetch Video Details */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={!isUrlValid || loading}
            className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Fetching Metadata...</span>
              </>
            ) : (
              <>
                <span>Fetch Video Details</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
          <span className="text-[11px] font-mono text-[#6f6f76] hidden sm:inline">
            Press Enter to fetch
          </span>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminInput from "@/components/admin/ui/AdminInput";

/**
 * YouTube Video Metadata Ingestion Modal Component
 */
export default function YouTubeIngestModal({
  isOpen,
  onClose,
  onIngestSuccess,
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setPreviewData(null);

      const res = await fetch("/api/youtube/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to ingest YouTube video");
      }

      setPreviewData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (previewData?.project) {
      onIngestSuccess(previewData.project);
      onClose();
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingest YouTube Video"
      subtitle="Auto-populate metadata, thumbnails, tags, and metrics from YouTube."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleFetch} className="space-y-3">
        <label className="block text-xs font-medium text-zinc-300 font-sans">
          YouTube Video or Shorts URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <AdminInput
            type="url"
            required
            placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="min-h-[44px] px-5 py-2.5 bg-[#e90c47] hover:bg-[#d00a3e] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>Fetch</span>
            )}
          </button>
        </div>
        <p className="text-[11px] text-zinc-500 leading-normal">
          Supports standard YouTube URLs, Shorts links, and raw 11-char video IDs.
        </p>
      </form>

      {/* Error Feedback */}
      {error && <AdminAlert type="error" message={error} />}

      {/* Preview Card */}
      {previewData && previewData.project && (
        <div className="space-y-4 pt-2 border-t border-white/5">
          {previewData.isPartialMetadata && (
            <AdminAlert
              type="warning"
              message={
                previewData.warningMessage ||
                "Limited Metadata (oEmbed Fallback). Verify views and duration."
              }
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3.5 rounded-xl bg-[#111113] border border-white/10 sm:items-center">
            {previewData.project.thumbnail && (
              <div className="w-full sm:w-24 h-32 sm:h-16 relative overflow-hidden rounded-lg shrink-0 border border-white/10">
                <Image
                  src={previewData.project.thumbnail}
                  alt={previewData.project.title || ""}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/10 mb-1 font-mono">
                {previewData.project.format}
              </span>
              <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                {previewData.project.title}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-mono">
                Client: {previewData.project.client || "—"} | Duration:{" "}
                {previewData.project.duration || "N/A"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full min-h-[44px] py-2.5 bg-white text-black hover:bg-zinc-200 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle2 size={16} />
            <span>Apply Metadata to Project Form</span>
          </button>
        </div>
      )}
    </AdminModal>
  );
}

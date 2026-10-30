"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { PROJECT_FORMATS, PROJECT_STATUSES } from "@/lib/constants/limits";
import ProjectSourceStep, { isValidYouTubeUrl } from "./ProjectSourceStep";

const ProjectEditor = dynamic(() => import("./ProjectEditor"), {
  loading: () => (
    <div className="space-y-6 max-w-4xl min-w-0 animate-pulse">
      <div className="p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-4">
        <div className="h-4 w-40 bg-[#1f1f22] rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-[#18181a] rounded-lg" />
          <div className="h-10 bg-[#18181a] rounded-lg" />
        </div>
      </div>
    </div>
  ),
});

/**
 * Orchestrates Project Creation Flow:
 * Step 1: Source & Format selection (YouTube URL ingestion OR Blank Manual Entry)
 * Step 2: Full Project Editor with pre-populated or blank fields ready for save
 */
export default function ProjectCreationFlow() {
  const [step, setStep] = useState("source"); // "source" | "editor"
  const [url, setUrl] = useState("");
  const [contentType, setContentType] = useState(PROJECT_FORMATS.LONG_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingestedProject, setIngestedProject] = useState(null);
  const [isPartialMetadata, setIsPartialMetadata] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const [unavailableFields, setUnavailableFields] = useState([]);
  const [isManualMode, setIsManualMode] = useState(false);

  // Ingestion API caller
  const performIngestion = useCallback(
    async (targetUrl, selectedFormat) => {
      const trimmedUrl = (targetUrl || "").trim();
      if (!isValidYouTubeUrl(trimmedUrl)) {
        setError("Please enter a valid YouTube video URL or ID.");
        return;
      }
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/youtube/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmedUrl }),
        });

        const data = await res.json();

        if (!res.ok || !data.success || !data.project) {
          throw new Error(
            data.error ||
              "Unable to fetch video information. Please check the URL and try again."
          );
        }

        // Apply authoritative format chosen by admin
        const finalProject = {
          ...data.project,
          format: selectedFormat,
        };

        setIngestedProject(finalProject);
        setIsPartialMetadata(Boolean(data.isPartialMetadata));
        setWarningMessage(data.warningMessage || null);
        setUnavailableFields(data.unavailableFields || []);
        setIsManualMode(false);
        setStep("editor");
      } catch (err) {
        console.error("[ProjectCreationFlow Error]", err);
        setError(
          err.message ||
            "Unable to fetch video information. The video may be private, restricted, or unavailable."
        );
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Handle manual blank project start
  const handleStartManual = (selectedFormat) => {
    const blankProject = {
      id: "",
      title: "",
      subtitle: "",
      year: new Date().getFullYear().toString(),
      duration: "",
      tools: [],
      platform: "youtube",
      format: selectedFormat,
      videoUrl: "",
      instagramUrl: "",
      thumbnail: "",
      featured: false,
      status: PROJECT_STATUSES.PUBLISHED,
    };
    setIngestedProject(blankProject);
    setIsPartialMetadata(false);
    setWarningMessage(null);
    setUnavailableFields([]);
    setIsManualMode(true);
    setStep("editor");
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (error) setError(null);
  };

  const handleContentTypeChange = (newType) => {
    setContentType(newType);
  };

  const handleFetchSubmit = () => {
    performIngestion(url, contentType);
  };

  const handleResetSource = () => {
    setStep("source");
  };

  return (
    <div className="space-y-6">
      {/* Visual Step Indicator */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <button
          type="button"
          onClick={() => setStep("source")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
            step === "source"
              ? "bg-[#1f1f22] border-[#333338] text-white font-semibold"
              : "bg-[#151517] border-[#262628] text-zinc-400 hover:text-white"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-[#e90c47] text-white text-[10px] flex items-center justify-center font-bold">
            1
          </span>
          <span>Source & Format</span>
        </button>

        <span className="text-zinc-600">→</span>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
            step === "editor"
              ? "bg-[#1f1f22] border-[#333338] text-white font-semibold"
              : "bg-[#151517] border-[#262628] text-zinc-500 opacity-60"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-zinc-700 text-zinc-300 text-[10px] flex items-center justify-center font-bold">
            2
          </span>
          <span>Project Details</span>
        </div>
      </div>

      {step === "source" ? (
        <ProjectSourceStep
          url={url}
          onUrlChange={handleUrlChange}
          contentType={contentType}
          onContentTypeChange={handleContentTypeChange}
          onSubmit={handleFetchSubmit}
          onStartManual={handleStartManual}
          loading={loading}
          error={error}
        />
      ) : (
        <ProjectEditor
          initialData={ingestedProject}
          isEdit={false}
          isIngested={!isManualMode}
          isPartial={isPartialMetadata}
          warningMessage={warningMessage}
          unavailableFields={unavailableFields}
          onResetSource={handleResetSource}
        />
      )}
    </div>
  );
}

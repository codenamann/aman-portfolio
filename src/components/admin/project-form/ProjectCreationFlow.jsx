"use client";

import { useState, useCallback } from "react";
import { PROJECT_FORMATS } from "@/lib/constants/limits";
import ProjectSourceStep, { isValidYouTubeUrl } from "./ProjectSourceStep";
import ProjectEditor from "./ProjectEditor";

/**
 * Orchestrates YouTube-first Project Creation Flow:
 * Step 1: Manual YouTube URL input & Format Selection, triggered explicitly on Enter or "Fetch Video Details"
 * Step 2: Full Project Editor pre-populated with YouTube metadata and ready for admin review/customization
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

  // Handle URL change
  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (error) setError(null);
  };

  // Handle Content Type change
  const handleContentTypeChange = (newType) => {
    setContentType(newType);
  };

  // Submit trigger (from button click or Enter key)
  const handleFetchSubmit = () => {
    performIngestion(url, contentType);
  };

  // Allow going back to Step 1 from Step 2
  const handleResetSource = () => {
    setStep("source");
  };

  if (step === "source") {
    return (
      <ProjectSourceStep
        url={url}
        onUrlChange={handleUrlChange}
        contentType={contentType}
        onContentTypeChange={handleContentTypeChange}
        onSubmit={handleFetchSubmit}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <ProjectEditor
      initialData={ingestedProject}
      isEdit={false}
      isIngested={true}
      isPartial={isPartialMetadata}
      warningMessage={warningMessage}
      unavailableFields={unavailableFields}
      onResetSource={handleResetSource}
    />
  );
}

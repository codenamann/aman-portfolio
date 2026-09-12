"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";
import ProjectBasicFields from "./ProjectBasicFields";
import ProjectMediaFields from "./ProjectMediaFields";
import ProjectStatusFields from "./ProjectStatusFields";
import ProjectToolsFields from "./ProjectToolsFields";
import ProjectFormActions from "./ProjectFormActions";
import { PROJECT_FORMATS, PROJECT_STATUSES } from "@/lib/constants/limits";

/**
 * Modular Project Editor Form Orchestrator
 * Simplified for creative video editing CMS workflow.
 */
export default function ProjectEditor({
  initialData = null,
  isEdit = false,
  isIngested = false,
  isPartial = false,
  warningMessage = null,
  onResetSource = null,
}) {
  const router = useRouter();
  const toast = useAdminToast();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    year: initialData?.year || new Date().getFullYear().toString(),
    duration: initialData?.duration || "",
    tools: Array.isArray(initialData?.tools) ? initialData.tools : [],
    platform: initialData?.platform || "youtube",
    format: initialData?.format || PROJECT_FORMATS.LONG_FORM,
    videoUrl: initialData?.videoUrl || initialData?.links?.youtube || "",
    instagramUrl: initialData?.instagramUrl || initialData?.links?.instagram || "",
    thumbnail: initialData?.thumbnail || "",
    featured: Boolean(initialData?.featured),
    status: initialData?.status || PROJECT_STATUSES.PUBLISHED,
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToolsChange = (toolsArray) => {
    setFormData((prev) => ({ ...prev, tools: toolsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isShort = formData.format === PROJECT_FORMATS.SHORT_FORM;
      const instagramLink = isShort ? (formData.instagramUrl?.trim() || "") : "";

      const payload = {
        id: formData.id.trim(),
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        year: formData.year.trim(),
        duration: formData.duration.trim(),
        tools: formData.tools,
        platform: formData.platform,
        format: formData.format,
        videoUrl: formData.videoUrl.trim(),
        instagramUrl: instagramLink,
        links: {
          youtube: formData.videoUrl.trim(),
          instagram: instagramLink,
        },
        thumbnail: formData.thumbnail.trim(),
        featured: formData.featured,
        status: formData.status,
      };

      const url = isEdit
        ? `/api/admin/projects/${encodeURIComponent(initialData.id)}`
        : `/api/admin/projects`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save project");
      }

      toast.success("Project saved successfully!");
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 700);
    } catch (err) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!isEdit || !initialData?.id) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(initialData.id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete project");
      }
      toast.success(`Project '${formData.title}' deleted successfully.`);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl min-w-0">
      {/* Ingestion notice */}
      {isIngested && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#151517] border border-[#262628] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#a1a1a6] shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[#f2f2f2]">YouTube metadata imported. Review and complete the fields below.</span>
          </div>
          {onResetSource && (
            <button
              type="button"
              onClick={onResetSource}
              className="text-[11px] font-mono text-[#a1a1a6] hover:text-white transition underline underline-offset-4 cursor-pointer self-start sm:self-auto"
            >
              Change URL
            </button>
          )}
        </div>
      )}

      {/* Partial Metadata Warning */}
      {isPartial && (
        <AdminAlert
          type="warning"
          message={
            warningMessage ||
            "Some YouTube information could not be retrieved. Please review the fields below."
          }
        />
      )}

      {/* 1. Basic Info */}
      <ProjectBasicFields
        formData={formData}
        onChange={handleFieldChange}
        isEdit={isEdit}
      />

      {/* 2. Media Source & Formats */}
      <ProjectMediaFields
        formData={formData}
        onChange={handleFieldChange}
      />

      {/* 3. Publication & Showcase Status */}
      <ProjectStatusFields
        formData={formData}
        onChange={handleFieldChange}
      />

      {/* 4. Tools & Software */}
      <ProjectToolsFields
        selectedTools={formData.tools}
        onChange={handleToolsChange}
      />

      {/* 5. Form Action Controls */}
      <ProjectFormActions
        loading={loading}
        isEdit={isEdit}
        onDelete={() => setConfirmDeleteOpen(true)}
      />

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={executeDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete '${formData.title}'? This action cannot be undone.`}
        confirmLabel="Delete Project"
        loading={loading}
      />
    </form>
  );
}

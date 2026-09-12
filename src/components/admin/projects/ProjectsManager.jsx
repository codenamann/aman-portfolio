"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminLoadingState from "@/components/admin/ui/AdminLoadingState";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";
import ProjectsToolbar from "./ProjectsToolbar";
import ProjectsTable from "./ProjectsTable";
import ProjectsMobileList from "./ProjectsMobileList";

/**
 * Projects Manager Orchestrator Component
 */
export default function ProjectsManager({ initialProjects = null }) {
  const router = useRouter();
  const toast = useAdminToast();
  const [projects, setProjects] = useState(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      toast.error("Failed to load projects list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialProjects) {
      fetchProjects();
    }
  }, [initialProjects]);

  const handleToggleFeatured = async (project) => {
    if (togglingFeaturedId) return;
    try {
      setTogglingFeaturedId(project.id);
      const newStatus = !project.featured;

      const res = await fetch("/api/admin/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          featured: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update featured status");
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, featured: newStatus } : p
        )
      );
      toast.success(
        `'${project.title}' ${newStatus ? "added to" : "removed from"} featured slots.`
      );
    } catch (err) {
      toast.error(err.message || "Failed to update featured status");
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setDeleting(true);
      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(projectToDelete.id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete project");
      }
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      toast.success(`Project '${projectToDelete.title}' deleted successfully.`);
      setProjectToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFormat =
      formatFilter === "all" || p.format === formatFilter;

    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;

    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && p.featured) ||
      (featuredFilter === "unfeatured" && !p.featured);

    return matchesSearch && matchesFormat && matchesStatus && matchesFeatured;
  });

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Header */}
      <AdminHeader
        title="Video Projects Archive"
        subtitle={`Manage and curate your portfolio archive (${projects.length} total projects).`}
        breadcrumbs={[{ label: "Projects" }]}
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <Link
              href="/admin/projects/new"
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Plus size={15} />
              <span>Add Project</span>
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <ProjectsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        formatFilter={formatFilter}
        onFormatFilterChange={setFormatFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
      />

      {/* Projects Container (Desktop Table + Mobile Cards) */}
      <div className="rounded-xl bg-[#151517] border border-[#262628] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        {loading ? (
          <AdminLoadingState message="Loading projects archive..." />
        ) : filteredProjects.length === 0 ? (
          <AdminEmptyState
            title="No projects found"
            description="No projects match your current search and filter settings."
          />
        ) : (
          <>
            <ProjectsTable
              projects={filteredProjects}
              togglingFeaturedId={togglingFeaturedId}
              onToggleFeatured={handleToggleFeatured}
              onDelete={(p) => setProjectToDelete(p)}
            />
            <ProjectsMobileList
              projects={filteredProjects}
              togglingFeaturedId={togglingFeaturedId}
              onToggleFeatured={handleToggleFeatured}
              onDelete={(p) => setProjectToDelete(p)}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AdminConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteProject}
        title="Delete Video Project"
        message={`Are you sure you want to permanently delete '${projectToDelete?.title}'? This action cannot be undone.`}
        confirmLabel="Delete Project"
        loading={deleting}
      />
    </div>
  );
}

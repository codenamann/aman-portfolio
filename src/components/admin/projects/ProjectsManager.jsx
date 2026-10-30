"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Film,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminLoadingState from "@/components/admin/ui/AdminLoadingState";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";
import dynamic from "next/dynamic";
import ProjectsToolbar from "./ProjectsToolbar";
import ProjectsTable from "./ProjectsTable";
import ProjectsMobileList from "./ProjectsMobileList";

const FeaturedSlotManager = dynamic(
  () => import("@/components/admin/featured/FeaturedSlotManager"),
  {
    loading: () => <AdminLoadingState message="Loading landing page curation..." />,
  }
);

const ArchiveShowcaseManager = dynamic(
  () => import("@/components/admin/showcase/ArchiveShowcaseManager"),
  {
    loading: () => <AdminLoadingState message="Loading movie carousel..." />,
  }
);

function ProjectsManagerInner({ initialProjects = null, initialShowcase = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useAdminToast();

  const tabParam = searchParams.get("tab");
  const defaultTab =
    tabParam === "landing"
      ? "landing"
      : tabParam === "carousel"
      ? "carousel"
      : "all";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [projects, setProjects] = useState(initialProjects || []);
  const [showcase, setShowcase] = useState(initialShowcase || null);
  const [loading, setLoading] = useState(!initialProjects);
  const [loadingShowcase, setLoadingShowcase] = useState(false);

  // Filters for "all" tab
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState(null);
  const [togglingStatusId, setTogglingStatusId] = useState(null);
  const [togglingCarouselId, setTogglingCarouselId] = useState(null);

  const getCarouselSlot = (projectId) => {
    if (!showcase) return null;
    const carouselIds =
      showcase.carouselIds ||
      showcase.rawConfig?.carouselIds ||
      showcase.config?.carouselIds;
    if (Array.isArray(carouselIds)) {
      const idx = carouselIds.indexOf(projectId);
      return idx !== -1 ? idx + 1 : null;
    }
    const raw = showcase.rawConfig || showcase.config || {};
    for (const [key, id] of Object.entries(raw)) {
      if (key.startsWith("slot") && id === projectId) {
        return parseInt(key.replace("slot", ""), 10);
      }
    }
    if (showcase.slotDetails) {
      for (const [key, detail] of Object.entries(showcase.slotDetails)) {
        if (detail?.mode === "manual" && detail?.project?.id === projectId) {
          return detail.slotNumber || parseInt(key.replace("slot", ""), 10);
        }
      }
    }
    return null;
  };

  const handleToggleStatus = async (project) => {
    if (togglingStatusId) return;
    try {
      setTogglingStatusId(project.id);
      const newStatus =
        (project.status || "published") === "published" ? "draft" : "published";

      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(project.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update project status");
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, status: newStatus } : p
        )
      );
      toast.success(
        `'${project.title}' is now ${newStatus === "published" ? "Published" : "Draft"}.`
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setTogglingStatusId(null);
    }
  };

  const handleToggleCarousel = async (project) => {
    if (togglingCarouselId) return;
    if (project.format !== "long-form") {
      toast.error("Only long-form films can be added to the cinema carousel.");
      return;
    }

    try {
      setTogglingCarouselId(project.id);
      const res = await fetch("/api/admin/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle",
          projectId: project.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update carousel");
      }

      if (data.showcase) {
        setShowcase(data.showcase);
      }
      toast.success(data.message || "Cinema carousel updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update carousel");
    } finally {
      setTogglingCarouselId(null);
    }
  };

  // Fetch projects list if not provided
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

  // Fetch showcase data if tab is carousel and not loaded yet
  useEffect(() => {
    if (activeTab === "carousel" && !showcase && !loadingShowcase) {
      setLoadingShowcase(true);
      fetch("/api/admin/showcase")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.showcase) {
            setShowcase(data.showcase);
          }
        })
        .catch((err) => {
          console.error("Failed to load showcase data:", err);
        })
        .finally(() => setLoadingShowcase(false));
    }
  }, [activeTab, showcase, loadingShowcase]);

  // Sync tab with URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tabId === "all") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tabId);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

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

  const TABS = [
    {
      id: "all",
      label: "All Projects",
      icon: Film,
      badge: `${projects.length}`,
    },
    {
      id: "landing",
      label: "Landing Page Featured",
      icon: Sparkles,
      badge: "4 Long + 4 Shorts",
    },
    {
      id: "carousel",
      label: "Projects Carousel",
      icon: SlidersHorizontal,
      badge: "5 Films",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Dynamic Header based on active tab */}
      {activeTab === "all" && (
        <AdminHeader
          title="Video Projects Archive"
          subtitle={`Manage and curate your portfolio repository (${projects.length} total projects).`}
          breadcrumbs={[{ label: "Projects" }]}
          actions={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <Link
                href="/admin/projects/new"
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Project</span>
              </Link>
            </div>
          }
        />
      )}

      {activeTab === "landing" && (
        <AdminHeader
          title="Landing Page Featured (4+4)"
          subtitle="Choose the exact 4 Long-form films and 4 Shorts & Reels displayed on your public homepage."
          breadcrumbs={[
            { label: "Projects", href: "/admin/projects" },
            { label: "Landing Page Featured" },
          ]}
          actions={
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.02] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span>View Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          }
        />
      )}

      {activeTab === "carousel" && (
        <AdminHeader
          title="Projects Cinema Carousel (Top 5 Films)"
          subtitle="Choose the 5 long-form films showcased in the full-width cinematic movie carousel at the top of your Projects Archive."
          breadcrumbs={[
            { label: "Projects", href: "/admin/projects" },
            { label: "Movie Carousel" },
          ]}
          actions={
            <Link
              href="/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.02] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span>View Projects Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          }
        />
      )}

      {/* Segmented Curation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151517] border border-[#262628] w-full sm:w-fit overflow-x-auto shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 select-none ${
                isActive
                  ? "bg-[#1f1f22] text-[#f2f2f2] border border-[#333338] font-semibold shadow-xs"
                  : "text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a]"
              }`}
            >
              <Icon
                size={14}
                className={isActive ? "text-[#e90c47]" : "text-[#6f6f76]"}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#e90c47]/15 text-[#e90c47] font-semibold"
                      : "bg-white/5 text-[#6f6f76]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: ALL PROJECTS LIST ────────────────────────────────────────── */}
      {activeTab === "all" && (
        <div className="space-y-5 sm:space-y-6">
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
                  togglingStatusId={togglingStatusId}
                  togglingCarouselId={togglingCarouselId}
                  onToggleFeatured={handleToggleFeatured}
                  onToggleStatus={handleToggleStatus}
                  onToggleCarousel={handleToggleCarousel}
                  onDelete={(p) => setProjectToDelete(p)}
                  getCarouselSlot={getCarouselSlot}
                />
                <ProjectsMobileList
                  projects={filteredProjects}
                  togglingFeaturedId={togglingFeaturedId}
                  togglingStatusId={togglingStatusId}
                  togglingCarouselId={togglingCarouselId}
                  onToggleFeatured={handleToggleFeatured}
                  onToggleStatus={handleToggleStatus}
                  onToggleCarousel={handleToggleCarousel}
                  onDelete={(p) => setProjectToDelete(p)}
                  getCarouselSlot={getCarouselSlot}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: LANDING PAGE FEATURED (4+4) ──────────────────────────────── */}
      {activeTab === "landing" && (
        <div className="pt-1">
          <FeaturedSlotManager initialProjects={projects} />
        </div>
      )}

      {/* ── TAB 3: PROJECTS MOVIE CAROUSEL (5 FILMS) ────────────────────────── */}
      {activeTab === "carousel" && (
        <div className="pt-1">
          {loadingShowcase && !showcase ? (
            <AdminLoadingState message="Loading carousel showcase..." />
          ) : (
            <ArchiveShowcaseManager
              initialShowcase={showcase}
              allProjects={projects}
              onShowcaseChange={setShowcase}
            />
          )}
        </div>
      )}

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

export default function ProjectsManager(props) {
  return (
    <Suspense fallback={<AdminLoadingState message="Loading..." />}>
      <ProjectsManagerInner {...props} />
    </Suspense>
  );
}

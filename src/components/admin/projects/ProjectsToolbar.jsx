import { Search } from "lucide-react";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminSelect from "@/components/admin/ui/AdminSelect";
import { PROJECT_FORMATS, PROJECT_STATUSES } from "@/lib/constants/limits";

/**
 * Projects List Filter & Search Toolbar
 */
export default function ProjectsToolbar({
  searchTerm,
  onSearchChange,
  formatFilter,
  onFormatFilterChange,
  statusFilter,
  onStatusFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
}) {
  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
      {/* Search Input */}
      <div className="w-full lg:max-w-md">
        <AdminInput
          type="text"
          placeholder="Search by title, hook/subtitle, or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
        <AdminSelect
          value={formatFilter}
          onChange={(e) => onFormatFilterChange(e.target.value)}
        >
          <option value="all">All Formats</option>
          <option value={PROJECT_FORMATS.SHORT_FORM}>Short-Form</option>
          <option value={PROJECT_FORMATS.LONG_FORM}>Long-Form</option>
        </AdminSelect>

        <AdminSelect
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value={PROJECT_STATUSES.PUBLISHED}>Published</option>
          <option value={PROJECT_STATUSES.DRAFT}>Draft</option>
          <option value={PROJECT_STATUSES.ARCHIVED}>Archived</option>
        </AdminSelect>

        <AdminSelect
          value={featuredFilter}
          onChange={(e) => onFeaturedFilterChange(e.target.value)}
        >
          <option value="all">All Featured</option>
          <option value="featured">Featured Only</option>
          <option value="unfeatured">Unfeatured Only</option>
        </AdminSelect>
      </div>
    </div>
  );
}

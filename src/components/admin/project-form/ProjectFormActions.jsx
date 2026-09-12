import Link from "next/link";
import { Save, Trash2, Loader2 } from "lucide-react";

/**
 * Bottom Actions Bar for Project Editor
 */
export default function ProjectFormActions({
  loading,
  isEdit,
  onDelete,
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#262628]">
      <div>
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs border border-red-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={15} />
            <span>Delete Project</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <Link
          href="/admin/projects"
          className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-lg text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a] font-semibold text-xs transition flex items-center justify-center"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto min-h-[44px] px-6 py-2 bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>{isEdit ? "Update Project" : "Create Project"}</span>
        </button>
      </div>
    </div>
  );
}

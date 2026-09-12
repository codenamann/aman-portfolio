"use client";

import { AlertTriangle } from "lucide-react";
import AdminModal from "./AdminModal";
import AdminButton from "./AdminButton";

/**
 * Reusable Confirmation Modal for Destructive Admin Actions
 */
export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  isDestructive = true,
}) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center gap-2.5 w-full justify-end">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={isDestructive ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
            loadingText={`${confirmLabel}...`}
          >
            {confirmLabel}
          </AdminButton>
        </div>
      }
    >
      <div className="flex items-start gap-3 py-1">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            isDestructive
              ? "bg-[#4c0519] text-[#fda4af] border border-[#881337]"
              : "bg-[#451a03] text-[#fcd34d] border border-[#78350f]"
          }`}
        >
          <AlertTriangle size={20} />
        </div>
        <p className="text-xs sm:text-sm text-[#f2f2f2] leading-relaxed font-sans">
          {message}
        </p>
      </div>
    </AdminModal>
  );
}

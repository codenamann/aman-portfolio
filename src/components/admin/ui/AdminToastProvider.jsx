"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ToastContext = createContext({
  showToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within an AdminToastProvider");
  }
  return context;
}

/**
 * Toast Container & Provider for Admin Panel
 * Fixed overlay positioning guarantees zero layout shift.
 */
export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type = "success", duration = 3500 }) => {
      idCounter.current += 1;
      const id = idCounter.current;
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback((msg, d) => showToast({ message: msg, type: "success", duration: d }), [showToast]);
  const error = useCallback((msg, d) => showToast({ message: msg, type: "error", duration: d || 4500 }), [showToast]);
  const warning = useCallback((msg, d) => showToast({ message: msg, type: "warning", duration: d }), [showToast]);
  const info = useCallback((msg, d) => showToast({ message: msg, type: "info", duration: d }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Fixed Toast Viewport Overlay */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              role="status"
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto p-3.5 rounded-xl bg-[#18181a] border border-[#262628] shadow-2xl flex items-start justify-between gap-3 text-xs text-[#f2f2f2]"
              style={{
                boxShadow: "0 12px 32px 0 rgba(0, 0, 0, 0.65), 0 4px 8px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                {toast.type === "success" && (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                )}
                {toast.type === "error" && (
                  <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                )}
                {toast.type === "warning" && (
                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                )}
                {toast.type === "info" && (
                  <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed font-sans break-words">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#6f6f76] hover:text-[#f2f2f2] p-0.5 rounded transition cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default AdminToastProvider;

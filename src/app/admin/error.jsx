"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Localized Admin Error Boundary
 * Preserves zero-default architecture: never renders fake sample data on failure.
 * Provides clear technical diagnostic info and instant retry capability.
 */
export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("[Admin Error Boundary Caught]", error);
  }, [error]);

  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#151517] border border-[#262628] shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-5">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Admin Operation Failed
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            An error occurred while communicating with Firestore or rendering this view.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-lg bg-[#111113] border border-[#222225] text-left">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
              Error Message
            </span>
            <code className="text-xs font-mono text-rose-300 break-words block">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>

          <Link
            href="/admin"
            className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-[#1f1f22] hover:bg-[#252529] border border-[#2e2e33] text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Home size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

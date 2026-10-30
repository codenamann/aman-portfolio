"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ProjectsError({ error, reset }) {
  useEffect(() => {
    console.error("[Projects Archive] Error boundary caught:", error);
  }, [error]);

  return (
    <div className="relative w-full min-h-screen bg-[#111113] text-white flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#161618] border border-white/10 shadow-2xl flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#ea0044]/10 border border-[#ea0044]/20 flex items-center justify-center text-[#ea0044] mb-6">
          <AlertCircle size={28} />
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2">
          Unable to Load Projects
        </h1>

        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          {error?.message || "Could not retrieve the project catalogue from the database. Please try again."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#ea0044] text-white font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-[#ea0044]/20"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Home size={16} />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

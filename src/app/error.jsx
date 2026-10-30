"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[Portfolio] Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl flex flex-col items-center text-center">
        {/* Branded Error Icon */}
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6">
          <AlertCircle size={28} />
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight mb-2">
          Something went wrong
        </h1>

        <p className="text-sm text-muted mb-8 leading-relaxed">
          {error?.message || "An unexpected error occurred while loading this page. Please try refreshing."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent text-white font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-accent/20"
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

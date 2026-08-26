import React from "react";
import Image from "next/image";

/**
 * Reusable CommentCard component with accent glow / fill transition on hover
 */
export default function CommentCard({ comment, className = "" }) {
  if (!comment) return null;

  return (
    <div
      className={`group w-[290px] sm:w-[340px] rounded-2xl bg-[#1c1c1f] hover:bg-accent border border-[#2e2e33] hover:border-transparent px-4 py-3 sm:px-5 sm:py-3.5 flex items-start gap-3 shrink-0 select-none cursor-pointer shadow-md transition-all duration-300 ease-out ${className}`}
    >
      {/* ── User Avatar ──────────────────────────────────────────────────── */}
      {comment.avatar && (
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 shrink-0 mt-0.5 transition-colors duration-300">
          <Image
            src={comment.avatar}
            alt={comment.username}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
      )}

      {/* ── Content & Metadata ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-xs sm:text-[13px] leading-snug break-words">
          <span className="font-bold text-foreground group-hover:text-white mr-1.5 transition-colors duration-300">
            {comment.username}
          </span>
          <span className="text-foreground/85 group-hover:text-white font-normal transition-colors duration-300">
            {comment.comment}
          </span>
        </p>

        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-muted group-hover:text-white/80 font-medium mt-1.5 transition-colors duration-300">
          <span>{comment.age}</span>
          <span>{comment.likes}</span>
          <span className="cursor-pointer group-hover:text-white">Reply</span>
        </div>
      </div>
    </div>
  );
}

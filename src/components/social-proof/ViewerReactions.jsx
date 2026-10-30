"use client";

import React from "react";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import CommentCard from "./CommentCard";

/**
 * ViewerReactions Section:
 * Renders real audience / viewer feedback scrolling rightward via InfiniteMarquee
 */
export default function ViewerReactions({
  reactions = [],
  direction = "right",
  speed = 40,
  isPlaying = true,
  className = "",
}) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <InfiniteMarquee
        direction={direction}
        speed={speed}
        gap="gap-3.5 sm:gap-4"
        isPlaying={isPlaying}
        className="overflow-visible"
      >
        {reactions.map((item) => (
          <div key={item.id || item.username} className="reaction-card-item shrink-0">
            <CommentCard comment={item} />
          </div>
        ))}
      </InfiniteMarquee>
    </div>
  );
}

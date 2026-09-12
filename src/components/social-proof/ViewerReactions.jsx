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
  className = "",
}) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <InfiniteMarquee
        direction={direction}
        speed={speed}
        gap="gap-3.5 sm:gap-4"
        className="overflow-visible"
      >
        {reactions.map((item) => (
          <CommentCard key={item.id || item.username} comment={item} />
        ))}
      </InfiniteMarquee>
    </div>
  );
}

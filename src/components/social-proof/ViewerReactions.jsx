"use client";

import React from "react";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import CommentCard from "./CommentCard";
import { viewerReactionsData } from "@/data/viewerReactions";

/**
 * ViewerReactions Section:
 * Renders real audience / viewer feedback scrolling rightward via the generic InfiniteMarquee
 */
export default function ViewerReactions({
  reactions = viewerReactionsData,
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
          <CommentCard key={item.id} comment={item} />
        ))}
      </InfiniteMarquee>
    </div>
  );
}

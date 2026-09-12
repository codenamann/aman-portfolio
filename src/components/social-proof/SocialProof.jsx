"use client";

import { cn } from "@/lib/utils";
import SocialProofSummary from "./SocialProofSummary";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import { tools as defaultTools } from "@/data/socialProof";

// Static hardcoded avatar stack (strictly code-controlled)
const STATIC_AVATARS = [
  { src: "/avatars/avatar1.jpg", alt: "Client 1" },
  { src: "/avatars/avatar2.jpg", alt: "Client 2" },
  { src: "/avatars/avatar3.jpg", alt: "Client 3" },
  { src: "/avatars/avatar4.jpg", alt: "Client 4" },
  { src: "/avatars/avatar5.jpg", alt: "Client 5" },
];

/**
 * Main SocialProof / Client Bar
 */
export default function SocialProof({
  data,
  className = "",
}) {
  const activeData = data || {};

  // Display creative tools in the marquee
  const activeItems = (data && data.tools && data.tools.length > 0) ? data.tools : defaultTools;

  return (
    <div
      aria-label="Client reviews and trusted brands"
      className={cn(
        "w-full py-10 md:py-8 border-t border-border bg-background overflow-hidden",
        className,
      )}
    >
      <div className="section-container section-px">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-14">
          {/* Review badge with static hardcoded avatar stack */}
          <SocialProofSummary
            avatars={STATIC_AVATARS}
            rating={activeData.rating || 5}
            satisfiedClients={activeData.satisfiedClients || "20+"}
          />

          {/* Reusable, high-performance marquee for client brand logos */}
          {activeItems && activeItems.length > 0 && (
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 h-full z-10 w-20 bg-linear-to-r from-background to-transparent" />
              <InfiniteMarquee
                items={activeItems}
                speed={100}
                gap="gap-6 sm:gap-8"
                pauseOnHover={false}
              />
              <div className="absolute pointer-events-none z-10 h-full w-20 top-0 right-0 bg-linear-to-l from-background to-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

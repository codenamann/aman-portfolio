"use client";
import { cn } from "@/lib/utils";
import { socialProofData } from "@/data/socialProof";
import SocialProofSummary from "./SocialProofSummary";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";

// ── Main SocialProof / Client Bar ────────────────────────────────────────────

export default function SocialProof({
  items = socialProofData.tools,
  className = "",
}) {
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
          {/* Review badge */}
          <SocialProofSummary
            avatars={socialProofData.avatars}
            rating={socialProofData.rating}
            satisfiedClients={socialProofData.satisfiedClients}
          />

          {/* Reusable, high-performance marquee */}
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full z-10 w-20 bg-linear-to-r from-background to-transparent " />
            <InfiniteMarquee
              items={items}
              speed={100}
              gap="gap-6 sm:gap-8"
              pauseOnHover={false}
            />
            <div className="absolute pointer-events-none z-10 h-full w-20 top-0 right-0 bg-linear-to-l from-background to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

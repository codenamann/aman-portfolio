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
          <div className="min-w-0 flex-1 overflow-hidden">
            <InfiniteMarquee
              items={items}
              speed={140}
              gap="gap-6 sm:gap-8"
              pauseOnHover={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

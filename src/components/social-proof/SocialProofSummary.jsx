import React from "react";
import Image from "next/image";
import { formatClientCount } from "@/lib/formatClientCount";

/**
 * Reusable AvatarStack component
 */
export function AvatarStack({ avatars = [], className = "" }) {
  if (!avatars || avatars.length === 0) return null;

  return (
    <div className={`flex items-center -space-x-2 sm:-space-x-2.5 ${className}`}>
      {avatars.map((avatar, index) => (
        <div
          key={index}
          className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-background shadow-md shrink-0"
        >
          <Image
            src={avatar.src || avatar}
            alt={avatar.alt || `Client ${index + 1}`}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Reusable 5-star Rating summary
 */
export function RatingSummary({ rating = 5, className = "" }) {
  return (
    <div className={`flex items-center gap-1 text-accent ${className}`}>
      {[...Array(rating)].map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Combined Social Proof Header summary:
 * [Avatar Stack]  [★★★★★] [99+ Happy clients]
 */
export default function SocialProofSummary({
  avatars = [],
  rating = 5,
  satisfiedClients = 147,
  className = "",
}) {
  const formattedCount = formatClientCount(satisfiedClients);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <AvatarStack avatars={avatars} />

      <div className="flex flex-col justify-center gap-0.5">
        <RatingSummary rating={rating} />
        <span className="text-xs sm:text-[13px] font-medium text-foreground/80 tracking-tight whitespace-nowrap">
          {formattedCount}
        </span>
      </div>
    </div>
  );
}

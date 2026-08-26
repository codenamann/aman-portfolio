import React from "react";
import Image from "next/image";
import {
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandBehance,
  TbBrandDribbble,
  TbBrandX,
} from "react-icons/tb";

function SocialIcon({ name }) {
  const iconProps = { className: "w-4 h-4" };

  switch (name?.toLowerCase()) {
    case "instagram":
      return <TbBrandInstagram {...iconProps} />;
    case "linkedin":
      return <TbBrandLinkedin {...iconProps} />;
    case "behance":
      return <TbBrandBehance {...iconProps} />;
    case "dribbble":
      return <TbBrandDribbble {...iconProps} />;
    case "x":
    case "twitter":
      return <TbBrandX {...iconProps} />;
    default:
      return null;
  }
}

/**
 * Sticky Profile Panel for About Section
 */
export default function ProfilePanel({ profile, className = "" }) {
  if (!profile) return null;

  return (
    <div
      className={`w-full md:w-[42%] lg:max-w-sm sticky md:top-28 flex flex-col self-start ${className}`}
    >
      {/* ── Portrait Container ──────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden aspect-12/13 w-full bg-card border border-border/80 shadow-2xl">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover object-top"
          priority
        />

        {/* ── Social Links Pill Overlay (Bottom Right) ──────────────────── */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-10">
            {profile.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Name & Role Metadata ────────────────────────────────────────── */}
      <h3 className="font-sans font-bold text-2xl sm:text-2xl text-foreground mt-5 leading-tight">
        {profile.name}
      </h3>

      <p className="text-sm sm:text-[1.3rem] text-foreground/70 leading-relaxed mt-1.5">
        {profile.role}
      </p>
    </div>
  );
}

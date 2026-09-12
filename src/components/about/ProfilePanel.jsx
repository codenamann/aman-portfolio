import React from "react";
import Image from "next/image";
import {
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandBehance,
  TbBrandDribbble,
  TbBrandX,
  TbBrandYoutube,
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
    case "youtube":
      return <TbBrandYoutube {...iconProps} />;
    case "x":
    case "twitter":
      return <TbBrandX {...iconProps} />;
    default:
      return <TbBrandLinkedin {...iconProps} />;
  }
}

/**
 * Sticky Profile Panel for About Section
 */
export default function ProfilePanel({ profile, className = "" }) {
  if (!profile) return null;

  const imageSrc = profile.avatar || profile.image;
  const name = profile.name || "";
  const role = profile.role || "";
  const socialLinks = profile.socialLinks || profile.social || [];

  if (!imageSrc && !name && !role) return null;

  return (
    <div
      className={`w-full md:w-[42%] lg:max-w-sm sticky md:top-28 flex flex-col self-start ${className}`}
    >
      {/* ── Portrait Container ──────────────────────────────────────────── */}
      {imageSrc && (
        <div className="relative rounded-3xl overflow-hidden aspect-12/13 w-full bg-card border border-border/80 shadow-2xl">
          <Image
            src={imageSrc}
            alt={name || "Profile"}
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover object-top"
            priority
          />

          {/* ── Social Links Pill Overlay (Bottom Right) ──────────────────── */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-10">
              {socialLinks.map((link) => {
                const targetUrl = link.url || link.href;
                if (!targetUrl) return null;
                const platformName = link.platform || link.icon || link.label || "";
                return (
                  <a
                    key={platformName || targetUrl}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platformName || "Social link"}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <SocialIcon name={platformName} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Name & Role Metadata ────────────────────────────────────────── */}
      {name && (
        <h3 className="font-sans font-bold text-2xl sm:text-2xl text-foreground mt-5 leading-tight">
          {name}
        </h3>
      )}

      {role && (
        <p className="text-sm sm:text-[1.3rem] text-foreground/70 leading-relaxed mt-1.5">
          {role}
        </p>
      )}
    </div>
  );
}

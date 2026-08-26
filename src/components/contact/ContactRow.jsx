import React from "react";
import { FaInstagram, FaLinkedinIn, FaBehance } from "react-icons/fa6";
import { cn } from "@/lib/utils";

function SocialIcon({ name }) {
  const iconClass = "w-3.5 h-3.5 sm:w-4 sm:h-4 text-white";

  switch (name?.toLowerCase()) {
    case "instagram":
      return <FaInstagram className={iconClass} />;
    case "linkedin":
      return <FaLinkedinIn className={iconClass} />;
    case "behance":
      return <FaBehance className={iconClass} />;
    default:
      return null;
  }
}

/**
 * Contact Information Row: Email, Call Me, and Social Links
 */
export default function ContactRow({ contact, className = "" }) {
  if (!contact) return null;

  return (
    <div
      className={cn(
        `flex flex-col md:flex-row justify-between gap-8 md:gap-10 xl:gap-8 pt-2 select-none ${className}`,
      )}
    >
      {/* ── Email Column ───────────────────────────────────────────────── */}
      {contact.email && (
        <div className="flex md:flex-1 flex-col">
          <span className="text-xs md:text-sm text-muted font-normal uppercase tracking-wider mb-2">
            {contact.email.label || "Email"}
          </span>
          <a
            href={contact.email.href}
            className="font-medium md:whitespace-nowrap text-base xl:text-[20px] text-foreground hover:text-accent transition-colors break-all"
          >
            {contact.email.value}
          </a>
        </div>
      )}

      {/* ── Call Me Column ─────────────────────────────────────────────── */}
      {contact.call && (
        <div className="flex md:flex-1 md:items-center flex-col">
          <div className="flex flex-col">
            <span className="text-xs md:text-sm text-muted font-normal uppercase tracking-wider mb-2">
              {contact.call.label || "Call Me"}
            </span>
            <a
              href={contact.call.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-base xl:text-[20px] text-foreground hover:text-accent transition-colors"
            >
              {contact.call.value}
            </a>
          </div>
        </div>
      )}

      {/* ── Social Column ──────────────────────────────────────────────── */}
      {contact.social && contact.social.length > 0 && (
        <div className="flex md:flex-1 md:items-center flex-col">
          <div>
            <span className="text-xs md:text-sm text-muted font-normal uppercase tracking-wider mb-2">
              Social
            </span>
            <div className="flex items-center gap-1.5 md:gap-2.5 pt-0.5">
              {contact.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-7 h-7 md:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                >
                  <SocialIcon name={s.icon || s.label} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

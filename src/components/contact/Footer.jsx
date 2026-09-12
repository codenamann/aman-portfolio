"use client";

import React from "react";
import RotatingWord from "@/components/animations/RotatingWord";
import ContactRow from "./ContactRow";
import FooterNavigation from "./FooterNavigation";
import FooterSignature from "./FooterSignature";

const FOOTER_STATIC_CONFIG = {
  headline: {
    before: "Let's ",
    after: "incredible work together.",
  },
  menu: [{ label: "Projects", href: "/projects" }],
  copyright: "© 2026 Aman Shrivastava. All rights reserved.",
  closingText: "MR. AMAN",
};

/**
 * Contact & Footer Section
 *
 * Architecture Rule:
 * - Headline, rotating word, menu links, copyright, and closing brand typography ("MR. AMAN") are 100% static in code.
 * - Strictly email, book a call link, and socials come dynamically from database (profile doc).
 */
export default function Footer({ profile, className = "" }) {
  // Resolve contact channels strictly from canonical profile DB document
  const emailValue =
    typeof profile?.email === "string"
      ? profile.email
      : profile?.email?.value || "";

  const bookingUrl =
    profile?.bookingUrl || profile?.call?.href || "";

  const rawSocial =
    Array.isArray(profile?.socialLinks) && profile.socialLinks.length > 0
      ? profile.socialLinks
      : Array.isArray(profile?.social) && profile.social.length > 0
      ? profile.social
      : [];

  const socialItems = rawSocial
    .map((s) => ({
      platform: s.platform || s.icon || s.label?.toLowerCase() || "",
      label: s.label || s.platform || "Social",
      href: s.url || s.href || "",
    }))
    .filter((s) => Boolean(s.href));

  const contact = {
    email: emailValue
      ? {
          label: "Email",
          value: emailValue,
          href: `mailto:${emailValue}`,
        }
      : null,
    call: bookingUrl
      ? {
          label: "Call Me",
          value: "Schedule Now",
          href: bookingUrl,
        }
      : null,
    social: socialItems,
  };

  const hasContactInfo = Boolean(
    contact.email ||
    contact.call ||
    (contact.social && contact.social.length > 0),
  );

  return (
    <footer
      id="contact"
      className={`w-full bg-background border-t border-border flex justify-center section-py section-px`}
    >
      <div className={`section-container flex flex-col ${className}`}>
        {/* ── Main Headline with Vertical Rotating Word (Static in code) ── */}
        <h2 className="flex flex-col gap-2 font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.08]">
          <div className="flex gap-5">
            <span>{FOOTER_STATIC_CONFIG.headline.before}</span>
            <RotatingWord interval={1500} />
          </div>
          <span>{FOOTER_STATIC_CONFIG.headline.after}</span>
        </h2>

        {/* ── Contact Information Row (Dynamic from DB: Email, Call Me, Social) ── */}
        {hasContactInfo && (
          <ContactRow contact={contact} className="mt-12 pt-0" />
        )}

        {/* ── Horizontal Divider (Static) ─────────────────────────────────── */}
        <hr className="border-muted my-8" />

        {/* ── Lower Footer Row: Menu + Copyright (Static in code) ────────── */}
        <FooterNavigation
          menu={FOOTER_STATIC_CONFIG.menu}
          copyright={FOOTER_STATIC_CONFIG.copyright}
        />

        {/* ── Large Closing Brand Typography: MR. AMAN (Static in code) ──── */}
        <FooterSignature
          text={FOOTER_STATIC_CONFIG.closingText}
          className="mt-12"
        />
      </div>
    </footer>
  );
}

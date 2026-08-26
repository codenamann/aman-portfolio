"use client";

import React from "react";
import RotatingWord from "@/components/animations/RotatingWord";
import ContactRow from "./ContactRow";
import FooterNavigation from "./FooterNavigation";
import FooterSignature from "./FooterSignature";
import { footerData } from "@/data/footer";

/**
 * Contact & Footer Section
 *
 * Features:
 * - Headline with vertical rolling word transition (create / design / build)
 * - 3-column contact info row (Email, Call Me, Social icons)
 * - Horizontal divider
 * - Menu links, copyright text, and decorative accent dot
 * - Large closing brand typography (MR. AMAN)
 */
export default function Footer({ data = footerData, className = "" }) {
  return (
    <footer
      id="contact"
      className={`w-full bg-background border-t border-border flex justify-center px-8 py-12 md:py-15`}
    >
      <div className={`max-w-5xl xl:px-6 flex flex-col ${className}`}>
        {/* ── Main Headline with Vertical Rotating Word ──────────────────── */}
        <h2 className="flex flex-col gap-2 font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.08]">
          <div className="flex gap-5">
            <span>{data.headline.before}</span>
            <RotatingWord interval={1500} />
          </div>
          <span>{data.headline.after}</span>
        </h2>

        {/* ── Contact Information Row (Email, Call Me, Social) ────────────── */}
        <ContactRow contact={data.contact} className="mt-12 pt-0" />

        {/* ── Horizontal Divider ─────────────────────────────────────────── */}
        <hr className="border-muted my-8" />

        {/* ── Lower Footer Row (Menu + Copyright) ────────────────────────── */}
        <FooterNavigation menu={data.menu} copyright={data.copyright} />

        {/* ── Large Closing Brand Typography (MR. AMAN) ──────────────────── */}
        <FooterSignature text={data.closingText} className="mt-12" />
      </div>
    </footer>
  );
}

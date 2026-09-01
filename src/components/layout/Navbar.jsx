"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { person } from "@/data/person";
import { siteConfig } from "@/data/site";
import { Menu, X, Calendar, Mail, ArrowRight, ChevronDown } from "lucide-react";
import { InstagramIcon } from "hugeicons-react";
import { FaYoutube } from "react-icons/fa6";
import ContactDropdown from "./ContactDropdown";

export default function Navbar({
  brand = person,
  links = siteConfig.navLinks,
}) {
  const [open, setOpen] = useState(false);
  const [showMobileContact, setShowMobileContact] = useState(false);
  const pathname = usePathname();

  const contactOptions = [
    {
      id: "call",
      label: "Book a call",
      href: person.call?.href || "https://cal.com",
      icon: Calendar,
      isExternal: true,
    },
    {
      id: "instagram",
      label: "Message on Instagram",
      href:
        person.instagram?.dmHref ||
        person.instagram?.href ||
        "https://www.instagram.com/amann.createss?igsi=eWpkbGR6YjlzYzg=",
      icon: InstagramIcon,
      isExternal: true,
    },
    {
      id: "email",
      label: "Email",
      href: person.email?.href || "mailto:shrivastavaaman176@gmail.com",
      icon: Mail,
      isExternal: false,
    },
  ];

  const handleCloseMobile = () => {
    setOpen(false);
    setShowMobileContact(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none select-none">
      <nav
        className="pointer-events-auto relative mx-4 sm:mx-6 mt-5 sm:mt-6 w-full max-w-xl
                   flex items-center flex-col md:flex-row justify-between
                   px-3.5 py-2.5 sm:px-4 sm:py-3"
      >
        {/* ── Separate Pill Frosted Background Layer with Smooth Color Transition ── */}
        <div
          className={`absolute inset-0 rounded-4xl md:rounded-full border border-muted/20 backdrop-blur-[10px] pointer-events-none -z-10 transition-colors duration-300 ease-in-out ${
            showMobileContact ? "bg-background/50" : "bg-muted/10"
          }`}
        />

        {/* Top row: Logo/Brand + Mobile Hamburger */}
        <div className="flex w-full md:w-auto items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={handleCloseMobile}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/15 transition-transform group-hover:scale-105">
              <Image
                src={brand.avatar}
                alt={brand.displayName || brand.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="font-sans font-bold text-sm sm:text-base text-foreground tracking-tight">
              {brand.displayName || brand.name}
            </span>
          </Link>

          {/* Mobile Right Controls: Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="p-1.5 rounded-full text-foreground/80 hover:text-foreground cursor-pointer focus:outline-none"
              onClick={() => {
                if (open) {
                  handleCloseMobile();
                } else {
                  setOpen(true);
                  setShowMobileContact(false);
                }
              }}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
          {/* Nav Links (Styled as sleek frosted capsule matching icon badges) */}
          <div className="flex items-center gap-2">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  href={l.href}
                  key={l.key || l.label}
                  className={`h-8 px-3.5 rounded-full border flex items-center justify-center text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-sm ${
                    isActive
                      ? "border-accent/40 bg-accent/15 text-accent"
                      : "border-white/15 bg-white/4 hover:bg-white/8 hover:border-accent/30 text-foreground/80 hover:text-accent"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Social Profile Buttons */}
          <div className="flex items-center gap-2">
            {/* Instagram Button */}
            {brand.instagram?.href && (
              <a
                href={brand.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aman on Instagram"
                className="w-8 h-8 rounded-full border border-white/15 bg-white/4 hover:bg-white/8 hover:border-accent/30 flex items-center justify-center text-foreground/80 hover:text-accent transition-colors duration-200 cursor-pointer shadow-sm"
              >
                <InstagramIcon size={14} className="shrink-0" />
              </a>
            )}

            {/* YouTube Button */}
            {brand.youtube?.href && (
              <a
                href={brand.youtube.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aman on YouTube"
                className="w-8 h-8 rounded-full border border-white/15 bg-white/4 hover:bg-white/8 hover:border-accent/30 flex items-center justify-center text-foreground/80 hover:text-accent transition-colors duration-200 cursor-pointer shadow-sm"
              >
                <FaYoutube size={14} className="shrink-0" />
              </a>
            )}
          </div>

          {/* Contact / Book Dropdown Accordion Component (Desktop) */}
          <ContactDropdown buttonLabel="BOOK" />
        </div>

        {/* Expandable Mobile Navigation Menu (Inside Navbar) */}
        <div
          className={`
            grid w-full md:hidden overflow-hidden
            transition-[grid-template-rows,opacity,margin,padding]
            duration-300 ease-in-out
            ${
              open
                ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-white/10"
                : "grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0 pointer-events-none"
            }
          `}
        >
          <div className="min-h-0 overflow-hidden flex flex-col gap-3">
            {/* ── Upper Section: Smooth Dual Grid Row Transition ── */}
            <div className="flex flex-col">
              {/* 1. Nav Links View */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  !showMobileContact
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="min-h-0 overflow-hidden flex flex-col gap-2.5 py-0.5">
                  {links.map((l) => {
                    const isActive = pathname === l.href;
                    return (
                      <Link
                        href={l.href}
                        key={l.key || l.label}
                        className={`text-sm font-medium py-1 transition-colors duration-200 ${
                          isActive
                            ? "text-accent font-semibold"
                            : "text-foreground/80 hover:text-foreground"
                        }`}
                        onClick={handleCloseMobile}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 2. Contact Options View (Slides up and grows height smoothly) */}
              <div
                className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-in-out ${
                  showMobileContact
                    ? "grid-rows-[1fr] opacity-100 translate-y-0"
                    : "grid-rows-[0fr] opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="min-h-0 overflow-hidden flex flex-col gap-1.5 py-0.5">
                  {contactOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <a
                        key={option.id}
                        href={option.href}
                        target={option.isExternal ? "_blank" : undefined}
                        rel={
                          option.isExternal ? "noopener noreferrer" : undefined
                        }
                        onClick={handleCloseMobile}
                        className="group flex items-center justify-between gap-3 rounded-xl p-2.5 transition-colors duration-150 hover:bg-white/[0.06] text-foreground bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground/80 group-hover:border-accent/60 group-hover:text-accent">
                            <IconComponent size={14} className="shrink-0" />
                          </div>
                          <span className="truncate text-sm font-medium text-foreground/90 group-hover:text-foreground">
                            {option.label}
                          </span>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-muted/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground shrink-0"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Fixed Bottom Row: Social Icons on Left & BOOK Button on Right ── */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              {/* Social Icons on Mobile */}
              <div className="flex items-center gap-2.5">
                {brand.instagram?.href && (
                  <a
                    href={brand.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <InstagramIcon size={15} className="shrink-0" />
                  </a>
                )}
                {brand.youtube?.href && (
                  <a
                    href={brand.youtube.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <FaYoutube size={15} className="shrink-0" />
                  </a>
                )}
              </div>

              {/* BOOK Accordion Toggle Button */}
              <button
                type="button"
                onClick={() => setShowMobileContact((prev) => !prev)}
                className="group relative cursor-pointer select-none rounded-full bg-accent px-4 py-2 text-xs font-bold tracking-wider text-white shadow-md shadow-accent/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>BOOK</span>
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-300 ease-out ${
                    showMobileContact ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

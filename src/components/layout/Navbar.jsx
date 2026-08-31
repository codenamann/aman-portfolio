"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { person } from "@/data/person";
import { siteConfig } from "@/data/site";
import { Menu, X } from "lucide-react";

export default function Navbar({
  brand = person,
  links = siteConfig.navLinks,
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none select-none">
      <nav
        className="pointer-events-auto mx-6 sm:mx-4 mt-6 w-full max-w-xl
                   flex items-center flex-col md:flex-row justify-between
                   rounded-4xl md:rounded-full px-3 py-3
                   border border-muted/20 bg-muted/10 backdrop-blur-[10px]"
      >
        {/* Top row: logo + hamburger */}
        <div className="flex w-full md:w-fit justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-7.5 h-7.5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10">
              <Image
                src={brand.avatar}
                alt={brand.displayName || brand.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="font-sans font-bold text-md text-foreground">
              {brand.displayName || brand.name}
            </span>
          </a>

          <button
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Expandable Navigation Menu */}
        <div
          className={`
            grid overflow-hidden
            transition-[grid-template-rows]
            duration-300 ease-out
            md:grid-rows-[1fr]
            ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
          `}
        >
          <div className="min-h-0 overflow-hidden md:overflow-visible">
            <div className="mt-8 md:mt-0 mb-8 md:mb-0 md:gap-5 flex flex-col md:flex-row items-center">
              <div className="flex flex-col md:flex-row items-center gap-2.5 md:gap-4">
                {links.map((l) => (
                  <Link
                    href={l.href}
                    key={l.key || l.label}
                    className="text-[1.4rem] md:text-[1rem]"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <Link
                href="#contact"
                variant="pill"
                color="red"
                className="mt-8 md:mt-0"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

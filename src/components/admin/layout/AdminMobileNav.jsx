"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { person } from "@/data/person";
import Image from "next/image";

/**
 * Mobile Top Bar Navigation Header with solid tokens
 */
export default function AdminMobileNav({ isOpen, onToggle }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#151517] border-b border-[#262628] text-[#f2f2f2] z-40 sticky top-0 w-full min-h-[52px]">
      <Link
        href="/admin"
        className="flex items-center gap-2.5 group min-h-[44px]"
        aria-label="Aman Studio Admin Dashboard"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/15 transition-transform group-hover:scale-105">
          <Image
            src={person.avatar}
            alt={person.displayName || person.name}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-wider text-sm text-[#f2f2f2] group-hover:text-[#e90c47] transition-colors">
            Aman S.
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="admin-drawer"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-[#1f1f22] text-[#a1a1a6] hover:text-[#f2f2f2] transition flex items-center justify-center cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}

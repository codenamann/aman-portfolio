"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ExternalLink, LogOut, X } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "./AdminNavConfig";
import AdminMobileNav from "./AdminMobileNav";
import { person } from "@/data/person";
import Image from "next/image";

/**
 * Responsive Admin Sidebar and Mobile Drawer Navigation
 * Uses solid surface tokens and level 2/3 elevation depth.
 */
export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape key press & prevent background scroll when drawer is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <AdminMobileNav
        isOpen={mobileOpen}
        onToggle={() => setMobileOpen(!mobileOpen)}
      />

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="admin-drawer"
        aria-label="Admin Sidebar Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-64 max-w-[85vw] bg-[#151517] border-r border-[#262628] flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 select-none ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 sm:px-6 flex items-center justify-between border-b border-[#262628] bg-[#18181a]">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 group min-h-[44px]"
            onClick={() => setMobileOpen(false)}
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

          {/* Close button inside drawer on mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close drawer"
            className="lg:hidden min-w-[36px] min-h-[36px] rounded-lg text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#1f1f22] flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 sm:py-6 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium transition ${
                  active
                    ? "bg-[#1f1f22] text-[#f2f2f2] border border-[#333338] font-semibold"
                    : "text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a]"
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    active ? "text-[#e90c47]" : "text-[#6f6f76]"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions & Profile */}
        <div className="p-3 border-t border-[#262628] space-y-2 bg-[#18181a]">
          {/* Live Site Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-medium text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#1f1f22] transition"
          >
            <span className="flex items-center gap-2 truncate">
              <ExternalLink size={15} className="shrink-0 text-[#6f6f76]" />
              <span className="truncate">View Public Site</span>
            </span>
            <span className="text-[10px] text-[#6f6f76] font-mono shrink-0 ml-1">
              Live ↗
            </span>
          </Link>

          {/* User Badge & Logout */}
          <div className="pt-2 border-t border-[#262628] flex items-center justify-between px-2 min-h-[44px]">
            <div className="flex flex-col truncate max-w-[170px] sm:max-w-[140px] pr-2">
              <span className="text-xs font-medium text-[#f2f2f2] truncate">
                {user?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-[#6f6f76] truncate">
                {user?.email || "admin"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="min-w-[40px] min-h-[40px] rounded-lg text-[#a1a1a6] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10 transition flex items-center justify-center cursor-pointer shrink-0"
              title="Sign Out"
              aria-label="Sign out of admin"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

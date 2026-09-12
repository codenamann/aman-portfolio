import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Standardized Admin Page Header Component
 * Supports breadcrumbs, page title, subtitle, and primary actions.
 */
export default function AdminHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#262628] w-full min-w-0">
      <div className="min-w-0 flex-1">
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-[#6f6f76] mb-1.5 font-mono"
          >
            <Link
              href="/admin"
              className="hover:text-[#f2f2f2] transition py-0.5"
            >
              Admin
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span
                key={crumb.label || idx}
                className="flex items-center gap-1.5 truncate max-w-full"
              >
                <ChevronRight size={12} className="text-[#6f6f76] shrink-0" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#f2f2f2] transition truncate py-0.5"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#f2f2f2] font-medium truncate">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f2f2f2] break-words font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#a1a1a6] mt-1 break-words leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </header>
  );
}

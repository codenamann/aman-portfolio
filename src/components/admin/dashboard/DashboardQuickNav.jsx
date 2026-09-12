import Link from "next/link";
import { Sparkles, Layers, FileText } from "lucide-react";

/**
 * Dashboard Quick Navigation Feature Cards
 */
export default function DashboardQuickNav() {
  const links = [
    {
      href: "/admin/featured",
      title: "Homepage Featured (4+4)",
      description:
        "Curate the 4 shorts and 4 long-form videos featured on the homepage hero/feed.",
      icon: Sparkles,
      iconClass: "bg-[#e90c47]/10 text-[#e90c47]",
    },
    {
      href: "/admin/showcase",
      title: "Archive Showcase (5 Slots)",
      description:
        "Manage the 5-slot editorial hero banner featured at the top of the Projects Archive.",
      icon: Sparkles,
      iconClass: "bg-blue-500/10 text-blue-400",
    },
    {
      href: "/admin/projects",
      title: "Projects Archive",
      description:
        "View, edit, filter, or create video projects across your portfolio repository.",
      icon: Layers,
      iconClass: "bg-[#18181a] text-[#a1a1a6]",
    },
    {
      href: "/admin/content",
      title: "Bio & Content",
      description:
        "Update your biography, testimonials, FAQs, services, and profile copy singletons.",
      icon: FileText,
      iconClass: "bg-[#18181a] text-[#a1a1a6]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] hover:border-[#333338] hover:bg-[#18181a] shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition group flex items-start gap-3.5"
          >
            <span
              className={`p-2.5 rounded-lg transition shrink-0 ${item.iconClass}`}
            >
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-[#f2f2f2] group-hover:text-white transition">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#a1a1a6] mt-1 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

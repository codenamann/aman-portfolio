import {
  LayoutDashboard,
  Film,
  Sparkles,
  Layers,
  FileText,
  Settings,
} from "lucide-react";

/**
 * Central Navigation Definitions for Admin Panel
 */
export const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: Film,
  },
  {
    href: "/admin/featured",
    label: "Homepage Featured",
    icon: Sparkles,
  },
  {
    href: "/admin/showcase",
    label: "Archive Showcase",
    icon: Layers,
  },
  {
    href: "/admin/content",
    label: "Content & Bio",
    icon: FileText,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

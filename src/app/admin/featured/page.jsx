import { redirect } from "next/navigation";

export default function FeaturedSlotsRedirect() {
  redirect("/admin/projects?tab=landing");
}

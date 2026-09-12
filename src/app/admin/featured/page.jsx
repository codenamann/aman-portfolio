import { getProjects } from "@/services/projects/getProjects";
import AdminHeader from "@/components/admin/AdminHeader";
import FeaturedSlotManager from "@/components/admin/FeaturedSlotManager";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
} from "@/lib/constants/limits";

export default async function FeaturedSlotsPage() {
  await requireAdminPageAuth();

  const allProjects = await getProjects();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Featured Homepage Slots (Strict 4+4)"
        subtitle={`Control the exact 4 Shorts and 4 Long-form projects that appear in your homepage showcases.`}
        breadcrumbs={[{ label: "Featured Slots" }]}
      />

      <FeaturedSlotManager initialProjects={allProjects} />
    </div>
  );
}

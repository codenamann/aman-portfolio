import { getAllContent } from "@/services/content/getContent";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import ContentSectionTabs from "@/components/admin/content/ContentSectionTabs";
import ContentManager from "@/components/admin/content/ContentManager";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";
import { CONTENT_SECTIONS } from "@/lib/constants/limits";

export const metadata = {
  title: "Content & Bio | Admin Console",
};

export default async function ContentManagementPage(props) {
  await requireAdminPageAuth();

  const searchParams = await props.searchParams;
  const activeSection = searchParams?.section || CONTENT_SECTIONS.PROFILE;

  const allContent = await getAllContent({ forceNoFallback: true });
  const currentData = allContent[activeSection] || null;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Content & Bio Management"
        subtitle="Update copy, testimonials, FAQs, and contact links across your portfolio."
        breadcrumbs={[{ label: "Content" }]}
      />

      {/* Section Navigation Tabs */}
      <ContentSectionTabs activeSection={activeSection} />

      {/* Content Section Editor */}
      <ContentManager
        key={activeSection}
        section={activeSection}
        initialData={currentData}
      />
    </div>
  );
}

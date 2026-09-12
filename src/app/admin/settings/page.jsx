import AdminHeader from "@/components/admin/layout/AdminHeader";
import EnvironmentChecklist from "@/components/admin/settings/EnvironmentChecklist";
import SecurityGuarantees from "@/components/admin/settings/SecurityGuarantees";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { getAdminEmails } from "@/lib/auth/guard";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";

export const metadata = {
  title: "Settings | Admin Console",
};

export default async function AdminSettingsPage() {
  await requireAdminPageAuth();

  const adminConfigured = isFirebaseAdminConfigured();
  const clientConfigured = isFirebaseClientConfigured();
  const youtubeConfigured = Boolean(process.env.YOUTUBE_API_KEY);
  const adminEmails = getAdminEmails();

  const envChecklist = [
    {
      name: "Firebase Admin SDK",
      status: adminConfigured,
      description:
        "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY for live Firestore writes",
      category: "Database & Backend",
    },
    {
      name: "Firebase Client Auth SDK",
      status: clientConfigured,
      description:
        "NEXT_PUBLIC_FIREBASE_API_KEY and project credentials for browser sign-in",
      category: "Authentication",
    },
    {
      name: "YouTube Data API v3",
      status: youtubeConfigured,
      description:
        "YOUTUBE_API_KEY for rich metadata fetching (oEmbed fallback used if missing)",
      category: "Ingestion Engine",
    },
    {
      name: "Admin Whitelist",
      status: adminEmails.length > 0,
      description: `ADMIN_EMAILS: ${
        adminEmails.length > 0
          ? adminEmails.join(", ")
          : "None configured (dev mode open)"
      }`,
      category: "Authorization Guard",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl min-w-0">
      <AdminHeader
        title="Settings & System Configuration"
        subtitle="Manage credentials verification, environment variables, and security rules."
        breadcrumbs={[{ label: "Settings" }]}
      />

      {/* Environment Health Check Card */}
      <EnvironmentChecklist envChecklist={envChecklist} />

      {/* Security Architecture Summary */}
      <SecurityGuarantees />
    </div>
  );
}

import { getSessionUser } from "@/lib/auth/session";
import { isAuthorizedAdmin } from "@/lib/auth/guard";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminToastProvider from "@/components/admin/ui/AdminToastProvider";
import AdminPageTransition from "@/components/admin/layout/AdminPageTransition";

export const metadata = {
  title: "Admin Console | Aman Shrivastava",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const sessionUser = await getSessionUser();
  const isAdmin = sessionUser ? isAuthorizedAdmin(sessionUser.email) : false;

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-[#111113] text-[#f2f2f2] flex flex-col antialiased">
        {isAdmin && (
          <AdminSidebar
            user={{
              email: sessionUser?.email,
              name: sessionUser?.name || sessionUser?.email?.split("@")[0],
            }}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 flex flex-col transition-all duration-200 ${
            isAdmin ? "lg:pl-64" : ""
          }`}
        >
          <div className="flex-1 w-full max-w-7xl mx-auto px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 min-w-0">
            <AdminPageTransition>
              {children}
            </AdminPageTransition>
          </div>
        </main>
      </div>
    </AdminToastProvider>
  );
}

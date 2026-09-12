import LoginForm from "@/components/admin/auth/LoginForm";

export const metadata = {
  title: "Admin Sign In | Aman Shrivastava",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-4 w-full">
      <LoginForm />
    </div>
  );
}

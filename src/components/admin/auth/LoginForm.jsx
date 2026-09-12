"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { Lock, Mail, KeyRound, Loader2 } from "lucide-react";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";

/**
 * Admin Authentication Form Component
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clientConfigured = isFirebaseClientConfigured();

  const handleSessionExchange = async (idToken) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(
        data.error || "Access denied. Not an authorized administrator."
      );
    }

    router.push("/admin");
    router.refresh();
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError(
        "Firebase Client Auth is not initialized. Please check client credentials in .env.local."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const idToken = await userCredential.user.getIdToken();
      await handleSessionExchange(idToken);
    } catch (err) {
      console.error("Login failed:", err);
      let msg = err.message;
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/user-not-found") {
        msg = "No administrator user found with this email address.";
      } else if (err.code === "auth/too-many-requests") {
        msg =
          "Access temporarily disabled due to many failed login attempts. Try again later or reset password.";
      } else if (
        typeof msg === "string" &&
        (msg.includes("invalid_grant") || msg.includes("account not found"))
      ) {
        msg =
          "Firebase Admin service account error (Invalid grant: account not found). The service account email or private key in your environment variables does not exist or has been revoked in Google Cloud / Firebase Console. Please verify FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in Vercel.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-5 sm:space-y-6">
      {/* Header Badge & Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#151517] border border-[#262628] text-[#e90c47] mb-1 shadow-sm">
          <Lock size={22} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f2f2f2] break-words">
          Admin CMS Authentication
        </h1>
        <p className="text-xs text-[#a1a1a6]">
          Secure admin portal for Aman Shrivastava portfolio management
        </p>
      </div>

      {/* Unconfigured Warning */}
      {!clientConfigured && (
        <AdminAlert
          type="warning"
          message="Firebase Client Keys are not set in .env.local. Configure your project credentials to enable authentication."
        />
      )}

      {/* Error Alert */}
      {error && (
        <AdminAlert
          type="error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Login Form Card */}
      <div className="p-5 sm:p-8 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-5">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <AdminFormField label="Admin Email" required>
            <AdminInput
              type="email"
              required
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              autoComplete="email"
            />
          </AdminFormField>

          <AdminFormField label="Password" required>
            <AdminInput
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={KeyRound}
              autoComplete="current-password"
            />
          </AdminFormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] py-2.5 bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs sm:text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>Sign In to Admin Console</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

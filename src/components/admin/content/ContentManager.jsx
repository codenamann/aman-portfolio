"use client";

import { useState } from "react";
import { Save, Loader2, Database, AlertCircle } from "lucide-react";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";
import ProfileEditor from "./ProfileEditor";
import AboutEditor from "./AboutEditor";
import ServicesEditor from "./ServicesEditor";
import CreativeToolsEditor from "./CreativeToolsEditor";
import TestimonialsEditor from "./TestimonialsEditor";
import ViewerReactionsEditor from "./ViewerReactionsEditor";
import SocialProofEditor from "./SocialProofEditor";
import FaqsEditor from "./FaqsEditor";
import QuoteEditor from "./QuoteEditor";
import { CONTENT_SECTIONS } from "@/lib/constants/limits";

/**
 * Content Manager Orchestrator Component
 */
export default function ContentManager({ section, initialData }) {
  const toast = useAdminToast();
  const [data, setData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);

  const isConfigured = Boolean(initialData && Object.keys(initialData).length > 0 && initialData._source !== "fallback");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update content section");
      }

      toast.success(`Section '${section}' saved to Firestore successfully.`);
    } catch (err) {
      toast.error(err.message || "Failed to save content section");
    } finally {
      setLoading(false);
    }
  };

  const renderEditor = () => {
    switch (section) {
      case CONTENT_SECTIONS.PROFILE:
        return <ProfileEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.ABOUT:
        return <AboutEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.SERVICES:
        return <ServicesEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.CREATIVE_TOOLS:
        return <CreativeToolsEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.TESTIMONIALS:
        return <TestimonialsEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.VIEWER_REACTIONS:
        return <ViewerReactionsEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.SOCIAL_PROOF:
        return <SocialProofEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.FAQS:
        return <FaqsEditor data={data} onChange={setData} />;
      case CONTENT_SECTIONS.QUOTE:
        return <QuoteEditor data={data} onChange={setData} />;
      default:
        return <ProfileEditor data={data} onChange={setData} />;
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl min-w-0">
      {/* ── Status Banner: Configured vs Not Configured in DB ── */}
      {!isConfigured ? (
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#1c1c1f] border border-[#2a2a2e] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#e5e5e7]">
            <AlertCircle size={16} className="text-amber-400 shrink-0" />
            <span>
              <strong className="text-white font-medium">Not configured in Firestore:</strong> This document does not exist yet. Fill in the fields below and click save to write directly to your database.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-mono text-[10px] uppercase shrink-0 font-semibold">
            Unsaved
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[#131315] border border-[#222225] flex items-center justify-between text-xs text-[#8e8e93]">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-emerald-400 shrink-0" />
            <span>Document connected to Firestore: <code className="text-[#a1a1a6] font-mono">content/{section}</code></span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-mono text-[10px] uppercase font-semibold">
            Active in DB
          </span>
        </div>
      )}

      {/* Dynamic Bespoke Sub-Editor */}
      {renderEditor()}

      {/* Save Button Action */}
      <div className="flex items-center justify-end pt-3 border-t border-[#262628]">
        <button
          type="submit"
          disabled={loading}
          className="min-h-[44px] px-6 py-2 bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>Save {section} Content</span>
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

/**
 * Reusable Admin Image Upload Component
 * Uploads via server-side POST /api/admin/upload to Cloudinary.
 * Strict Zero-Default: Empty state when no value exists.
 */
export default function AdminImageUpload({
  value = "",
  onChange,
  section = "general",
  label = "Image",
  description = "",
  aspect = "square", // "portrait" | "square" | "wide" | "signature"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.secureUrl);
    } catch (err) {
      console.error("[Image Upload Error]", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAspectClass = () => {
    switch (aspect) {
      case "portrait":
        return "aspect-12/13 w-32 sm:w-40";
      case "signature":
        return "h-16 w-48";
      case "wide":
        return "aspect-16/9 w-48";
      case "square":
      default:
        return "w-24 h-24 sm:w-28 sm:h-28";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}

      {description && (
        <p className="text-xs text-white/50">{description}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {value ? (
          <div className="relative group">
            <div
              className={`relative overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-inner ${getAspectClass()}`}
            >
              {aspect === "signature" ? (
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Image
                  src={value}
                  alt={label}
                  fill
                  sizes="160px"
                  className="object-cover"
                  unoptimized={value.startsWith("http")}
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleClear}
              disabled={isUploading}
              aria-label="Remove image"
              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition shadow-lg z-10"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10 transition cursor-pointer p-4 text-center ${getAspectClass()}`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-white/40">
                <ImageIcon className="w-6 h-6" />
                <span className="text-[11px] font-medium">Upload</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={
              section === "social-proof" || section === "logos"
                ? "image/jpeg,image/png,image/webp,image/svg+xml"
                : "image/jpeg,image/png,image/webp"
            }
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={13} />
                <span>{value ? "Change Image" : "Select Image"}</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-white/40">
            {section === "social-proof" || section === "logos"
              ? "PNG, JPG, WebP, SVG (max 5MB)"
              : "PNG, JPG, WebP (max 5MB)"}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "general" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          uploading
            ? "border-[var(--primary)] bg-[var(--primary)]/5"
            : "border-[var(--border)] hover:border-[var(--primary)]"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <div className="animate-pulse">
                <Upload className="w-12 h-12 text-[var(--primary)]" />
                <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                  Uploading...
                </p>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-[var(--foreground-secondary)]" />
                <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                  Drop an image here or click to upload
                </p>
                <p className="text-xs text-[var(--foreground-secondary)]">
                  JPEG, PNG, WebP, GIF up to 5MB
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL manually"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
        />
      </div>
    </div>
  );
}

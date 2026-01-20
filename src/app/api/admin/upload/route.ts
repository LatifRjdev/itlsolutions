import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `${folder}/${filename}`;

    // Use Supabase Storage if configured, otherwise fall back to local storage
    if (supabase) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return NextResponse.json({ url: publicUrl, filename });
    } else {
      // Local storage fallback (for development)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      await mkdir(uploadDir, { recursive: true });

      const localPath = path.join(uploadDir, filename);
      await writeFile(localPath, buffer);

      const url = `/uploads/${folder}/${filename}`;
      return NextResponse.json({ url, filename });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

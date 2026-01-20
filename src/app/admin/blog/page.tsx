import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { BlogTable } from "./BlogTable";

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Blog</h1>
          <p className="text-[var(--foreground-secondary)] mt-1">
            Manage blog posts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Write Post
        </Link>
      </div>

      <BlogTable posts={posts} />
    </div>
  );
}

import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "./BlogPostForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (id === "new") {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Write Blog Post
        </h1>
        <BlogPostForm />
      </div>
    );
  }

  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
        Edit Blog Post
      </h1>
      <BlogPostForm post={post} />
    </div>
  );
}

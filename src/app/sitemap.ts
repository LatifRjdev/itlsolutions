import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itlsolutions.net";

  // Helper to generate alternates for hreflang
  const generateAlternates = (path: string) => {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      if (locale === defaultLocale) {
        languages[locale] = `${baseUrl}${path}`;
      } else {
        languages[locale] = `${baseUrl}/${locale}${path}`;
      }
    }
    return { languages };
  };

  // Static pages with alternates for both locales
  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/services", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/portfolio", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/contact", priority: 0.9 },
  ];

  const staticPages = staticRoutes.flatMap((route) => {
    // Generate entries for each locale
    return locales.map((locale) => ({
      url: locale === defaultLocale
        ? `${baseUrl}${route.path}`
        : `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route.priority,
      alternates: generateAlternates(route.path),
    }));
  });

  // Dynamic portfolio pages
  const projects = await prisma.project.findMany({
    select: { slug: true, updatedAt: true },
  });

  const portfolioPages = projects.flatMap((project) => {
    const path = `/portfolio/${project.slug}`;
    return locales.map((locale) => ({
      url: locale === defaultLocale
        ? `${baseUrl}${path}`
        : `${baseUrl}/${locale}${path}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: generateAlternates(path),
    }));
  });

  // Dynamic blog pages
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const blogPages = posts.flatMap((post) => {
    const path = `/blog/${post.slug}`;
    return locales.map((locale) => ({
      url: locale === defaultLocale
        ? `${baseUrl}${path}`
        : `${baseUrl}/${locale}${path}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: generateAlternates(path),
    }));
  });

  return [...staticPages, ...portfolioPages, ...blogPages];
}

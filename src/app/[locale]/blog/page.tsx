import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Breadcrumbs } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRussian = locale === "ru";

  return {
    title: isRussian
      ? "Блог - IT статьи и новости | ITL Solutions"
      : "Blog - IT Articles & News | ITL Solutions",
    description: isRussian
      ? "Блог ITL Solutions: статьи о веб-разработке, мобильных приложениях, облачных технологиях и цифровой трансформации в Таджикистане."
      : "ITL Solutions blog: articles about web development, mobile apps, cloud technologies and digital transformation in Tajikistan.",
    keywords: isRussian
      ? ["IT блог Таджикистан", "веб-разработка статьи", "технологии Душанбе", "IT новости"]
      : ["IT blog Tajikistan", "web development articles", "technology Dushanbe", "IT news"],
    openGraph: {
      title: isRussian ? "Блог | ITL Solutions" : "Blog | ITL Solutions",
      description: isRussian
        ? "Статьи о технологиях и IT-решениях"
        : "Articles about technology and IT solutions",
      locale: isRussian ? "ru_RU" : "en_US",
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const isRussian = locale === "ru";

  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-[var(--background)]">
        <Container size="lg">
          <Breadcrumbs
            locale={locale}
            items={[{ label: t("title"), href: "/blog" }]}
          />
        </Container>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                image={post.image}
                readTime={post.readTime}
                publishedAt={post.publishedAt?.toISOString() || new Date().toISOString()}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[var(--surface)]">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {isRussian ? "Подпишитесь на рассылку" : "Subscribe to Our Newsletter"}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
              {isRussian
                ? "Получайте новые статьи и полезные материалы прямо на вашу почту."
                : "Get the latest articles and insights delivered directly to your inbox."}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={isRussian ? "Введите ваш email" : "Enter your email"}
                className="flex-1 h-12 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg transition-colors"
              >
                {isRussian ? "Подписаться" : "Subscribe"}
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

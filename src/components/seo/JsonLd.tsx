"use client";

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    email: string;
  };
  sameAs?: string[];
}

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  email?: string;
  openingHours?: string[];
  priceRange?: string;
  areaServed?: string[];
  serviceType?: string[];
}

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: string;
  areaServed?: string[];
  serviceType?: string;
}

// Organization Schema
export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
  sameAs,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    ...(contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactPoint.telephone,
        email: contactPoint.email,
        contactType: "customer service",
        availableLanguage: ["English", "Russian"],
      },
    }),
    ...(sameAs && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// LocalBusiness Schema (ProfessionalService)
export function LocalBusinessSchema({
  name,
  description,
  url,
  image,
  address,
  geo,
  telephone,
  email,
  openingHours,
  priceRange,
  areaServed,
  serviceType,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#organization`,
    name,
    description,
    url,
    ...(image && { image }),
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
    ...(priceRange && { priceRange }),
    ...(areaServed && { areaServed }),
    ...(serviceType && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "IT Services",
        itemListElement: serviceType.map((service, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service,
          },
          position: index + 1,
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema
export function WebsiteSchema({
  name,
  url,
  description,
  inLanguage,
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service Schema
export function ServiceSchema({
  name,
  description,
  provider,
  areaServed,
  serviceType,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    ...(areaServed && { areaServed }),
    ...(serviceType && { serviceType }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema for Blog Posts
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
}: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  publisher: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Combined ITL Solutions Schema (for main layout)
export function ITLSolutionsSchema({ locale }: { locale: string }) {
  const isRussian = locale === "ru";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itlsolutions.net";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: "ITL Solutions",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: isRussian
      ? "Ведущая IT компания в Таджикистане. Разработка сайтов, мобильных приложений, облачные решения и IT консалтинг в Душанбе."
      : "Leading IT company in Tajikistan. Web development, mobile apps, cloud solutions, and IT consulting in Dushanbe.",
    address: {
      "@type": "PostalAddress",
      addressLocality: isRussian ? "Душанбе" : "Dushanbe",
      addressCountry: "TJ",
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Tajikistan",
      },
      {
        "@type": "GeoCircle",
        name: "Central Asia",
      },
    ],
    knowsLanguage: ["en", "ru"],
    sameAs: [
      "https://github.com/itlsolutions",
      "https://linkedin.com/company/itlsolutions",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}#localbusiness`,
    name: "ITL Solutions",
    description: isRussian
      ? "IT компания в Таджикистане: разработка сайтов, мобильных приложений, облачные решения, кибербезопасность и IT консалтинг"
      : "IT company in Tajikistan: web development, mobile apps, cloud solutions, cybersecurity and IT consulting",
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: isRussian ? "Душанбе" : "Dushanbe",
      addressRegion: isRussian ? "Таджикистан" : "Tajikistan",
      addressCountry: "TJ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.5598,
      longitude: 68.7738,
    },
    areaServed: ["Tajikistan", "Central Asia", "CIS"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isRussian ? "IT Услуги" : "IT Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Веб-разработка" : "Web Development",
            description: isRussian
              ? "Разработка сайтов и веб-приложений на React, Next.js, Node.js"
              : "Website and web application development with React, Next.js, Node.js",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Мобильные приложения" : "Mobile Apps",
            description: isRussian
              ? "Разработка мобильных приложений для iOS и Android"
              : "Mobile app development for iOS and Android",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "UI/UX Дизайн" : "UI/UX Design",
            description: isRussian
              ? "Дизайн пользовательских интерфейсов и опыта"
              : "User interface and experience design",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Облачные решения" : "Cloud Solutions",
            description: isRussian
              ? "Облачная инфраструктура на AWS, Azure, Google Cloud"
              : "Cloud infrastructure on AWS, Azure, Google Cloud",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "Кибербезопасность" : "Cybersecurity",
            description: isRussian
              ? "Аудит безопасности и защита данных"
              : "Security audits and data protection",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRussian ? "IT Консалтинг" : "IT Consulting",
            description: isRussian
              ? "Стратегическое планирование и цифровая трансформация"
              : "Strategic planning and digital transformation",
          },
        },
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: "ITL Solutions",
    url: siteUrl,
    description: isRussian
      ? "IT компания в Таджикистане - разработка сайтов и приложений в Душанбе"
      : "IT company in Tajikistan - web and app development in Dushanbe",
    inLanguage: ["en", "ru"],
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

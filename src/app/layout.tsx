import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itlsolutions.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ITL Solutions - Transforming Business through Technology",
    template: "%s | ITL Solutions",
  },
  description:
    "We deliver cutting-edge IT solutions, from cloud infrastructure to custom software development, designed to scale with your ambition.",
  keywords: [
    // English keywords
    "IT solutions",
    "IT company Tajikistan",
    "IT company Dushanbe",
    "web development Tajikistan",
    "software development Tajikistan",
    "mobile app development Dushanbe",
    "cloud solutions Central Asia",
    "cybersecurity Tajikistan",
    "IT consulting Dushanbe",
    // Russian keywords
    "IT компания Таджикистан",
    "IT компания Душанбе",
    "разработка сайтов Душанбе",
    "создание сайтов Таджикистан",
    "веб-разработка Таджикистан",
    "разработка мобильных приложений Душанбе",
    "IT услуги Таджикистан",
    "облачные решения Таджикистан",
    "кибербезопасность Таджикистан",
  ],
  authors: [{ name: "ITL Solutions" }],
  creator: "ITL Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ITL Solutions",
    title: "ITL Solutions - Transforming Business through Technology",
    description:
      "We deliver cutting-edge IT solutions, from cloud infrastructure to custom software development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ITL Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITL Solutions - Transforming Business through Technology",
    description:
      "We deliver cutting-edge IT solutions, from cloud infrastructure to custom software development.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

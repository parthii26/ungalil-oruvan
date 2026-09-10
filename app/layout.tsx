import type { Metadata, Viewport } from "next";
import { Newsreader, Noto_Sans_Tamil, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/services/settings";
import { getSiteUrl } from "@/lib/seo/site";
import { MotionRoot } from "@/components/motion/motion-root";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const tamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e5" },
    { media: "(prefers-color-scheme: dark)", color: "#211910" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const s = getSiteSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
      default: s.seo_title || s.brand_name,
      template: `%s · ${s.brand_name}`,
    },
    description: s.seo_description,
    openGraph: {
      title: s.seo_title,
      description: s.seo_description,
      siteName: s.brand_name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: s.seo_title,
      description: s.seo_description,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const s = getSiteSettings();
  const siteUrl = getSiteUrl();
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.brand_name,
    url: siteUrl,
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.seo_title || s.brand_name,
    url: siteUrl,
  };
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${tamil.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
        <MotionRoot />
        {children}
      </body>
    </html>
  );
}

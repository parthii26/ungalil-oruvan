import type { Metadata } from "next";
import { Newsreader, Noto_Sans_Tamil, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/services/settings";
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
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${tamil.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <MotionRoot />
        {children}
      </body>
    </html>
  );
}

import { Suspense } from "react";
import { StorefrontFooter } from "@/components/storefront/footer";
import { StorefrontHeader, StorefrontHeaderFallback } from "@/components/storefront/header";
import { PageFade } from "@/components/motion/page-fade";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<StorefrontHeaderFallback />}>
        <StorefrontHeader />
      </Suspense>
      <main className="flex-1 has-bottom-nav">{children}</main>
      <StorefrontFooter />
    </>
  );
}

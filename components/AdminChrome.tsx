"use client";

import { usePathname } from "next/navigation";

import { AmbientMotion } from "@/components/AmbientMotion";
import { Footer } from "@/components/Footer";
import { GlobalMediaLightbox } from "@/components/GlobalMediaLightbox";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import type { Locale } from "@/i18n/config";
import type { CmsMediaMap } from "@/lib/cms/types";
import type { GlobalCmsContent } from "@/content/schema/site";

export function AdminChrome({
  children,
  locale,
  globalContent,
  globalMedia,
}: {
  children: React.ReactNode;
  locale: Locale;
  globalContent: GlobalCmsContent;
  globalMedia: CmsMediaMap;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith(`/${locale}/admin`) || pathname.startsWith(`/${locale}/super-admin`) || pathname.startsWith(`/${locale}/maintenance`);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SmoothScroll />
      <AmbientMotion />
      <div className="site-shell">
        <Header locale={locale} content={globalContent} media={globalMedia} />
        {children}
        <Footer locale={locale} content={globalContent} media={globalMedia} />
      </div>
      <GlobalMediaLightbox />
    </>
  );
}

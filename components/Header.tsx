"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import type { Locale } from "@/i18n/config";
import { localizedPath, siteRoutes } from "@/lib/routes";
import type { GlobalCmsContent } from "@/content/schema/site";
import type { CmsMediaMap } from "@/lib/cms/types";

type HeaderProps = {
  locale: Locale;
  content: GlobalCmsContent;
  media: CmsMediaMap;
};

export function Header({ locale, content, media }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAr = locale === "ar";
  const navigation = content.navigation;
  const contactLabel = content.labels.contact;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const homeHref = localizedPath(locale, siteRoutes.home);
  const isNavActive = (href: string) =>
    href === homeHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const showGlass = pathname !== homeHref || isScrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          showGlass
            ? "border-b border-white/[0.08] bg-black/60 py-4 backdrop-blur-xl"
            : "bg-transparent py-8"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8">
          <Link href={homeHref} className="group relative flex shrink-0 items-center">
            <div className="relative h-12 w-[118px] sm:h-14 sm:w-[138px] md:h-[84px] md:w-[150px]">
              <Image
                src={String(media.logo)}
                alt="DYNATECH"
                fill
                sizes="(min-width: 768px) 150px, (min-width: 640px) 138px, 118px"
                priority
                className={`h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-80 ${isAr ? "object-right" : "object-left"}`}
              />
            </div>
          </Link>

          <nav className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-md lg:flex">
            {navigation.map((item) => {
              const href = localizedPath(locale, item.path);
              const isActive = isNavActive(href);

              return (
                <Link
                  key={item.path}
                  href={href}
                  className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? "bg-[#008ED3] text-white shadow-[0_0_15px_rgba(0,142,211,0.5)]"
                      : "text-white hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <LocaleSwitcher className="border-none bg-transparent px-2.5 py-2 text-xs font-black text-white transition-all hover:bg-white/5 hover:text-[#008ED3] hover:ring-1 hover:ring-[#008ED3]/40 sm:px-3" />

            <Link
              href={localizedPath(locale, siteRoutes.contact)}
              className="group hidden items-center gap-2 rounded-full bg-[#008ED3] px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:brightness-110 md:flex"
            >
              <span>{contactLabel}</span>
              <ArrowRight size={14} className={isAr ? "rotate-180" : ""} />
            </Link>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/5 lg:hidden"
              aria-label={isAr ? "فتح القائمة" : "Open menu"}
              aria-expanded={isMenuOpen}
              type="button"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 h-full w-full cursor-default"
          onClick={() => setIsMenuOpen(false)}
          aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
          tabIndex={isMenuOpen ? 0 : -1}
        />
      </div>

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? "قائمة التنقل" : "Navigation menu"}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed bottom-0 top-0 z-[120] flex w-[86%] max-w-[340px] flex-col border-white/10 bg-black shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isAr ? "right-0 border-l" : "left-0 border-r"
        } ${isMenuOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <span className="text-sm font-black uppercase tracking-tight text-[#008ED3]">{isAr ? "القائمة" : "Menu"}</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 text-white"
            aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto p-7">
          {navigation.map((item) => {
            const href = localizedPath(locale, item.path);
            const isActive = isNavActive(href);

            return (
              <Link
                key={item.path}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-xl font-black uppercase tracking-tight transition-all sm:text-2xl ${
                  isActive ? `${isAr ? "-translate-x-2" : "translate-x-2"} text-[#008ED3]` : "text-white hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-white/5 bg-zinc-900/50 p-8">
          <Link
            href={localizedPath(locale, siteRoutes.contact)}
            onClick={() => setIsMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-md bg-[#008ED3] py-4 text-xs font-black uppercase tracking-widest text-white"
          >
            {contactLabel}
          </Link>
        </div>
      </aside>
    </>
  );
}

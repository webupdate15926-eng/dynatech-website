import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { localizedPath, siteRoutes } from "@/lib/routes";
import type { GlobalCmsContent } from "@/content/schema/site";
import type { CmsMediaMap } from "@/lib/cms/types";

type FooterProps = {
  locale: Locale;
  content: GlobalCmsContent;
  media: CmsMediaMap;
};

export function Footer({ locale, content, media }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const contact = content.contact;
  const navigation = content.navigation;
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a0f29] py-7 text-white md:py-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#008ED3]/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(#008ED3_1px,transparent_1px),linear-gradient(90deg,#008ED3_1px,transparent_1px)] [background-size:88px_88px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[0.85fr_0.8fr_1.25fr_0.9fr] lg:items-start lg:gap-12">
          <div>
            <Link href={localizedPath(locale, siteRoutes.home)} className="inline-flex">
              <Image
                src={String(media.logo)}
                alt="DYNATECH"
                width={300}
                height={76}
                className="h-auto w-[180px] object-contain"
              />
            </Link>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-black tracking-normal text-[#008ED3] md:mb-5 md:text-base">
              {content.labels.quickLinks}
            </h4>
            <div className="grid gap-2.5 md:gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={localizedPath(locale, item.path)}
                  className="w-fit text-xs font-semibold text-white transition hover:text-[#008ED3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-black tracking-normal text-[#008ED3] md:mb-5 md:text-base">
              {content.labels.location}
            </h4>
            <div className="space-y-5 md:space-y-6">
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                <MapPin size={15} className="mt-0.5 text-[#008ED3]" />
                <span className="text-xs font-black text-white">{content.labels.cfcOffice}</span>
                <p className="col-start-2 max-w-xs text-[11px] leading-relaxed text-white">{contact.locations.cfcOffice}</p>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                <MapPin size={15} className="mt-0.5 text-[#008ED3]" />
                <span className="text-xs font-black text-white">{content.labels.autoHubProject}</span>
                <p className="col-start-2 max-w-xs text-[11px] leading-relaxed text-white">{contact.locations.autoHub}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-black tracking-normal text-[#008ED3] md:mb-5 md:text-base">
              {content.labels.connect}
            </h4>
            <div className="space-y-3 md:space-y-4">
              <a
                href={contact.phone.href}
                className="flex items-center gap-3 text-xs font-semibold text-white transition hover:text-[#008ED3]"
              >
                <Phone size={16} className="text-[#008ED3]" />
                <span dir="ltr">{contact.phone.display}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-xs font-semibold text-white transition hover:text-[#008ED3]"
              >
                <Mail size={16} className="text-[#008ED3]" />
                <span dir="ltr">{contact.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-white/10 pt-4 text-center text-[9px] font-semibold uppercase tracking-normal text-white md:mt-10 md:pt-5">
          &copy; {currentYear} DYNATECH CORP - {content.copyright}
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

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
  const footerSlogan = content.footerSlogan;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a0f29] py-10 text-white md:py-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#008ED3]/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(#008ED3_1px,transparent_1px),linear-gradient(90deg,#008ED3_1px,transparent_1px)] [background-size:88px_88px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-9 lg:grid-cols-[0.95fr_1fr_1.1fr_0.82fr] lg:items-start">
          <div>
            <Link href={localizedPath(locale, siteRoutes.home)} className="inline-flex">
              <Image
                src={String(media.logo)}
                alt="DYNATECH"
                width={300}
                height={76}
                className="h-auto w-[230px] object-contain"
              />
            </Link>
            <div className="mt-7 max-w-[280px] border-t border-white/10 pt-5 text-white">
              <span className="block text-[10px] font-black uppercase leading-loose tracking-[0.22em]">
                {footerSlogan}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.36em] text-[#008ED3]">
              {content.labels.location}
            </h4>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <span className="block min-h-8 text-[10px] font-black uppercase leading-relaxed tracking-[0.18em] text-white">
                  {content.labels.cfcOffice}
                </span>
                <p className="max-w-xs text-xs leading-relaxed text-white">
                  {contact.locations.cfcOffice}
                </p>
              </div>

              <div className="space-y-3">
                <span className="block min-h-8 text-[10px] font-black uppercase leading-relaxed tracking-[0.18em] text-white">
                  {content.labels.autoHubProject}
                </span>
                <p className="max-w-xs text-xs leading-relaxed text-white">
                  {contact.locations.autoHub}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.36em] text-[#008ED3]">
              {content.labels.quickLinks}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={localizedPath(locale, item.path)}
                  className="text-xs font-black uppercase tracking-[0.12em] text-white transition hover:text-[#008ED3]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.36em] text-[#008ED3]">
              {content.labels.connect}
            </h4>
            <div className="space-y-3 border-t border-white/10 pt-5 lg:border-t-0 lg:pt-0">
              <a
                href={contact.phone.href}
                className="flex items-center gap-3 text-sm font-black tracking-tight text-white transition hover:text-[#008ED3]"
              >
                <Phone size={16} className="text-[#008ED3]" />
                {contact.phone.display}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-xs font-semibold text-white transition hover:text-[#008ED3]"
              >
                <Mail size={16} className="text-[#008ED3]" />
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[0.34em] text-white">
          &copy; {currentYear} DYNATECH CORP - {content.copyright}
        </div>
      </div>
    </footer>
  );
}

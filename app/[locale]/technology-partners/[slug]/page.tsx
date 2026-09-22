import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import TechnologyPartnerPage from "@/components/partners/TechnologyPartnerPage";
import type { TechnologyPartnerPageContent, TechnologyPartnersContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  if (slug === "fft" || slug === "composites-united") {
    const overview = await getPageDocument<TechnologyPartnersContent>("technology-partners", locale);
    if (!overview.content.technologyPartners.partners.some((item) => item.id === (slug === "fft" ? "fft" : "cu"))) notFound();
    const pageKey = slug === "fft" ? "partner-fft" : "partner-cu";
    const document = await getPageDocument<TechnologyPartnerPageContent>(pageKey, locale);
    return <TechnologyPartnerPage partner={document.content.partner} ecosystemColumn={document.content.ecosystemColumn} copy={document.content.copy} media={document.media} locale={locale} />;
  }
  const { content } = await getPageDocument<TechnologyPartnersContent>("technology-partners", locale);
  const partner = content.technologyPartners.partners.find((item) => item.id === slug);
  if (!partner) notFound();

  const isAr = locale === "ar";
  return <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#080d20] px-5 pb-24 pt-36 text-white sm:px-8 lg:px-20">
    <div className="mx-auto max-w-7xl">
      <Link href={`/${locale}/technology-partners`} className="mb-12 inline-flex items-center gap-3 text-sm font-bold text-[#43becc] hover:text-white">
        <ArrowLeft size={18} />{isAr ? "شركاء التكنولوجيا" : "Technology partners"}
      </Link>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)] lg:items-start">
        <div>
          {partner.logo && <div className="relative mb-8 h-28 w-56 bg-white p-4"><Image src={partner.logo} alt={`${partner.name} logo`} fill sizes="224px" className="object-contain p-4" /></div>}
          <h1 className="text-4xl font-black uppercase leading-tight md:text-6xl">{partner.name}</h1>
          <h2 className="mt-7 text-2xl font-bold text-[#43becc]">{partner.heading}</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-300">{partner.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          {partner.ctaHref && <a href={partner.ctaHref} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-3 bg-[#0087cb] px-6 py-4 text-sm font-black text-black hover:bg-white">{partner.ctaLabel}<ArrowUpRight size={18} /></a>}
        </div>
        {partner.image && <div className="relative aspect-[4/3] w-full bg-[#111936]"><Image src={partner.image} alt={partner.name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" /></div>}
      </div>
    </div>
  </main>;
}

import Image from "next/image";
import type { Metadata } from "next";

import type { MaintenanceContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const { content } = await getPageDocument<MaintenanceContent>("maintenance", locale);
  return { title: content.page.title };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const { content, media } = await getPageDocument<MaintenanceContent>("maintenance", locale);
  const page = content.page;
  return <main dir={isAr ? "rtl" : "ltr"} className="flex min-h-screen items-center justify-center bg-[#080d20] px-5 py-12 text-white">
    <div className="w-full max-w-2xl text-center">
      <Image src={String(media.logo)} alt={page.logoAlt} width={320} height={100} priority className="mx-auto h-auto w-56 object-contain md:w-72" />
      <div className="mx-auto mt-10 h-px w-20 bg-[#008ED3]" />
      <h1 className="mt-8 text-4xl font-black uppercase leading-tight md:text-6xl">{page.title}</h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white md:text-lg">{page.description}</p>
      <a href={`mailto:${page.email}`} className="mt-8 inline-block text-sm font-bold text-[#008ED3] transition-colors hover:text-white">{page.email}</a>
    </div>
  </main>;
}

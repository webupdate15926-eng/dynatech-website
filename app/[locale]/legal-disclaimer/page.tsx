import type { Metadata } from "next";

import type { LegalContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale } | Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  return locale === "ar"
    ? {
        title: "إخلاء المسؤولية القانونية",
        description: "سياسة الخصوصية وإخلاء مسؤولية موقع DYNATECH وشروط الاستخدام.",
      }
    : {
        title: "Legal Disclaimer",
        description: "DYNATECH privacy policy, website disclaimer, and terms of use.",
      };
}

export default async function LegalDisclaimerPage({
  params,
}: {
  params: { locale: Locale } | Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  const isAr = locale === "ar";
  const { content } = await getPageDocument<LegalContent>("legal-disclaimer", locale);

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0a0f29] px-5 pb-20 pt-32 text-white sm:px-6 md:px-12 lg:px-20"
    >
      <section className="mx-auto max-w-5xl">
        <div className={`mb-10 ${isAr ? "border-r pr-5" : "border-l pl-5"} border-[#008ED3]`}>
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#008ED3]">
            {content.kicker}
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm font-semibold leading-relaxed text-white md:text-base">
            {content.description}
          </p>
        </div>

        <div className="space-y-5">
          {content.sections.map((section) => (
            <article key={section.title} className="border border-white/10 bg-[#121b43]/55 p-5 md:p-7">
              <h2 className="text-base font-black uppercase tracking-[0.08em] text-white md:text-lg">
                {section.title}
              </h2>
              <p className="mt-4 text-sm font-medium leading-8 text-white md:text-base">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { Cairo, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";

import "lenis/dist/lenis.css";
import "../globals.css";

import { AdminChrome } from "@/components/AdminChrome";
import { locales, type Locale } from "@/i18n/config";
import type { GlobalCmsContent } from "@/content/schema/site";
import { getPageDocument } from "@/lib/cms/page-document";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  
  return {
    title: {
      default: "DYNATECH | " + (locale === "ar" ? "رائدة الصناعة التكنولوجية" : "Leading Technology Industry"),
      template: "%s | DYNATECH",
    },
    description: locale === "ar" 
      ? "دايناتك - شريكك الاستراتيجي في توطين التكنولوجيا والصناعات المتقدمة في مصر والشرق الأوسط."
      : "DYNATECH - Your strategic partner in technology localization and advanced industries in Egypt and the Middle East.",
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await Promise.resolve(params);
  const rawLocale = resolvedParams?.locale;
  if (!rawLocale) {
    notFound();
  }

  const normalizedLocale = String(rawLocale).toLowerCase();

  if (!locales.includes(normalizedLocale as Locale)) {
    notFound();
  }

  const locale = normalizedLocale as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const globalDocument = await getPageDocument<GlobalCmsContent>("global", locale);

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className="relative dark bg-[#0a0f29]"
    >
      <body
        className={`${montserrat.variable} ${cairo.variable} ${
          locale === "ar" ? cairo.className : montserrat.className
        } bg-[#0a0f29] text-white antialiased`}
      >
        <AdminChrome locale={locale} globalContent={globalDocument.content} globalMedia={globalDocument.media}>{children}</AdminChrome>
      </body>
    </html>
  );
}

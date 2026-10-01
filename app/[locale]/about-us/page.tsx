import AboutPage from "@/components/about/AboutPage";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";
import type { DynatechContent } from "@/content/schema/about";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const document = await getPageDocument<DynatechContent>("about-us", locale);
  return <AboutPage content={document.content} media={document.media} locale={locale} />;
}

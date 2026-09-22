import TechInfoPage from "@/components/tech-info/TechInfoPage";
import type { TechInfoContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  const document = await getPageDocument<TechInfoContent>("tech-info", locale);
  return <TechInfoPage content={document.content} media={document.media} locale={locale} />;
}

import TechnologyPartnersPage from "@/components/partners/TechnologyPartnersPage";
import type { TechnologyPartnersContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  const document = await getPageDocument<TechnologyPartnersContent>("technology-partners", locale);
  return <TechnologyPartnersPage content={document.content} media={document.media} locale={locale} />;
}

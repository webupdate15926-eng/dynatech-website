import AutoHubPage from "@/components/auto-hub/AutoHubPage";
import type { AutoHubContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  const document = await getPageDocument<AutoHubContent>("the-auto-hub", locale);
  return <AutoHubPage content={document.content} media={document.media} locale={locale} />;
}

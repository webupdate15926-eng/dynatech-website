import LandingPage from "@/components/landing/LandingPage";
import type { LandingContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export default async function Landing({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const document = await getPageDocument<LandingContent>("landing", locale);
  return <LandingPage locale={locale} content={document.content} media={document.media} />;
}

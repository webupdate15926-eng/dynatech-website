import LandingPage from "@/components/landing/LandingPage";
import type { Locale } from "@/i18n/config";

export default async function Landing({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <LandingPage locale={locale} />;
}

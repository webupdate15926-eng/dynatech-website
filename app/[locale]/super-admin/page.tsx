import SuperAdminControl from "@/components/admin/SuperAdminControl";
import type { Locale } from "@/i18n/config";

export const metadata = { title: "Owner Control" };

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <SuperAdminControl locale={locale} />;
}

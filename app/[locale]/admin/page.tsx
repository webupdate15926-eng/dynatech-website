import CmsDashboard from "@/components/admin/CmsDashboard";
import type { Locale } from "@/i18n/config";

export const metadata = { title: "Content Dashboard" };

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  return <CmsDashboard locale={locale} />;
}

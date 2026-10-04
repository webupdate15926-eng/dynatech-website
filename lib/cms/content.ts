import { unstable_noStore as noStore } from "next/cache";

import type { Locale } from "@/i18n/config";
import { createPublicSupabaseClient } from "@/lib/cms/supabase";
import type { CmsDocument } from "@/lib/cms/types";
import { mergeCmsValues } from "@/lib/cms/document-utils";

export async function getCmsDocument<T>(
  pageKey: string,
  locale: Locale,
  fallback: CmsDocument<T>,
): Promise<CmsDocument<T>> {
  // Published CMS content must be read at request time so dashboard updates
  // are visible immediately instead of being frozen into the production build.
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from("cms_pages")
      .select("document")
      .eq("page_key", pageKey)
      .eq("locale", locale)
      .maybeSingle();

    if (error || !data?.document) return fallback;
    return mergeCmsValues(fallback, data.document);
  } catch {
    return fallback;
  }
}

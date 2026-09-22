import { getDefaultCmsDocument } from "@/content/default-document";
import type { Locale } from "@/i18n/config";
import { getCmsDocument } from "@/lib/cms/content";
import type { CmsPageKey } from "@/lib/cms/config";
import type { CmsDocument, JsonValue } from "@/lib/cms/types";
import { normalizeCmsDocument } from "@/lib/cms/normalize-document";

export async function getPageDocument<T>(
  pageKey: CmsPageKey,
  locale: Locale,
): Promise<CmsDocument<T>> {
  const fallback = await getDefaultCmsDocument(pageKey, locale);
  const document = await getCmsDocument(
    pageKey,
    locale,
    fallback,
  );
  return normalizeCmsDocument(pageKey, document) as unknown as CmsDocument<T>;
}

export async function getRawPageDocument(pageKey: CmsPageKey, locale: Locale) {
  return getPageDocument<JsonValue>(pageKey, locale);
}

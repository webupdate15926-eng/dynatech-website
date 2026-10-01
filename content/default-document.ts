import { getLocaleContent } from "@/content/load-locale";
import { defaultMedia } from "@/content/media";
import type { Locale } from "@/i18n/config";
import type { CmsPageKey } from "@/lib/cms/config";
import type { CmsDocument, JsonValue } from "@/lib/cms/types";

type Dictionary = Record<string, JsonValue>;

const contentKeys: Partial<Record<CmsPageKey, string>> = {
  global: "global",
  landing: "landing",
  maintenance: "maintenance",
  home: "home",
  "about-us": "about",
  "technology-partners": "technologyPartners",
  "the-auto-hub": "autoHub",
  "tech-info": "techInfo",
  careers: "careers",
  contact: "contact",
  "legal-disclaimer": "legal",
};

export async function getDefaultCmsDocument(
  pageKey: CmsPageKey,
  locale: Locale,
): Promise<CmsDocument<JsonValue>> {
  const dictionary = (await getLocaleContent(locale)) as Dictionary;
  let content: JsonValue | undefined;

  if (pageKey === "partner-fft" || pageKey === "partner-cu") {
    const partnerPages = dictionary.partnerPages as Record<string, JsonValue>;
    content = partnerPages[pageKey === "partner-fft" ? "fft" : "cu"];
  } else {
    const contentKey = contentKeys[pageKey];
    content = contentKey ? dictionary[contentKey] : undefined;
  }

  if (!content) throw new Error(`Missing default content for ${pageKey}/${locale}`);
  return { content, media: defaultMedia[pageKey] };
}

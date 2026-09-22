import type { CmsDocument, JsonValue } from "@/lib/cms/types";

type RecordValue = Record<string, JsonValue>;

function object(value: JsonValue | undefined): RecordValue | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

export function normalizeCmsDocument(pageKey: string, document: CmsDocument<JsonValue>): CmsDocument<JsonValue> {
  if (!["partner-fft", "partner-cu", "tech-info"].includes(pageKey)) return document;
  const normalized = structuredClone(document);
  const content = object(normalized.content);
  if (!content) return document;

  if (pageKey === "partner-fft" || pageKey === "partner-cu") {
    const copy = object(content.copy);
    if (copy && Array.isArray(copy.gallery)) {
      const legacy = Array.isArray(normalized.media.gallery) ? normalized.media.gallery : [];
      copy.gallery = copy.gallery.map((entry, index) => {
        const item = object(entry);
        return item ? { ...item, src: item.src ?? legacy[index] ?? "" } : entry;
      });
    }
  }

  if (pageKey === "tech-info") {
    const section = object(content.videoSection);
    if (section && Array.isArray(section.items)) {
      const legacy = [normalized.media.ieaVideo, normalized.media.catlVideo];
      section.items = section.items.map((entry, index) => {
        const item = object(entry);
        return item ? { ...item, src: item.src ?? legacy[index] ?? "" } : entry;
      });
    }
  }

  return normalized;
}

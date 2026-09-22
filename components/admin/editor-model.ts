import type { Locale } from "@/i18n/config";
import type { JsonValue } from "@/lib/cms/types";

export type EditorPath = (string | number)[];
export type EditorFieldGroup = { id: string; label: string; value: JsonValue };

const labels: Record<string, [string, string]> = {
  hero: ["Opening section", "القسم الافتتاحي"], company: ["The company", "الشركة"], founder: ["Founder", "المؤسس"], ceoMessage: ["CEO message", "رسالة الرئيس التنفيذي"], timeline: ["Company timeline", "الخط الزمني"], locations: ["Locations", "المواقع"],
  title: ["Heading", "العنوان"], heading: ["Subheading", "العنوان الفرعي"], kicker: ["Small heading", "العنوان التمهيدي"], eyebrow: ["Small heading", "العنوان التمهيدي"], name: ["Name", "الاسم"], description: ["Description", "الوصف"], paragraphs: ["Paragraphs", "الفقرات"], items: ["Entries", "العناصر"], lead: ["Opening paragraph", "الفقرة الافتتاحية"], intro: ["Introduction", "المقدمة"], supporting: ["Supporting text", "النص الإضافي"], imageAlt: ["Image description", "وصف الصورة"],
  brandLeft: ["Brand name", "اسم العلامة التجارية"], brandRight: ["Brand suffix", "تكملة اسم العلامة"], logoAlt: ["Logo description", "وصف الشعار"], heroImageAlt: ["Opening image description", "وصف الصورة الافتتاحية"], privacyPolicyLabel: ["Privacy policy link", "نص رابط سياسة الخصوصية"], primaryCtaLabel: ["Main button text", "نص الزر الرئيسي"], secondaryCtaLabel: ["Secondary button text", "نص الزر الثانوي"], ceoQuote: ["CEO quote", "اقتباس الرئيس التنفيذي"], ceoName: ["CEO name", "اسم الرئيس التنفيذي"], ceoTitle: ["CEO title", "منصب الرئيس التنفيذي"], ceoCtaLabel: ["CEO button text", "نص زر الرئيس التنفيذي"], ceoSectionLabel: ["CEO section heading", "عنوان قسم الرئيس التنفيذي"], ceoSubtitle: ["CEO section subtitle", "العنوان الفرعي لقسم الرئيس التنفيذي"], scrollLabel: ["Scroll prompt", "نص التمرير"], brandOutroTagline: ["Closing tagline", "الشعار الختامي"],
  headlineLine1: ["Main heading — first line", "العنوان الرئيسي — السطر الأول"], headlineLine2: ["Main heading — second line", "العنوان الرئيسي — السطر الثاني"], strategicPartnersLabel: ["Partners heading", "عنوان الشركاء"], knowMoreLabel: ["Video button text", "نص زر الفيديو"], headOfficeTitle: ["Head office heading", "عنوان المقر الرئيسي"], headOfficeLines: ["Head office address", "عنوان المقر الرئيسي"], autoHubTitle: ["Auto Hub heading", "عنوان مشروع مركز السيارات"], autoHubLines: ["Auto Hub address", "عنوان مشروع مركز السيارات"], contactLabel: ["Contact text", "نص التواصل"],
  role: ["Job title", "المسمى الوظيفي"], category: ["Project role", "الدور في المشروع"], biography: ["Short biography", "السيرة الذاتية المختصرة"], linkedinUrl: ["LinkedIn profile", "رابط لينكدإن"], signatureName: ["Signature name", "اسم صاحب الرسالة"], signatureRole: ["Signature job title", "المسمى الوظيفي في التوقيع"], signatureCompany: ["Signature company", "اسم الشركة في التوقيع"], year: ["Year", "السنة"], desc: ["Milestone description", "وصف الحدث"], detail: ["Address", "العنوان"], status: ["Status", "الحالة"],
  heroLines: ["Opening heading", "العنوان الافتتاحي"], introductionTitle: ["Introduction heading", "عنوان مقدمة المشروع"], introduction: ["Project introduction", "مقدمة المشروع"], teamTitle: ["Team heading", "عنوان فريق الإدارة"], team: ["Project management team", "فريق إدارة المشروع"], figuresTitle: ["Key figures heading", "عنوان أرقام المشروع"], figures: ["Key figures", "أرقام المشروع"], galleryTitle: ["Gallery heading", "عنوان المعرض"], label: ["Displayed title", "الاسم الظاهر"], value: ["Displayed value", "القيمة الظاهرة"], countTo: ["Counter target", "الرقم النهائي للعداد"], prefix: ["Text before number", "النص قبل الرقم"], suffix: ["Unit after number", "الوحدة بعد الرقم"],
  technologyPartners: ["Partner cards", "بطاقات الشركاء"], partners: ["Partners", "الشركاء"], partner: ["Partnership details", "تفاصيل الشراكة"], ecosystemColumn: ["Technology capabilities", "القدرات التكنولوجية"], copy: ["Page headings", "عناوين الصفحة"], mediaSection: ["Gallery headings", "عناوين معرض الوسائط"], gallery: ["Gallery", "المعرض"], ctaLabel: ["Button text", "نص الزر"], ctaHref: ["Partner website", "موقع الشريك"], href: ["Card destination", "رابط بطاقة الشريك"], roleTitle: ["DYNATECH role heading", "عنوان دور دايناتك"], roleText: ["DYNATECH role", "دور دايناتك"], scopeTitle: ["Agreement heading", "عنوان الاتفاقية"], scope: ["Agreement scope", "نطاق الاتفاقية"],
  videoSection: ["Video library", "مكتبة الفيديوهات"], why: ["Why join us", "لماذا تنضم إلينا"], conversation: ["Partnership invitation", "دعوة التعاون"], form: ["Contact form", "نموذج التواصل"], recipientEmail: ["Form recipient email", "البريد المستلم لرسائل النموذج"], fields: ["Form labels", "أسماء الحقول"], categories: ["Inquiry categories", "أنواع الاستفسارات"], submitLabel: ["Send button text", "نص زر الإرسال"],
  navigation: ["Navigation links", "روابط القائمة"], contact: ["Contact details", "بيانات التواصل"], labels: ["Footer headings", "عناوين الفوتر"], display: ["Displayed phone", "رقم الهاتف الظاهر"], footerSlogan: ["Footer slogan", "شعار الفوتر"], copyright: ["Copyright text", "حقوق النشر"],
  backgroundVideo: ["Page background video", "فيديو خلفية الصفحة"], backgroundImage: ["Page background image", "صورة خلفية الصفحة"], brandLogo: ["DYNATECH logo", "شعار دايناتك"], logo: ["Official logo", "الشعار الرسمي"], fftLogo: ["FFT official logo", "شعار FFT الرسمي"], cuLogo: ["CU official logo", "شعار CU الرسمي"], fftVideo: ["FFT video", "فيديو FFT"], cuVideo: ["CU video", "فيديو CU"], fftSigningImage: ["FFT agreement photo", "صورة اتفاقية FFT"], cuSigningImage: ["CU agreement photo", "صورة اتفاقية CU"], fftCardImage: ["FFT card background", "خلفية بطاقة FFT"], heroImage: ["Opening building photo", "صورة المبنى الافتتاحية"], introductionImage: ["Introduction photo", "صورة المقدمة"], imageSrc: ["Photo", "الصورة"], image: ["Photo", "الصورة"], src: ["Media file", "ملف الوسائط"], ieaVideo: ["IEA report video", "فيديو تقرير IEA"], catlVideo: ["CATL interview", "مقابلة CATL"],
};

export function fieldLabel(path: EditorPath, locale: Locale) {
  const key = String(path.at(-1) ?? "");
  const base = key.endsWith("Ar") ? key.slice(0, -2) : key;
  const fallback = base.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
  const label = labels[base]?.[locale === "ar" ? 1 : 0] ?? fallback;
  return key.endsWith("Ar") ? `${label} (${locale === "ar" ? "عربي" : "Arabic"})` : label;
}

export function isMediaPath(path: EditorPath) {
  if (path[0] === "media") return true;
  return /^(src|image|imageSrc|video|videoSrc|logo|logoSrc|poster|thumbnail)$/.test(String(path.at(-1) ?? ""));
}

export function containsMedia(value: JsonValue, path: EditorPath): boolean {
  if (isMediaPath(path)) return true;
  if (Array.isArray(value)) return value.some((item, index) => containsMedia(item, [...path, index]));
  if (value && typeof value === "object") {
    return Object.entries(value).some(([key, item]) => containsMedia(item, [...path, key]));
  }
  return false;
}

export function isHiddenField(path: EditorPath, pageKey: string) {
  const key = String(path.at(-1));
  if (["id", "path", "type", "imagePosition"].includes(key)) return true;
  if (pageKey === "the-auto-hub" && path[0] === "content" && path[1] === "figures" && ["countTo", "prefix", "suffix"].includes(key)) return true;
  if (["partner-fft", "partner-cu"].includes(pageKey) && path.join(".") === "media.gallery") return true;
  if (pageKey === "tech-info" && path[0] === "media" && ["ieaVideo", "catlVideo"].includes(key)) return true;

  if (pageKey === "home" && path[0] === "content" && path[1] === "hero" && path.length === 3) {
    return ![
      "logoAlt", "headlineLine1", "headlineLine2", "strategicPartnersLabel",
      "knowMoreLabel", "headOfficeTitle", "headOfficeLines", "autoHubTitle",
      "autoHubLines", "contactLabel", "heroImageAlt",
    ].includes(key);
  }

  if (pageKey === "about-us" && path[0] === "content" && path.length === 3) {
    if (path[1] === "company" && ["kicker", "lead"].includes(key)) return true;
    if (path[1] === "founder" && ["kicker", "role"].includes(key)) return true;
  }

  if (pageKey === "technology-partners") {
    if (path.join(".") === `content.technologyPartners.${key}` && ["kicker", "title"].includes(key)) return true;
  }

  if (["partner-fft", "partner-cu"].includes(pageKey) && path[0] === "content" && path[1] === "partner" && path.length === 3) {
    return !["roleTitle", "roleText", "scopeTitle", "scope"].includes(key);
  }

  if (pageKey === "contact" && path.join(".") === "content.form.fields.fileUpload") return true;
  return false;
}

export function itemTitle(value: JsonValue, index: number, locale: Locale) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of ["name", "title", "label", "year"]) {
      if (typeof value[key] === "string" && value[key]) return String(value[key]);
    }
  }
  return `${locale === "ar" ? "العنصر" : "Entry"} ${index + 1}`;
}

export function groupSectionFields(value: JsonValue, locale: Locale, pageKey: string, path: EditorPath): EditorFieldGroup[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [{ id: "content", label: locale === "ar" ? "المحتوى" : "Content", value }];
  }

  const buckets = new Map<string, Record<string, JsonValue>>();
  const bucketLabels: Record<string, [string, string]> = {
    identity: ["Brand & descriptions", "العلامة التجارية ووصف الصور"],
    copy: ["Headings & text", "العناوين والنصوص"],
    partners: ["Strategic partners", "الشركاء الاستراتيجيون"],
    leadership: ["CEO section", "قسم الرئيس التنفيذي"],
    signature: ["Signature", "التوقيع"],
    details: ["Locations & contact", "المواقع وبيانات التواصل"],
    recipient: ["Form delivery address", "بريد استقبال النموذج"],
    actions: ["Buttons & links", "الأزرار والروابط"],
    other: ["More content", "محتوى إضافي"],
  };

  const categoryFor = (key: string, item: JsonValue) => {
    const lower = key.toLowerCase();
    if (key === "recipientEmail") return "recipient";
    if (lower.startsWith("ceo") || lower.includes("founder")) return "leadership";
    if (lower.startsWith("signature")) return "signature";
    if (lower.includes("partner")) return "partners";
    if (/office|location|address|contact|phone|email|autohub/.test(lower)) return "details";
    if (/cta|href|link|button|submit|scroll|knowmore|label$/.test(lower)) return "actions";
    if (/name|title|heading|headline|kicker|eyebrow|paragraph|description|intro|lead|supporting|tagline|copy|text/.test(lower)) return "copy";
    if (/brand|logo|alt$/.test(lower)) return "identity";
    if (item && typeof item === "object") return key;
    return "other";
  };

  for (const [key, item] of Object.entries(value)) {
    const nextPath = [...path, key];
    if (isHiddenField(nextPath, pageKey) || isMediaPath(nextPath)) continue;
    const category = categoryFor(key, item);
    const bucket = buckets.get(category) ?? {};
    bucket[key] = item;
    buckets.set(category, bucket);
  }

  const order = ["identity", "copy", "partners", "leadership", "signature", "recipient", "details", "actions", "other"];
  return [...buckets.entries()]
    .sort(([a], [b]) => {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex);
    })
    .map(([id, groupedValue]) => ({
      id,
      label: bucketLabels[id]?.[locale === "ar" ? 1 : 0] ?? fieldLabel([id], locale),
      value: groupedValue,
    }));
}

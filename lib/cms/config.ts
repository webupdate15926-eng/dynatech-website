import { siteRoutes } from "@/lib/routes";

export const cmsPagePaths: Record<string, string> = {
  landing: "/landing",
  home: siteRoutes.home,
  "about-us": siteRoutes.about,
  "technology-partners": siteRoutes.partners,
  "partner-fft": `${siteRoutes.partners}/fft`,
  "partner-cu": `${siteRoutes.partners}/composites-united`,
  "the-auto-hub": siteRoutes.autoHub,
  "tech-info": siteRoutes.techInfo,
  careers: siteRoutes.careers,
  contact: siteRoutes.contact,
  "legal-disclaimer": siteRoutes.legalDisclaimer,
};

export const cmsPages = [
  { key: "global", label: "Global & Navigation", labelAr: "الإعدادات العامة والتنقل" },
  { key: "landing", label: "Coming Soon", labelAr: "صفحة قريبًا" },
  { key: "home", label: "Home", labelAr: "الرئيسية" },
  { key: "about-us", label: "About Us", labelAr: "من نحن" },
  { key: "technology-partners", label: "Technology Partners", labelAr: "شركاء التكنولوجيا" },
  { key: "partner-fft", label: "FFT Partner", labelAr: "شريك FFT" },
  { key: "partner-cu", label: "CU Partner", labelAr: "شريك CU" },
  { key: "the-auto-hub", label: "The Auto Hub", labelAr: "مشروع مركز السيارات" },
  { key: "tech-info", label: "Tech Info", labelAr: "المعلومات التقنية" },
  { key: "careers", label: "Careers", labelAr: "الوظائف" },
  { key: "contact", label: "Contact", labelAr: "تواصل معنا" },
  { key: "legal-disclaimer", label: "Legal Disclaimer", labelAr: "إخلاء المسؤولية" },
] as const;

export type CmsPageKey = (typeof cmsPages)[number]["key"];

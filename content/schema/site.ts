export type HomeHeroCopy = {
  logoAlt: string;
  headlineLine1: string;
  headlineLine2: string;
  strategicPartnersLabel: string;
  knowMoreLabel: string;
  headOfficeTitle: string;
  headOfficeLines: string[];
  autoHubTitle: string;
  autoHubLines: string[];
  contactLabel: string;
  heroImageAlt: string;
};

export type HomeContent = { hero: HomeHeroCopy };

export type GlobalCmsContent = {
  navigation: { label: string; path: string }[];
  contact: {
    email: string;
    phone: { display: string; href: string };
    locations: { cfcOffice: string; autoHub: string };
  };
  labels: {
    contact: string;
    location: string;
    quickLinks: string;
    connect: string;
    email: string;
    cfcOffice: string;
    autoHubProject: string;
  };
  footerSlogan: string;
  copyright: string;
};

export type LegalContent = {
  kicker: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
};

export type TechnologyPartnersContent = {
  hero: { kicker: string; title: string; intro: string; supporting: string };
  technologyPartners: {
    kicker: string;
    title: string;
    partners: {
      id: string;
      name: string;
      heading: string;
      paragraphs: string[];
      ctaLabel: string;
      ctaHref: string;
      href?: string;
      logo?: string;
      image?: string;
    }[];
  };
};

export type TechnologyPartnerContent = {
  partners: Partner[];
  ecosystem: { columns: EcosystemColumn[] };
};

export type Partner = {
  id: "fft" | "cu";
  name: string;
  location?: string;
  title: string;
  paragraphs: string[];
  roleTitle: string;
  roleText: string;
  scopeTitle: string;
  scope: string[];
  milestoneTitle: string;
  milestoneText: string;
  ctaLabel: string;
  ctaHref: string;
};

export type EcosystemColumn = {
  id: "fft" | "cu";
  label: string;
  title: string;
  items: string[];
};

export type PartnerPageCopy = {
  backLabel: string;
  hero: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    href: string;
    ctaLabel: string;
  };
  mediaSection: {
    kicker: string;
    title: string;
    ctaLabel: string;
    videoBadge: string;
    imageBadge: string;
    featuredLabel: string;
  };
  gallery: { label: string; type: "image" | "video"; featured?: boolean; src?: string }[];
};

export type TechnologyPartnerPageContent = {
  partner: Partner;
  ecosystemColumn: EcosystemColumn;
  copy: PartnerPageCopy;
};

export type TeamMember = {
  category: string;
  name: string;
  image: string;
  imagePosition: string;
  biography: string;
};

export type ProjectFigure = {
  label: string;
  value: string;
  description: string;
  countTo?: number;
  prefix?: string;
  suffix?: string;
};

export type AutoHubContent = {
  heroLines: string[];
  introductionTitle: string;
  introduction: string;
  teamTitle: string;
  team: TeamMember[];
  figuresTitle: string;
  figures: ProjectFigure[];
  galleryTitle: string;
};

export type TechInfoContent = {
  hero: { kicker: string; title: string; description: string };
  videoSection: {
    kicker: string;
    title: string;
    items: { title: string; description: string; src?: string }[];
  };
};

export type CareersPageContent = {
  why: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
};

export type ContactContent = {
  hero: { kicker: string; title: string; description: string };
  conversation: { title: string; paragraphs: string[] };
  form: {
    title: string;
    recipientEmail: string;
    fields: {
      fullName: string;
      company: string;
      email: string;
      phone: string;
      inquiryType: string;
      message: string;
      fileUpload: string;
    };
    categoriesTitle: string;
    categories: string[];
    submitLabel: string;
  };
};

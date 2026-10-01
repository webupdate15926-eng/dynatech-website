import type { CmsMediaMap } from "@/lib/cms/types";
import type { CmsPageKey } from "@/lib/cms/config";

export const defaultMedia = {
  global: { logo: "/logo-cropped.png" },
  landing: {
    backgroundVideo: "/hero.mp4",
    brandLogo: "/landing/real-logo.png",
    fftLogo: "/landing/fft-logo.png",
    cuLogo: "/landing/cu-logo.png",
    fftVideo: "https://res.cloudinary.com/dnosimawo/video/upload/v1776011180/WhatsApp_Video_2026-04-01_at_9.26.04_PM_d0kq38.mp4",
    cuVideo: "/hero/CARBON-CU -v1.mp4",
  },
  maintenance: { logo: "/logo-cropped.png" },
  home: {
    backgroundVideo: "/hero.mp4",
    brandLogo: "/logo-cropped.png",
    fftLogo: "/logo-fft.png",
    cuLogo: "/logo-cu.png",
    fftVideo: "/hero/FFT STORY مترجم عربي.mp4",
    cuVideo: "/hero/CARBON-CU -v1.mp4",
  },
  "about-us": { backgroundVideo: "/Dyna Tech - 01.mp4" },
  "technology-partners": {
    backgroundVideo: "/BACK GROUND-FOR TECHNOLOGY PARTENER.mp4",
    fftSigningImage: "/fft page Videos/main.jpeg",
    cuSigningImage: "/cu/IMG-20260622-WA0005.jpg",
    fftCardImage: "/fft page Videos/FFT/IMG-20260623-WA0009.jpg",
    fftLogo: "/logo-fft.png",
    cuLogo: "/logo-cu.png",
  },
  "partner-fft": {
    backgroundVideo: "/fft page Videos/FFT/VID-20260623-WA0008.mp4",
    logo: "/logo-fft.png",
    gallery: [
      "/fft page Videos/FFT Services @ Glance in 2min.mp4",
      "/fft page Videos/FFT Plant Engineering مترجم عربي.mp4",
      "/fft page Videos/FFT/VID-20260623-WA0008.mp4",
      "/hero/FFT STORY مترجم عربي.mp4",
    ],
  },
  "partner-cu": {
    backgroundVideo: "/cu/VID-20260624-WA0032.mp4",
    logo: "/logo-cu.png",
    gallery: ["/ahmedd.mp4", "/hero/CARBON-CU مترجم بالعربية.mp4"],
  },
  "the-auto-hub": {
    backgroundVideo: "/BACK GROUND-FOR Auto-Hub.mp4",
    heroImage: "/autohub/The%20Auto%20Hub/IMG-20260623-WA0021.jpg",
    introductionImage: "/autohub/The%20Auto%20Hub/IMG-20260623-WA0028.jpg",
    gallery: [
      "/autohub/The%20Auto%20Hub/IMG-20260623-WA0017.jpg",
      "/autohub/The%20Auto%20Hub/IMG-20260623-WA0019.jpg",
      "/autohub/The%20Auto%20Hub/IMG-20260623-WA0021.jpg",
      "/autohub/The%20Auto%20Hub/IMG-20260623-WA0027.jpg",
      "/autohub/The%20Auto%20Hub/IMG-20260623-WA0028.jpg",
      "/autohub/The%20Auto%20Hub/IMG-20260623-WA0038.jpg",
    ],
  },
  "tech-info": {
    backgroundVideo: "/BACK GROUND-FOR TECH INFO.mp4",
    ieaVideo: "/Tech info page Videos/IEA Battery Report.mp4",
    catlVideo: "/Tech info page Videos/Interview Robin Zing , CATL CEO.mp4",
  },
  careers: { backgroundVideo: "/Dyna Tech - 02.mp4" },
  contact: { backgroundImage: "/contact/the-podium.jpg" },
  "legal-disclaimer": {},
} satisfies Record<CmsPageKey, CmsMediaMap>;

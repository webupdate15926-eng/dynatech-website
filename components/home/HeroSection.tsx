"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { HomeHeroCopy } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { localizedPath, siteRoutes } from "@/lib/routes";
import type { CmsMediaMap } from "@/lib/cms/types";

type HeroSectionProps = {
  locale: Locale;
  content: HomeHeroCopy;
  media: CmsMediaMap;
  contactEmail: string;
};

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="min-w-0 max-w-full rounded-md border border-white/15 bg-[#0a0f29]/35 px-3 py-2 text-left shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:min-w-[226px] sm:px-4 sm:py-3">
      <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#008ED3] sm:mb-2 sm:text-[11px]">
        {title}
      </p>
      {lines.map((line) => (
        <p
          key={line}
          className={`text-[9px] font-semibold leading-relaxed text-white sm:text-[10px] ${
            /New Cairo|القاهرة الجديدة/.test(line) ? "whitespace-nowrap" : ""
          }`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function PartnerAction({
  label,
  ariaLabel,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="pointer-events-auto inline-flex min-h-8 cursor-pointer items-center gap-1.5 border-b border-[#008ED3]/45 pb-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#008ED3] transition hover:border-white hover:text-white sm:text-[9px]"
    >
      <span>{label}</span>
      <ArrowUpRight size={13} strokeWidth={2.5} />
    </button>
  );
}

function PartnerBlock({
  logoSrc,
  logoAlt,
  logoClassName,
  knowMoreLabel,
  knowMoreAriaLabel,
  onKnowMore,
}: {
  logoSrc: string;
  logoAlt: string;
  logoClassName: string;
  knowMoreLabel: string;
  knowMoreAriaLabel: string;
  onKnowMore: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div className="relative flex h-16 w-[108px] items-center justify-center sm:w-[150px] md:h-20 md:w-[184px]">
        <Image
          src={logoSrc}
          alt={logoAlt}
          fill
          sizes="(min-width: 768px) 190px, 150px"
          className={logoClassName}
        />
      </div>
      <div className="mt-2 flex min-h-8 items-center justify-center">
        <PartnerAction
          label={knowMoreLabel}
          ariaLabel={knowMoreAriaLabel}
          onClick={onKnowMore}
        />
      </div>
    </div>
  );
}

export function HeroSection({
  locale,
  media,
  contactEmail,
  content: {
    heroImageAlt,
    logoAlt,
    headlineLine1,
    headlineLine2,
    strategicPartnersLabel,
    knowMoreLabel,
    headOfficeTitle,
    headOfficeLines,
    autoHubTitle,
    autoHubLines,
    contactLabel,
  },
}: HeroSectionProps) {
  const isAr = locale === "ar";
  const reduceMotion = useReducedMotion();
  const heroContainer = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      };
  const heroItem = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.58, ease: "easeOut" as const },
        },
      };
  const [activeVideo, setActiveVideo] = useState<{
    src: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo]);

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="relative h-[100svh] overflow-hidden bg-[#0a0f29] text-white sm:h-auto sm:min-h-[100svh]">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-contain object-center sm:object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={heroImageAlt}
        >
          <source src={String(media.backgroundVideo)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#050915]/52 sm:bg-[#050915]/45" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050915_0%,rgba(5,9,21,0.94)_25%,rgba(5,9,21,0.28)_48%,rgba(5,9,21,0.48)_100%)] sm:bg-[radial-gradient(circle_at_34%_42%,rgba(0,142,211,0.16),transparent_26%),linear-gradient(90deg,rgba(3,7,18,0.62),rgba(3,7,18,0.18)_45%,rgba(3,7,18,0.62))]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050915] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#008ED3]/25" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(#008ED3_1px,transparent_1px),linear-gradient(90deg,#008ED3_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_top,black,transparent_62%)]" />

      <div className="relative z-10 flex h-full min-h-0 flex-col px-4 pb-4 pt-24 sm:min-h-[100svh] sm:px-6 sm:pb-5 sm:pt-[5.5rem] md:px-9 md:pb-6 md:pt-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={heroContainer}
          className="mx-auto flex min-h-0 flex-1 flex-col items-center justify-start pt-2 text-center sm:justify-center sm:pt-0"
        >
          <motion.div
            variants={heroItem}
            className="relative mb-4 h-10 w-40 max-w-[62vw] sm:mb-4 sm:h-[66px] sm:w-[254px] md:h-[86px] md:w-[330px] xl:h-[96px] xl:w-[372px]"
          >
            <Image
              src={String(media.brandLogo)}
              alt={logoAlt}
              fill
              priority
              sizes="420px"
              className="object-contain"
            />
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="max-w-[88vw] text-[clamp(1rem,5.2vw,1.35rem)] font-[1000] uppercase italic leading-[1.14] tracking-[0.01em] text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.55)] sm:text-[clamp(1.05rem,5.4vw,3.55rem)] sm:leading-[1.14] lg:max-w-5xl lg:text-[clamp(1.3rem,3.45vw,3.55rem)] lg:leading-[1.12] lg:tracking-[0.04em]"
          >
            <span className="lg:block">{headlineLine1} </span>
            <span className="whitespace-nowrap text-[#008ED3] lg:mt-4 lg:block">{headlineLine2}</span>
          </motion.h1>

          <motion.div
            variants={heroItem}
            className="mt-auto pt-4 text-[9px] font-black uppercase tracking-[0.34em] text-white sm:mt-4 sm:pt-0 sm:text-[10px] md:mt-5 md:text-[11px]"
          >
            {strategicPartnersLabel}
          </motion.div>

          <motion.div
            variants={heroItem}
            className="mt-3 grid w-full max-w-[340px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start justify-center gap-2 sm:w-auto sm:max-w-none sm:gap-4 md:mt-4 md:gap-8"
          >
            <PartnerBlock
              logoSrc={String(media.fftLogo)}
              logoAlt="FFT logo"
              logoClassName="object-contain drop-shadow-[0_0_18px_rgba(69,245,202,0.22)]"
              knowMoreLabel={knowMoreLabel}
              knowMoreAriaLabel={isAr ? "فتح فيديو FFT" : "Open FFT video"}
              onKnowMore={() =>
                setActiveVideo({
                  src: String(media.fftVideo),
                  title: "FFT",
                })
              }
            />

            <div className="h-14 w-px bg-white/55 md:h-[4.5rem]" />

            <PartnerBlock
              logoSrc={String(media.cuLogo)}
              logoAlt="Composites United logo"
              logoClassName="object-contain drop-shadow-[0_0_18px_rgba(239,106,37,0.18)]"
              knowMoreLabel={knowMoreLabel}
              knowMoreAriaLabel={isAr ? "فتح فيديو Composites United" : "Open Composites United video"}
              onKnowMore={() =>
                setActiveVideo({
                  src: String(media.cuVideo),
                  title: "Composites United",
                })
              }
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45, ease: "easeOut" }}
          className="relative z-20 mt-3 grid gap-2 sm:mt-4 sm:gap-3 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-5"
        >
          <div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <InfoCard
                title={headOfficeTitle}
                lines={headOfficeLines}
              />
              <InfoCard
                title={autoHubTitle}
                lines={autoHubLines}
              />
            </div>
            <p className="mt-2 text-[10px] font-medium text-white sm:mt-4 sm:text-[11px]">
              {contactLabel}{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="pointer-events-auto text-[#008ED3] transition hover:text-white"
              >
                {contactEmail}
              </a>
            </p>
          </div>

          <div className="hidden md:block" />

          <Link
            href={localizedPath(locale, siteRoutes.legalDisclaimer)}
            className="pointer-events-auto justify-self-end text-right text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:text-[#008ED3]"
          >
            {isAr ? "إخلاء المسؤولية القانونية" : "Legal Disclaimer"}
          </Link>
        </motion.div>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? `فيديو ${activeVideo.title}` : `${activeVideo.title} video`}
        >
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center border border-white/20 bg-white text-black transition hover:bg-[#008ED3] md:right-7 md:top-7"
            aria-label={isAr ? "إغلاق فيديو الشريك" : "Close partner video"}
          >
            <X size={20} />
          </button>

          <div className="w-full max-w-5xl overflow-hidden border border-white/15 bg-[#0a0f29] shadow-[0_28px_100px_rgba(0,0,0,0.68)]">
            <div className="border-b border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#008ED3] md:px-5">
              {activeVideo.title}
            </div>
            <video
              key={activeVideo.src}
              className="aspect-video w-full bg-black object-contain"
              controls
              autoPlay
              playsInline
              preload="none"
            >
              <source src={activeVideo.src} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}

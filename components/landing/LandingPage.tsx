"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { LandingContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import type { CmsMediaMap } from "@/lib/cms/types";

export default function LandingPage({ locale, content, media }: { locale: Locale; content: LandingContent; media: CmsMediaMap }) {
  const isAr = locale === "ar";
  const [muted, setMuted] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const desktopVideo = useRef<HTMLVideoElement>(null);
  const mobileVideo = useRef<HTMLVideoElement>(null);
  const backgroundVideo = String(media.backgroundVideo);
  const fftVideo = String(media.fftVideo);

  useEffect(() => {
    void desktopVideo.current?.play().catch(() => undefined);
    void mobileVideo.current?.play().catch(() => undefined);
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    if (desktopVideo.current) desktopVideo.current.muted = next;
    if (mobileVideo.current) mobileVideo.current.muted = next;
  };

  return <main data-site-chrome="hidden" dir={isAr ? "rtl" : "ltr"} className="relative flex h-dvh w-full flex-col overflow-x-hidden overflow-y-auto bg-[#0a0a0adc] font-sans text-white md:overflow-hidden">
    <button type="button" onClick={toggleSound} title={muted ? (isAr ? "تشغيل الصوت" : "Turn sound on") : (isAr ? "إيقاف الصوت" : "Mute sound")} className="fixed end-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/20 active:scale-90">
      {muted ? <VolumeX size={20} strokeWidth={1.5} className="text-white" /> : <Volume2 size={20} strokeWidth={1.5} className="animate-pulse text-[#008ED3]" />}
    </button>

    <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.5, ease: "easeInOut" }} className="pointer-events-none absolute inset-0 z-0 hidden h-full max-h-screen w-full items-center justify-center overflow-hidden md:flex">
      <video ref={desktopVideo} loop playsInline autoPlay muted={muted} className="absolute inset-0 h-full w-full object-cover opacity-40"><source src={backgroundVideo} type="video/mp4" /></video>
    </motion.div>

    <div className="relative z-20 flex w-full grow flex-col items-center justify-start gap-0 px-6 text-center md:shrink md:justify-center">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2, delay: 0.5, ease: "easeOut" }} className="relative hidden h-40 w-[360px] md:block">
        <Image src={String(media.brandLogo)} alt={content.hero.logoAlt} fill priority className="hidden object-cover md:block" sizes="360px" />
      </motion.div>

      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2, delay: 0.5, ease: "easeOut" }} className="landing-main-logo relative z-30 h-40 w-[250px] sm:hidden">
        <Image src={String(media.brandLogo)} alt={content.hero.logoAlt} fill priority className="object-contain" sizes="250px" />
      </motion.div>

      <div className="landing-content-up flex w-full flex-col items-center gap-4 md:py-0">
        <div className="mb-2 w-full overflow-hidden">
          <h1 className="px-6 text-[2.4rem] font-black uppercase italic leading-[0.9] tracking-tight drop-shadow-2xl md:text-[7rem]">
            <motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }} className="me-4 inline-block">{content.hero.titleLine1}</motion.span>
            {content.hero.titleHighlight ? <motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }} className="inline-block text-[#008ED3]">{content.hero.titleHighlight}</motion.span> : null}
          </h1>
        </div>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, delay: 1.1, ease: "easeOut" }} className="max-w-[260px] text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-white sm:max-w-md sm:text-xs md:max-w-2xl md:text-lg md:tracking-[0.3em]">{content.hero.tagline}</motion.p>
      </div>

      <div className="relative -mx-6 h-[34dvh] min-h-[220px] max-h-[320px] w-[calc(100%+3rem)] overflow-hidden md:hidden">
        <video ref={mobileVideo} loop playsInline autoPlay muted={muted} className="absolute inset-0 h-full w-full object-cover opacity-85"><source src={backgroundVideo} type="video/mp4" /></video>
      </div>

      <div className="landing-content-down flex w-full flex-col items-center gap-0 md:mt-10 md:pt-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, delay: 1.3, ease: "easeOut" }} className="flex w-full flex-col items-center gap-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-white md:text-xs">{content.partners.title}</p>
          <div className="mt-0 flex flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link href={content.partners.fftHref} target="_blank" className="relative h-16 w-28 overflow-hidden rounded-xl shadow-2xl md:h-24 md:w-40">
                <Image src={String(media.fftLogo)} alt="FFT Logo" fill className="object-contain p-3 opacity-100 md:p-5" sizes="(min-width:768px) 160px, 112px" />
              </Link>
              <button type="button" onClick={() => setVideoOpen(true)} className="border-b border-[#008ED3]/60 pb-0.5 text-[9px] font-black uppercase tracking-[0.25em] text-[#008ED3] transition-colors hover:border-white hover:text-white md:text-[11px]">{content.partners.knowMoreLabel}</button>
            </div>
            <div className="h-14 w-px bg-white" />
            <Link href={content.partners.cuHref} target="_blank" className="relative h-16 w-28 overflow-hidden md:h-24 md:w-40">
              <Image src={String(media.cuLogo)} alt="CU Logo" fill className="object-contain p-3 opacity-100 md:p-5" sizes="(min-width:768px) 160px, 112px" />
            </Link>
          </div>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, delay: 1.5, ease: "easeOut" }} className="relative bottom-auto start-0 z-30 mt-6 w-full max-w-[460px] px-1 md:absolute md:bottom-14 md:start-8 md:mt-0 md:px-0">
          <div className="grid grid-cols-2 gap-2 text-start max-[360px]:grid-cols-1 md:gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 md:p-3">
              <h2 className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#008ED3] md:text-[10px]">{content.details.headOfficeTitle}</h2>
              <p className="mt-1 text-[9px] leading-snug text-white md:text-[11px]">{content.details.headOfficeLines.map((line) => <span key={line} className="block">{line}</span>)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 md:p-3">
              <h2 className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#008ED3] md:text-[10px]">{content.details.autoHubTitle}</h2>
              <p className="mt-1 text-[9px] leading-snug text-white md:text-[11px]">{content.details.autoHubLines.map((line) => <span key={line} className="block">{line}</span>)}</p>
            </div>
          </div>
          <p className="mt-2 text-center text-[9px] text-white md:text-start md:text-[11px]">{content.details.contactLabel}{" "}<a href={`mailto:${content.details.email}`} className="border-b border-[#008ED3]/50 text-[#008ED3] transition-colors hover:border-white hover:text-white">{content.details.email}</a></p>
        </motion.section>
      </div>
    </div>

    <AnimatePresence>{videoOpen ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0f0f0f] p-3 shadow-2xl md:p-4">
        <button type="button" onClick={() => setVideoOpen(false)} title={isAr ? "إغلاق" : "Close"} className="absolute -end-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-xl"><X size={17} /></button>
        <video className="h-auto w-full rounded-xl" controls autoPlay playsInline><source src={fftVideo} type="video/mp4" /></video>
      </motion.div>
    </motion.div> : null}</AnimatePresence>
  </main>;
}

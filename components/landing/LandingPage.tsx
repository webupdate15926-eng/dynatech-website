"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Volume2, VolumeX, X } from "lucide-react";
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
  const brandLogo = String(media.brandLogo);
  const fftLogo = String(media.fftLogo);
  const cuLogo = String(media.cuLogo);

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

  const startVideo = (video: HTMLVideoElement) => {
    if (video.currentTime === 0) video.currentTime = 0.1;
    void video.play().catch(() => undefined);
  };

  return <main data-site-chrome="hidden" dir={isAr ? "rtl" : "ltr"} className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#05070b] text-white md:h-dvh md:overflow-hidden">
    <button type="button" onClick={toggleSound} title={muted ? (isAr ? "تشغيل الصوت" : "Turn sound on") : (isAr ? "إيقاف الصوت" : "Mute sound")} className="fixed top-5 end-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-2xl backdrop-blur-xl transition hover:border-[#008ED3] hover:text-[#008ED3]">
      {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
    </button>

    <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} className="pointer-events-none absolute inset-0 z-0 hidden md:block">
      <video ref={desktopVideo} autoPlay loop playsInline muted={muted} preload="auto" onLoadedMetadata={(event) => startVideo(event.currentTarget)} className="h-full w-full object-cover opacity-45"><source src={backgroundVideo} type="video/mp4" /></video>
      <div className="absolute inset-0 bg-black/25" />
    </motion.div>

    <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-6 text-center md:px-10">
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="relative h-40 w-[250px] md:w-[360px]">
        <Image src={brandLogo} alt={content.hero.logoAlt} fill priority className="object-contain" sizes="(min-width: 768px) 360px, 250px" />
      </motion.div>

      <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[2.4rem] font-black uppercase italic leading-[0.9] text-white drop-shadow-2xl md:text-[7rem]">
          <span>{content.hero.titleLine1}</span>{content.hero.titleHighlight ? <> <span className="text-[#008ED3]">{content.hero.titleHighlight}</span></> : null}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-white sm:text-xs md:text-lg md:tracking-[0.3em]">{content.hero.tagline}</p>
      </motion.div>

      <div className="relative -mx-5 mt-6 h-[32dvh] min-h-56 w-[calc(100%+2.5rem)] overflow-hidden md:hidden">
        <video ref={mobileVideo} autoPlay loop playsInline muted={muted} preload="auto" onLoadedMetadata={(event) => startVideo(event.currentTarget)} className="h-full w-full object-cover opacity-85"><source src={backgroundVideo} type="video/mp4" /></video>
      </div>

      <motion.section initial={false} animate={{ opacity: 1, y: 0 }} className="mt-6 md:mt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white md:text-xs">{content.partners.title}</p>
        <div className="mt-3 flex items-center justify-center gap-5 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-16 w-28 md:h-24 md:w-40"><Image src={fftLogo} alt="FFT" fill className="object-contain" sizes="160px" /></div>
            <button type="button" onClick={() => setVideoOpen(true)} className="flex items-center gap-1 border-b border-[#008ED3] pb-1 text-[9px] font-black uppercase text-[#008ED3] transition hover:text-white">{content.partners.knowMoreLabel}<ExternalLink size={11} /></button>
          </div>
          <span className="h-14 w-px bg-white/25" />
          <Link href={content.partners.cuHref} target="_blank" className="relative h-16 w-28 md:h-24 md:w-40"><Image src={cuLogo} alt="Composites United" fill className="object-contain" sizes="160px" /></Link>
        </div>
      </motion.section>

      <motion.section initial={false} animate={{ opacity: 1 }} className="mt-7 w-full max-w-[460px] md:absolute md:bottom-12 md:start-8 md:mt-0">
        <div className="grid grid-cols-2 gap-2 text-start">
          <div className="rounded-md border border-white/15 bg-white/5 p-3 backdrop-blur-md"><h2 className="text-[9px] font-black uppercase text-[#008ED3]">{content.details.headOfficeTitle}</h2><p className="mt-1 text-[9px] leading-4 text-white md:text-[11px]">{content.details.headOfficeLines.map((line) => <span key={line} className="block">{line}</span>)}</p></div>
          <div className="rounded-md border border-white/15 bg-white/5 p-3 backdrop-blur-md"><h2 className="text-[9px] font-black uppercase text-[#008ED3]">{content.details.autoHubTitle}</h2><p className="mt-1 text-[9px] leading-4 text-white md:text-[11px]">{content.details.autoHubLines.map((line) => <span key={line} className="block">{line}</span>)}</p></div>
        </div>
        <p className="mt-2 text-[10px] text-white">{content.details.contactLabel} <a href={`mailto:${content.details.email}`} className="text-[#008ED3] hover:text-white">{content.details.email}</a></p>
      </motion.section>
    </div>

    <AnimatePresence>{videoOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative w-full max-w-4xl rounded-md border border-white/15 bg-[#080d20] p-3 shadow-2xl">
        <button type="button" onClick={() => setVideoOpen(false)} title={isAr ? "إغلاق" : "Close"} className="absolute -end-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"><X size={19} /></button>
        <video className="aspect-video w-full rounded-sm bg-black object-contain" controls autoPlay playsInline><source src={fftVideo} type="video/mp4" /></video>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </main>;
}

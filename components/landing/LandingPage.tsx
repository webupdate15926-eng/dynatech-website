"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";

const backgroundVideo = "/hero.mp4";
const fftVideo = "https://res.cloudinary.com/dnosimawo/video/upload/v1776011180/WhatsApp_Video_2026-04-01_at_9.26.04_PM_d0kq38.mp4";

export default function LandingPage({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [muted, setMuted] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const desktopVideo = useRef<HTMLVideoElement>(null);
  const mobileVideo = useRef<HTMLVideoElement>(null);

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

  return <main dir={isAr ? "rtl" : "ltr"} className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#05070b] text-white md:h-dvh md:overflow-hidden">
    <button type="button" onClick={toggleSound} title={muted ? (isAr ? "تشغيل الصوت" : "Turn sound on") : (isAr ? "إيقاف الصوت" : "Mute sound")} className="fixed top-5 end-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-2xl backdrop-blur-xl transition hover:border-[#008ED3] hover:text-[#008ED3]">
      {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
    </button>

    <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} className="pointer-events-none absolute inset-0 z-0 hidden md:block">
      <video ref={desktopVideo} autoPlay loop playsInline muted={muted} preload="auto" onLoadedMetadata={(event) => startVideo(event.currentTarget)} className="h-full w-full object-cover opacity-45"><source src={backgroundVideo} type="video/mp4" /></video>
      <div className="absolute inset-0 bg-black/25" />
    </motion.div>

    <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-6 text-center md:px-10">
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="relative h-28 w-64 md:h-36 md:w-80">
        <Image src="/landing/real-logo.png" alt="DYNATECH Corporation" fill priority className="object-contain" sizes="(min-width: 768px) 320px, 256px" />
      </motion.div>

      <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-black uppercase italic leading-none text-white md:text-8xl">{isAr ? "قريبًا" : <><span>Coming</span> <span className="text-[#008ED3]">Soon</span></>}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-xs font-bold uppercase leading-6 text-white md:text-base">{isAr ? "قوة دفع جديدة في صناعة السيارات في مصر" : "A New Driving Force in Egypt's Automotive Industry"}</p>
      </motion.div>

      <div className="relative -mx-5 mt-6 h-[32dvh] min-h-56 w-[calc(100%+2.5rem)] overflow-hidden md:hidden">
        <video ref={mobileVideo} autoPlay loop playsInline muted={muted} preload="auto" onLoadedMetadata={(event) => startVideo(event.currentTarget)} className="h-full w-full object-cover opacity-85"><source src={backgroundVideo} type="video/mp4" /></video>
      </div>

      <motion.section initial={false} animate={{ opacity: 1, y: 0 }} className="mt-6 md:mt-10">
        <p className="text-[10px] font-black uppercase text-white md:text-xs">{isAr ? "الشركاء الاستراتيجيون" : "Strategic Partners"}</p>
        <div className="mt-3 flex items-center justify-center gap-5 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-16 w-28 md:h-20 md:w-36"><Image src="/landing/fft-logo.png" alt="FFT" fill className="object-contain" sizes="144px" /></div>
            <button type="button" onClick={() => setVideoOpen(true)} className="flex items-center gap-1 border-b border-[#008ED3] pb-1 text-[9px] font-black uppercase text-[#008ED3] transition hover:text-white">{isAr ? "اعرف المزيد" : "Know more"}<ExternalLink size={11} /></button>
          </div>
          <span className="h-14 w-px bg-white/25" />
          <Link href="https://composites-united.com/en/about-us/" target="_blank" className="relative h-16 w-28 md:h-20 md:w-36"><Image src="/landing/cu-logo.png" alt="Composites United" fill className="object-contain" sizes="144px" /></Link>
        </div>
      </motion.section>

      <motion.section initial={false} animate={{ opacity: 1 }} className="mt-7 w-full max-w-lg md:absolute md:bottom-12 md:start-8 md:mt-0">
        <div className="grid grid-cols-2 gap-2 text-start">
          <div className="rounded-md border border-white/15 bg-[#080d20]/70 p-3 backdrop-blur-md"><h2 className="text-[9px] font-black uppercase text-[#008ED3]">{isAr ? "المقر الرئيسي" : "Head Office"}</h2><p className="mt-1 text-[9px] leading-4 text-white md:text-[11px]">Cairo Festival City, The Podium,<br />P6-109, New Cairo, Egypt</p></div>
          <div className="rounded-md border border-white/15 bg-[#080d20]/70 p-3 backdrop-blur-md"><h2 className="text-[9px] font-black uppercase text-[#008ED3]">{isAr ? "مشروع مركز السيارات" : "Auto Hub Project"}</h2><p className="mt-1 text-[9px] leading-4 text-white md:text-[11px]">Industrial Zone, New Cairo, Egypt</p></div>
        </div>
        <p className="mt-2 text-[10px] text-white">{isAr ? "تواصل معنا:" : "Contact us:"} <a href="mailto:info@dynatecheg.com" className="text-[#008ED3] hover:text-white">info@dynatecheg.com</a></p>
      </motion.section>

      <footer className="mt-6 text-[9px] font-bold uppercase text-white md:absolute md:bottom-5 md:mt-0">© 2026 DYNATECH Automotive Egypt</footer>
    </div>

    <AnimatePresence>{videoOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative w-full max-w-4xl rounded-md border border-white/15 bg-[#080d20] p-3 shadow-2xl">
        <button type="button" onClick={() => setVideoOpen(false)} title={isAr ? "إغلاق" : "Close"} className="absolute -end-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"><X size={19} /></button>
        <video className="aspect-video w-full rounded-sm bg-black object-contain" controls autoPlay playsInline><source src={fftVideo} type="video/mp4" /></video>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </main>;
}

"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AutoHubContent, ProjectFigure } from "@/content/schema/site";
import type { CmsMediaMap } from "@/lib/cms/types";

type Props = { content: AutoHubContent; locale: string; media: CmsMediaMap };

function AnimatedFigure({ figure, index }: { figure: ProjectFigure; index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-70px" });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const numericValue = figure.countTo === undefined ? null : /^(.*?)(\d[\d,]*)([^\d]*)$/.exec(figure.value);
  const target = numericValue ? Number(numericValue[2].replaceAll(",", "")) : null;

  useEffect(() => {
    if (!isInView || target === null || reduceMotion) return;

    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, isInView, reduceMotion]);

  const displayValue = numericValue && !reduceMotion
    ? `${numericValue[1]}${count.toLocaleString("en-US")}${numericValue[3]}`
    : figure.value;

  return (
    <motion.article
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group flex min-w-0 flex-col items-center text-center"
    >
      <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-[#43becc]/40 bg-[#080d20] shadow-[0_0_42px_rgba(0,135,203,0.13)] md:h-44 md:w-44">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_155deg,#0087cb,#43becc44,#8e257a,#0087cb)] opacity-80 transition duration-700 group-hover:rotate-90" />
        <div className="absolute inset-[3px] rounded-full bg-[#111936]" />
        <div className="absolute inset-5 rounded-full border border-dashed border-white/15" />
        <p className="relative z-10 max-w-[138px] text-center text-[clamp(1.15rem,2vw,1.8rem)] font-black leading-tight text-white">{displayValue}</p>
      </div>
      <h3 className="mt-5 min-h-10 text-sm font-black uppercase leading-tight text-[#43becc]">{figure.label}:</h3>
      <p className="mt-2 max-w-[270px] text-sm leading-relaxed text-zinc-400">{figure.description}</p>
    </motion.article>
  );
}

export default function AutoHubPage({ content, locale, media }: Props) {
  const isAr = locale === "ar";
  const autoHubGallery = useMemo(
    () => Array.isArray(media.gallery) ? media.gallery.map(String).filter(Boolean) : [],
    [media.gallery],
  );
  const {
    figures,
    figuresTitle,
    galleryTitle,
    heroLines,
    introduction,
    introductionTitle,
    team,
    teamTitle,
  } = content;
  const reduceMotion = useReducedMotion();
  const introductionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: introductionProgress } = useScroll({
    target: introductionRef,
    offset: ["start end", "end start"],
  });
  const introductionImageY = useTransform(introductionProgress, [0, 1], [-58, 72]);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const reveal = reduceMotion
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } };

  useEffect(() => {
    if (activeGalleryIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGalleryIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveGalleryIndex((current) => current === null ? current : (current - 1 + autoHubGallery.length) % autoHubGallery.length);
      }
      if (event.key === "ArrowRight") {
        setActiveGalleryIndex((current) => current === null ? current : (current + 1) % autoHubGallery.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeGalleryIndex, autoHubGallery.length]);

  return (
    <main dir={isAr ? "rtl" : "ltr"} lang={locale} className="min-h-screen bg-[#080d20] pt-24 text-white">
      <section className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden border-b border-white/10 bg-[#080d20] px-5 py-14 sm:px-6 md:px-12 md:py-20 lg:px-20">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={String(media.backgroundVideo)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#080d20]/30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,32,0.54),rgba(8,13,32,0.18)_55%,rgba(8,13,32,0.38))]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div dir="ltr" className="relative mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
          <motion.div dir={isAr ? "rtl" : "ltr"} {...reveal} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-normal sm:text-5xl lg:text-[clamp(2.65rem,3.6vw,4.5rem)]">
              {heroLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h1>
            <span className="mt-7 block h-px w-20 bg-[#0087cb]" />
          </motion.div>

          <motion.div {...reveal} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.7, delay: 0.08 }} className="relative aspect-[16/10] overflow-hidden border border-white/15 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.32)] lg:left-8 xl:left-12">
            <Image
              src={String(media.heroImage)}
              alt={isAr ? "تصميم ثلاثي الأبعاد واضح لمبنى مشروع مركز السيارات" : "Clear 3D design of the Auto Hub building"}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </section>

      <section ref={introductionRef} className="relative border-b border-white/10 bg-[#111936] px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-20">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div dir="ltr" className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
          <motion.div dir={isAr ? "rtl" : "ltr"} {...reveal} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65 }}>
            <h2 className="text-4xl font-black uppercase leading-tight tracking-normal md:text-5xl lg:text-6xl">{introductionTitle}</h2>
            <span className="mt-5 block h-px w-16 bg-[#0087cb]" />
            <p className="mt-8 text-base leading-[1.9] text-zinc-300 md:text-lg">
              {introduction}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.06 }}
            style={{ y: reduceMotion ? 0 : introductionImageY }}
            className="relative aspect-[16/10] overflow-hidden border border-white/15 bg-[#080d20] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
          >
            <Image
              src={String(media.introductionImage)}
              alt={isAr ? "واجهة مبنى مشروع مركز السيارات" : "Auto Hub building exterior"}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-contain object-center"
            />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#111936] px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal md:text-4xl lg:text-5xl">{teamTitle}</h2>
            <span className="mx-auto mt-5 block h-px w-16 bg-[#0087cb]" />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((member, index) => (
              <motion.article key={member.name} {...reveal} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: index * 0.06 }} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveTeamIndex((current) => current === index ? null : index)}
                  aria-expanded={activeTeamIndex === index}
                  className="group relative block aspect-[3/4] w-full overflow-hidden border border-white/10 bg-[#080d20] text-start transition duration-500 hover:-translate-y-1 hover:border-[#43becc]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43becc]"
                >
                  {member.image && <Image src={member.image} alt={member.name} fill sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" style={{ objectPosition: member.imagePosition }} />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d20] via-[#080d20]/10 to-transparent" />
                  <div className={`absolute inset-0 flex flex-col justify-end overflow-y-auto bg-[#080d20]/96 p-4 transition duration-500 md:p-5 ${activeTeamIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"}`}>
                    <span className="w-fit bg-[#0087cb] px-2.5 py-1.5 text-[9px] font-black uppercase text-black">{member.category}</span>
                    <h3 className="mt-3 text-lg font-black leading-tight text-white md:text-xl">{member.name}</h3>
                    <p className="mt-4 text-[11px] leading-[1.65] text-zinc-300 md:text-xs">{member.biography}</p>
                  </div>
                  <div className={`absolute inset-x-0 bottom-0 p-5 transition duration-300 ${activeTeamIndex === index ? "pointer-events-none opacity-0" : "opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0"}`}>
                    <span className="inline-block bg-[#0087cb] px-2.5 py-1.5 text-[9px] font-black uppercase text-black">{member.category}</span>
                    <h3 className="mt-3 text-xl font-black leading-tight text-white md:text-2xl">{member.name}</h3>
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#080d20] px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-20">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal md:text-4xl lg:text-5xl">{figuresTitle}</h2>
            <span className="mx-auto mt-5 block h-px w-16 bg-[#0087cb]" />
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {figures.map((figure, index) => <AnimatedFigure key={figure.label} figure={figure} index={index} />)}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#111936] px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-20">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10">
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal md:text-4xl lg:text-5xl">{galleryTitle}</h2>
            <span className="mt-5 block h-px w-16 bg-[#0087cb]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {autoHubGallery.map((src, index) => (
            <motion.button
              key={src}
              type="button"
              {...reveal}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.15) }}
              onClick={() => setActiveGalleryIndex(index)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden border border-white/10 bg-white"
              aria-label={isAr ? "فتح صورة المشروع" : "Open project image"}
            >
              <Image src={src} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-contain transition duration-500 group-hover:brightness-105" />
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/55 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                <Maximize2 size={17} />
              </span>
            </motion.button>
            ))}
          </div>
        </div>
      </section>

      {activeGalleryIndex !== null ? (
        <div className="fixed inset-0 z-[310] flex items-center justify-center bg-black/92 px-4 py-5 backdrop-blur-md md:px-8" role="dialog" aria-modal="true" aria-label={isAr ? "صورة المشروع" : "Project image"}>
          <button type="button" onClick={() => setActiveGalleryIndex(null)} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center bg-white text-black transition hover:bg-[#43becc] md:right-7 md:top-7" aria-label={isAr ? "إغلاق" : "Close"}><X size={20} /></button>
          <button type="button" onClick={() => setActiveGalleryIndex((current) => current === null ? current : (current - 1 + autoHubGallery.length) % autoHubGallery.length)} className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/55 text-white transition hover:bg-white hover:text-black md:left-7" aria-label={isAr ? "السابق" : "Previous"}><ChevronLeft size={22} /></button>
          <button type="button" onClick={() => setActiveGalleryIndex((current) => current === null ? current : (current + 1) % autoHubGallery.length)} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/55 text-white transition hover:bg-white hover:text-black md:right-7" aria-label={isAr ? "التالي" : "Next"}><ChevronRight size={22} /></button>
          <div className="relative h-full max-h-[86vh] w-full max-w-6xl overflow-hidden border border-white/10 bg-[#080d20]">
            <Image src={autoHubGallery[activeGalleryIndex]} alt="" fill sizes="100vw" className="object-contain" priority />
          </div>
        </div>
      ) : null}
    </main>
  );
}

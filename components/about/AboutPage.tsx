'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Linkedin } from 'lucide-react'
import Image from 'next/image'

import type { DynatechContent } from '@/content/schema/about'

import FounderLayer from './FounderLayer'
import LocationsLayer from './LocationsLayer'
import MissionVisionLayer from './MissionVisionLayer'
import TimelineLayer from './TimelineLayer'
import type { CmsMediaMap } from '@/lib/cms/types'

function BackgroundGrid({ fixed = false }: { fixed?: boolean }) {
  return (
    <div
      className={`pointer-events-none inset-0 z-[1] overflow-hidden ${fixed ? 'fixed' : 'absolute'}`}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(#008ED322 1px, transparent 1px), linear-gradient(90deg, #008ED322 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

function VideoBackground({ fixed = false, src }: { fixed?: boolean; src: string }) {
  return (
    <div className={`inset-0 z-0 ${fixed ? 'fixed' : 'absolute'}`}>
      <video
        className="h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="DYNATECH background video"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#050915]/8" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,15,41,0.34),rgba(10,15,41,0.1)_45%,rgba(10,15,41,0.34)),radial-gradient(circle_at_50%_45%,rgba(0,142,211,0.06),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0f29]/38 to-transparent" />
    </div>
  )
}

function CeoMessage({
  content,
  isAr,
}: {
  content: DynatechContent['ceoMessage']
  isAr: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const cardY = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [70, 0, 0, -80])
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.78, 1],
    [0.2, 1, 1, 0.25],
  )

  return (
    <section ref={sectionRef} className="relative z-10 overflow-hidden bg-[#0a0f29]/40 px-4 py-28 sm:px-6 md:py-36">
      <motion.div
        style={{ y: cardY, opacity: cardOpacity }}
        className={`relative z-10 mx-auto w-full max-w-5xl bg-[#111936]/82 p-6 shadow-[0_26px_90px_rgba(0,0,0,0.36)] backdrop-blur-sm md:p-8 lg:p-10 ${isAr ? 'border-r-4 border-[#008ED3] text-right' : 'border-l-4 border-[#008ED3]'}`}
      >
        <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {content.title}
        </h2>
        <div className="mt-8 space-y-5">
          {content.paragraphs.map((paragraph, paragraphIndex) => (
            <motion.p
              key={paragraph}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: Math.min(paragraphIndex * 0.04, 0.16),
              }}
              className="text-sm font-medium leading-relaxed text-white md:text-base"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        <div className="mt-9 border-t border-white/10 pt-6">
          <p className="font-black text-white">{content.signatureName}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#008ED3]">
            {content.signatureRole}
          </p>
          <p className="mt-1 text-xs text-white">
            {content.signatureCompany}
          </p>
        </div>
      </motion.div>
    </section>
  )
}

function MobileIntro({
  content,
  isAr,
}: {
  content: DynatechContent
  isAr: boolean
}) {
  return (
    <section className="relative z-10 px-4 pb-20 pt-28 md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`bg-[#111936]/82 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.36)] backdrop-blur-sm ${
          isAr
            ? 'border-r-4 border-[#008ED3] text-right'
            : 'border-l-4 border-[#008ED3]'
        }`}
      >
        <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-white">
          {content.company.title}
        </h1>
        <div className="mt-6 space-y-5">
          {content.company.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm font-medium leading-6 text-white"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="mt-16"
      >
        <h2 className="whitespace-nowrap text-[clamp(1.55rem,8vw,2.25rem)] font-black uppercase leading-none tracking-tight text-white">
          {content.founder.name}
        </h2>
        <p className="mt-6 text-sm font-medium leading-6 text-white">
          {content.founder.description}
        </p>
        <a
          href={content.founder.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 border border-[#008ED3] bg-[#008ED3] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110"
        >
          <Linkedin size={16} strokeWidth={2.4} />
          <span>{/^(learn more|اعرف المزيد)$/i.test(content.founder.linkedinLabel.trim()) ? 'LinkedIn' : content.founder.linkedinLabel}</span>
          <ArrowUpRight size={15} />
        </a>
        <div className="relative mt-8 aspect-[4/5] w-full overflow-hidden bg-[#111936]">
          <Image
            src={content.founder.imageSrc}
            alt={content.founder.imageAlt}
            fill
            sizes="calc(100vw - 32px)"
            className="object-contain object-bottom"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

export default function AboutPage({
  content,
  media,
  locale,
}: {
  content: DynatechContent
  media: CmsMediaMap
  locale: string
}) {
  const isAr = locale === 'ar'
  const introRef = useRef<HTMLElement>(null)

  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ['start start', 'end end'],
  })
  const companyOpacity = useTransform(introProgress, [0, 0.28, 0.38], [1, 1, 0])
  const founderScale = useTransform(introProgress, [0.3, 0.42], [0.97, 1])
  const founderY = useTransform(introProgress, [0.3, 0.96], [34, -30])
  const founderOpacity = useTransform(
    introProgress,
    [0.3, 0.4, 0.9, 0.98],
    [0, 1, 1, 0],
  )

  return (
    <main
      dir={isAr ? 'rtl' : 'ltr'}
      lang={locale}
      className="relative isolate bg-[#0a0f29]"
    >
      <VideoBackground fixed src={String(media.backgroundVideo)} />
      <BackgroundGrid fixed />

      <MobileIntro content={content} isAr={isAr} />

      <section
        ref={introRef}
        className="relative z-10 hidden w-full md:block"
        style={{ height: '250vh' }}
      >
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <MissionVisionLayer
            opacity={companyOpacity}
            data={content.company}
            isAr={isAr}
          />
          <FounderLayer
            opacity={founderOpacity}
            scale={founderScale}
            y={founderY}
            data={content.founder}
            isAr={isAr}
          />
        </div>
      </section>

      <CeoMessage content={content.ceoMessage} isAr={isAr} />

      <TimelineLayer
        copy={{ kicker: content.timeline.kicker, titleLine1: content.timeline.title, titleHighlight: '' }}
        items={content.timeline.items}
        isAr={isAr}
      />
      <LocationsLayer
        copy={{ kicker: content.locations.kicker, titleLine1: content.locations.title, titleHighlight: '' }}
        items={content.locations.items}
        isAr={isAr}
      />
    </main>
  )
}

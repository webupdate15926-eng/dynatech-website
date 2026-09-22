"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { TechInfoContent } from "@/content/schema/site";
import type { CmsMediaMap } from "@/lib/cms/types";

type Props = {
  content: TechInfoContent;
  locale: string;
  media: CmsMediaMap;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex flex-col gap-3">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#43becc]">
        {children}
      </p>
      <span className="h-px w-16 bg-[#0087cb]" />
    </div>
  );
}

export default function TechInfoPage({ content, locale, media }: Props) {
  const isAr = locale === "ar";
  const managedVideos = content.videoSection.items.filter((item) => item.src);

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-screen bg-[#0a0f29] pt-24 text-white selection:bg-[#0087cb] selection:text-black"
    >
      <section className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden border-b border-white/10">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={String(media.backgroundVideo)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0a0f29]/16" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,15,41,0.52),rgba(10,15,41,0.18)_55%,rgba(10,15,41,0.4))]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0087cb] to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <SectionKicker>{content.hero.kicker}</SectionKicker>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.94] tracking-tight md:text-7xl">
              {content.hero.title}
            </h1>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative border border-white/10 border-l-[#0087cb] bg-[#121b43]/75 p-6 shadow-[inset_4px_0_0_#0087cb] md:p-8"
          >
            <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#0087cb]/70" />
            <p className="text-lg font-semibold leading-relaxed text-[#43becc]">
              {content.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-[#080d20] px-5 py-16 sm:px-6 md:px-12 md:py-20 lg:px-20">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl">
            <SectionKicker>{content.videoSection.kicker}</SectionKicker>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-5xl">
              {content.videoSection.title}
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {managedVideos.map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group overflow-hidden border border-white/10 bg-[#121b43]"
              >
                <div className="relative aspect-video bg-black">
                  <video
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-100 transition group-hover:opacity-0">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-sm">
                      <Play size={25} fill="currentColor" className="translate-x-0.5" />
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#43becc]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-black uppercase leading-tight tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400 md:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

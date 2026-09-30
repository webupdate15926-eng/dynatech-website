"use client";

import { motion } from "framer-motion";
import {
  Factory,
  Globe2,
  GraduationCap,
  Rocket,
} from "lucide-react";
import type { CmsMediaMap } from "@/lib/cms/types";
import type { CareersPageContent } from "@/content/schema/site";

type Props = {
  content: CareersPageContent;
  locale: string;
  media: CmsMediaMap;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function BenefitIcon({ index }: { index: number }) {
  if (index === 0) return <Globe2 size={24} />;
  if (index === 1) return <Rocket size={24} />;
  if (index === 2) return <GraduationCap size={24} />;
  return <Factory size={24} />;
}

export default function CareersPage({ content, locale, media }: Props) {
  const isAr = locale === "ar";

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-screen bg-[#0a0f29] pt-24 text-white selection:bg-[#008ED3] selection:text-black"
    >
      <section className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden border-b border-white/10 px-6 py-20">
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
        <div className="absolute inset-0 bg-[#0a0f29]/20" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,15,41,0.52),rgba(10,15,41,0.16)_56%,rgba(10,15,41,0.42))]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
              {content.why.title}
            </h1>
            <span className="mt-5 block h-px w-16 bg-[#008ED3]" />
          </div>
          <p className="text-base leading-relaxed text-white">
            {content.why.description}
          </p>
        </div>

        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {content.why.items.map((item, index) => (
            <motion.article
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group relative min-h-[260px] overflow-hidden bg-[#121b43] p-6 transition hover:bg-[#0f1738]"
            >
              <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#008ED3] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#008ED3]/35 bg-[#008ED3]/10 text-[#008ED3]">
                <BenefitIcon index={index} />
              </div>
              <h3 className="text-xl font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#008ED3]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
        </div>
      </section>
    </main>
  );
}

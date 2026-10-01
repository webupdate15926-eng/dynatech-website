"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { TimelineItem, TimelineSectionCopy } from "@/content/schema/about";

type Props = {
  copy: TimelineSectionCopy;
  items: TimelineItem[];
  isAr?: boolean;
};

export default function TimelineLayer({ copy, items, isAr = false }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-10 overflow-hidden border-y border-white/10 bg-[#080d20]/76 px-5 py-16 backdrop-blur-sm sm:px-6 md:px-12 md:py-24 lg:px-20"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#008ED3_1px,transparent_1px),linear-gradient(90deg,#008ED3_1px,transparent_1px)] [background-size:58px_58px]" />
      <div className="mx-auto max-w-7xl">
        <div className={`relative z-10 ${isAr ? "text-right" : "text-left"}`}>
          {copy.kicker ? <p className="text-xs font-black uppercase text-[#008ED3]">{copy.kicker}</p> : null}
          <h2 className="mt-3 text-5xl font-black uppercase italic leading-none text-white sm:text-6xl md:text-7xl">
            {copy.titleLine1}{copy.titleHighlight ? ` ${copy.titleHighlight}` : ""}
          </h2>
          <span className="mt-5 block h-px w-16 bg-[#008ED3]" />
        </div>

        <div className="relative z-10 mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={`${item.year}-${i}`}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.16) }}
              className={`relative min-w-0 pt-14 ${isAr ? "text-right" : "text-left"}`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-5 select-none text-[5.5rem] font-black leading-none text-white/[0.06] sm:text-[6.5rem] md:text-[7.5rem] ${isAr ? "right-0" : "left-0"}`}
              >
                {item.year}
              </span>
              <div className="relative mb-6 flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full bg-[#008ED3] shadow-[0_0_12px_rgba(0,142,211,0.9)]" />
                <span className={`h-px flex-1 from-[#008ED3]/55 to-transparent ${isAr ? "bg-gradient-to-l" : "bg-gradient-to-r"}`} />
              </div>
              <p className="text-3xl font-black leading-none text-white md:text-4xl">{item.year}</p>
              <p dir={isAr ? "rtl" : "ltr"} className="mt-4 max-w-sm text-sm leading-7 text-white">
                {item.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

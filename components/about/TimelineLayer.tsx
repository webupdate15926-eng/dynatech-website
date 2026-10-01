"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import type { TimelineItem, TimelineSectionCopy } from "@/content/schema/about";

type Props = {
  copy: TimelineSectionCopy;
  items: TimelineItem[];
  isAr?: boolean;
  x?: MotionValue<number>;
  opacity?: MotionValue<number>;
  scale?: MotionValue<number>;
};

export default function TimelineLayer({ copy, items, isAr = false, x, opacity, scale }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 overflow-hidden border-y border-white/10 bg-[#080d20]/76 px-5 py-16 backdrop-blur-sm md:hidden"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#008ED3_1px,transparent_1px),linear-gradient(90deg,#008ED3_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="relative z-10">
          <div className={isAr ? "text-right" : "text-left"}>
            {copy.kicker ? <p className="text-xs font-black uppercase text-[#008ED3]">{copy.kicker}</p> : null}
            <h2 className="mt-3 text-5xl font-black uppercase italic leading-none text-white">
              {copy.titleLine1}{copy.titleHighlight ? ` ${copy.titleHighlight}` : ""}
            </h2>
            <span className="mt-5 block h-px w-16 bg-[#008ED3]" />
          </div>

          <div className="mt-14 space-y-14">
            {items.map((item, index) => (
              <motion.article
                key={`${item.year}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.45 }}
                className={`relative min-w-0 pt-12 ${isAr ? "text-right" : "text-left"}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-4 select-none text-[5.5rem] font-black leading-none text-white/[0.06] ${isAr ? "right-0" : "left-0"}`}
                >
                  {item.year}
                </span>
                <div className="relative mb-5 flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#008ED3] shadow-[0_0_12px_rgba(0,142,211,0.9)]" />
                  <span className={`h-px flex-1 from-[#008ED3]/55 to-transparent ${isAr ? "bg-gradient-to-l" : "bg-gradient-to-r"}`} />
                </div>
                <p className="text-3xl font-black leading-none text-white">{item.year}</p>
                <p className="mt-4 text-sm leading-7 text-white">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <motion.div
        style={{ x, opacity, scale }}
        dir={isAr ? "rtl" : "ltr"}
        className="absolute inset-0 z-50 hidden items-center px-10 md:flex md:px-20"
      >
        <div className="flex min-w-max items-start gap-12">
          <div className={`sticky min-w-[280px] ${isAr ? "right-0 text-right" : "left-0 text-left"}`}>
            {copy.kicker ? <p className="mb-5 text-xs font-black uppercase text-[#008ED3]">{copy.kicker}</p> : null}
            <h2 className="text-8xl font-black uppercase italic leading-none text-white">
              {copy.titleLine1}
              {copy.titleHighlight ? <><br /><span>{copy.titleHighlight}</span></> : null}
            </h2>
            <span className="mt-7 block h-px w-20 bg-[#008ED3]" />
          </div>

          {items.map((item, index) => (
            <article key={`${item.year}-${index}`} className={`relative min-w-[320px] pt-16 ${isAr ? "text-right" : "text-left"}`}>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-10 select-none text-[140px] font-black leading-none text-white/[0.08] ${isAr ? "-right-6" : "-left-6"}`}
              >
                {item.year}
              </span>
              <div className="relative z-10">
                <span className={`mb-6 block h-3 w-3 rounded-full bg-[#008ED3] shadow-[0_0_10px_#008ED3] ${isAr ? "mr-auto" : ""}`} />
                <p className="mb-3 text-4xl font-black leading-none text-white">{item.year}</p>
                <p className="max-w-[280px] text-sm leading-relaxed text-white">{item.desc}</p>
              </div>
              {index < items.length - 1 ? (
                <span className={`absolute top-[70px] h-px w-[calc(100%+48px)] from-white/20 to-transparent ${isAr ? "right-3 bg-gradient-to-l" : "left-3 bg-gradient-to-r"}`} />
              ) : null}
            </article>
          ))}
        </div>
      </motion.div>
    </>
  );
}

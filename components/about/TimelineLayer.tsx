"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";

import type { TimelineItem, TimelineSectionCopy } from "@/content/schema/about";

type Props = {
  progress: MotionValue<number>;
  copy: TimelineSectionCopy;
  items: TimelineItem[];
  isAr?: boolean;
};

export default function TimelineLayer({ progress, copy, items, isAr = false }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const x = useTransform(() => {
    const value = progress.get();
    if (value <= 0.05) return 0;
    if (value >= 0.95) return -travel.get();
    return -travel.get() * ((value - 0.05) / 0.9);
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) return;

    const measure = () => {
      travel.set(Math.max(0, track.scrollWidth - viewport.clientWidth + 40));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    measure();

    return () => observer.disconnect();
  }, [items.length, travel]);

  return <section
    ref={viewportRef}
    dir="ltr"
    className="relative h-full w-full overflow-hidden border-y border-white/10 bg-[#080d20]/76 backdrop-blur-sm"
  >
    <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#008ED3_1px,transparent_1px),linear-gradient(90deg,#008ED3_1px,transparent_1px)] [background-size:58px_58px]" />
    <motion.div
      ref={trackRef}
      style={{ x }}
      className="relative z-10 flex h-full min-w-max items-center gap-8 px-5 sm:gap-10 sm:px-8 md:gap-14 md:px-16 lg:px-20"
    >
      <div
        dir={isAr ? "rtl" : "ltr"}
        className={`w-[280px] shrink-0 sm:w-[340px] md:w-[470px] ${isAr ? "text-right" : "text-left"}`}
      >
        {copy.kicker ? <p className="text-xs font-black uppercase text-[#008ED3]">{copy.kicker}</p> : null}
        <h2 className="mt-3 text-5xl font-black uppercase italic leading-none text-white sm:text-6xl md:text-8xl">
          {copy.titleLine1}{copy.titleHighlight ? ` ${copy.titleHighlight}` : ""}
        </h2>
        <span className="mt-5 block h-px w-16 bg-[#008ED3] md:w-20" />
      </div>

      {items.map((item, index) => <article
          key={`${item.year}-${index}`}
          dir={isAr ? "rtl" : "ltr"}
          className={`w-[270px] shrink-0 sm:w-[300px] md:w-[340px] ${isAr ? "text-right" : "text-left"}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#008ED3] shadow-[0_0_12px_rgba(0,142,211,0.9)]" />
            <span className={`h-px flex-1 from-[#008ED3]/55 to-transparent ${isAr ? "bg-gradient-to-l" : "bg-gradient-to-r"}`} />
          </div>
          <p className="text-3xl font-black leading-none text-white md:text-4xl">{item.year}</p>
          <p className="mt-4 text-sm leading-7 text-white">{item.desc}</p>
        </article>)}
    </motion.div>
  </section>;
}

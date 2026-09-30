"use client";

import { MotionValue, motion } from "framer-motion";
import type { TimelineItem, TimelineSectionCopy } from "@/content/schema/about";

type Props = {
  x: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  copy: TimelineSectionCopy;
  items: TimelineItem[];
  isAr?: boolean;
};

export default function TimelineLayer({ x, opacity, scale, copy, items, isAr = false }: Props) {
  return (
    <motion.div 
      style={{ x, opacity, scale }} 
      dir={isAr ? "rtl" : "ltr"}
      className="absolute inset-0 flex items-center z-50 px-10 md:px-20"
    >
      <div className="flex gap-8 md:gap-12 items-start min-w-max">
        {/* Title Block */}
        <div className={`min-w-[200px] md:min-w-[280px] sticky left-0 ${isAr ? 'text-right' : ''}`}>
          <h2 className={`text-white text-5xl md:text-8xl font-black italic tracking-tighter leading-none ${isAr ? '[direction:rtl]' : ''}`}>
            {copy.titleLine1}<br/>
            {copy.titleHighlight && <span className="text-white">{copy.titleHighlight}</span>}
          </h2>
        </div>
        
        {/* Timeline Items */}
        {items.map((item, i) => (
          <div key={i} className={`min-w-[220px] md:min-w-[320px] relative pt-16 ${isAr ? 'text-right' : ''}`}>
            {/* Content */}
            <div className="relative z-10">
              <div className={`w-3 h-3 bg-[#006db1] rounded-full mb-6 shadow-[0_0_10px_#006db1] ${isAr ? 'mr-auto' : ''}`} />
              <div className="text-white font-black text-2xl md:text-4xl mb-3 tracking-tighter">{item.year}</div>
              <p 
                dir={isAr ? "rtl" : "ltr"}
                style={{ unicodeBidi: "plaintext" }}
                className="max-w-[280px] text-xs leading-relaxed text-white md:text-sm"
              >
                {item.desc}
              </p>
            </div>
            
            {/* Connector Line */}
            {i < items.length - 1 && (
              <div className={`absolute top-[70px] ${isAr ? 'right-[12px] bg-gradient-to-l' : 'left-[12px] bg-gradient-to-r'} w-[calc(100%+40px)] h-[1px] from-white/20 to-transparent`} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

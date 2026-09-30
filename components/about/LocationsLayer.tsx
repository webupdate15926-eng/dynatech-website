"use client";

import { MotionValue, motion } from "framer-motion";
import type { LocationItem, LocationsSectionCopy } from "@/content/schema/about";

type Props = {
  opacity: MotionValue<number>;
  copy: LocationsSectionCopy;
  items: LocationItem[];
  isAr?: boolean;
};

export default function LocationsLayer({ opacity, copy, items, isAr = false }: Props) {
  return (
    <motion.div 
      style={{ opacity }} 
      className="absolute inset-0 z-[60] flex flex-col items-center justify-start px-4 pb-6 pt-[150px] sm:px-6 md:pt-[160px] lg:pt-[150px]"
    >
      {/* Section Header */}
      <div className={`mb-8 w-full max-w-5xl md:mb-10 ${isAr ? 'text-right' : 'text-left'}`}>
        <h2 
          dir="auto"
          style={{ unicodeBidi: "plaintext" }}
          className="text-4xl font-black italic tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {copy.titleLine1} <span className="text-[#008ED3]">{copy.titleHighlight}</span>
        </h2>
      </div>
      
      {/* Location Cards Grid */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
        {items.map((loc) => (
          <div 
            key={loc.name}
            className="group bg-[#121b43] p-6 transition-all duration-500 hover:bg-[#0f1738] sm:p-8 md:p-9 lg:p-10"
          >
            {/* Location Name */}
            <h3 
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              className="mb-3 text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#008ED3] md:text-2xl"
            >
              {loc.name}
            </h3>
            
            {/* Divider */}
            <div className={`h-[1px] w-12 bg-white/20 mb-4 ${isAr ? 'mr-auto' : ''}`} />
            
            {/* Location Detail */}
            <p 
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              className="font-mono text-sm leading-relaxed text-white"
            >
              {loc.detail}
            </p>
            {loc.status && (
              <p
                dir="auto"
                style={{ unicodeBidi: "plaintext" }}
                className="mt-3 text-[#008ED3] text-xs font-bold uppercase tracking-wider"
              >
                {loc.status}
              </p>
            )}
          </div>
        ))}
      </div>

    </motion.div>
  );
}

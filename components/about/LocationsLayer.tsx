"use client";

import type { LocationItem, LocationsSectionCopy } from "@/content/schema/about";

type Props = {
  copy: LocationsSectionCopy;
  items: LocationItem[];
  isAr?: boolean;
};

export default function LocationsLayer({ copy, items, isAr = false }: Props) {
  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-10 bg-[#0a0f29]/56 px-5 py-16 backdrop-blur-sm sm:px-6 md:px-12 md:py-24 lg:px-20"
    >
      <div className={`mx-auto mb-10 w-full max-w-7xl ${isAr ? 'text-right' : 'text-left'}`}>
        {copy.kicker ? <p className="text-xs font-black uppercase text-[#008ED3]">{copy.kicker}</p> : null}
        <h2 
          dir="auto"
          style={{ unicodeBidi: "plaintext" }}
          className="mt-3 text-4xl font-black uppercase leading-none text-white sm:text-5xl md:text-6xl"
        >
          {copy.titleLine1} <span className="text-[#008ED3]">{copy.titleHighlight}</span>
        </h2>
        <span className="mt-5 block h-px w-16 bg-[#008ED3]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
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

    </section>
  );
}

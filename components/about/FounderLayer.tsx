"use client";

import { MotionValue, motion } from "framer-motion";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import type { DynatechContent } from "@/content/schema/about";

type Props = {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  y: MotionValue<number>;
  data: DynatechContent["founder"];
  isAr?: boolean;
};

export default function FounderLayer({
  opacity,
  scale,
  y,
  data,
  isAr = false,
}: Props) {
  return (
    <motion.div 
      style={{ opacity, scale, y }} 
      className="absolute inset-0 z-40 flex items-center justify-center px-6 pb-8 pt-24"
    >
      <div className={`max-w-6xl w-full grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 items-center ${isAr ? 'md:[direction:rtl]' : ''}`}>
        {/* Image - Order changes for RTL */}
        <div className={`relative h-[260px] w-full overflow-hidden md:h-[min(560px,calc(100vh-10rem))] ${isAr ? 'order-1 md:order-2' : 'order-2 md:order-1'}`}>
          <Image
            src={data.imageSrc}
            alt={data.imageAlt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>
        
        {/* Content - Order changes for RTL */}
        <div className={`space-y-5 md:space-y-6 ${isAr ? 'order-2 md:order-1 md:text-right' : 'order-1 md:order-2'}`}>
          <h2 
            dir="auto"
            style={{ unicodeBidi: "plaintext" }}
            className="whitespace-nowrap text-[clamp(2rem,3.2vw,3.75rem)] font-black uppercase leading-none text-white"
          >
            {data.name}
          </h2>

          <p
            dir="auto"
            style={{ unicodeBidi: "plaintext" }}
            className={`text-white text-sm md:text-base leading-relaxed max-w-2xl ${isAr ? 'md:mr-auto' : ''}`}
          >
            {data.description}
          </p>

          {data.linkedinUrl && (
            <a
              href={data.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 border border-[#008ED3] bg-[#008ED3] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:brightness-110 ${isAr ? 'md:flex-row-reverse' : ''}`}
            >
              <FaLinkedin size={16} aria-hidden="true" />
              <span>{/^(learn more|اعرف المزيد)$/i.test(data.linkedinLabel?.trim() ?? '') ? 'LinkedIn' : data.linkedinLabel || 'LinkedIn'}</span>
            </a>
          )}
          
        </div>
      </div>
    </motion.div>
  );
}

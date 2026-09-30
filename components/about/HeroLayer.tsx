"use client";

import { MotionValue, motion } from "framer-motion";

type Props = {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  titleLeft: string;
  titleRight: string;
  tagline: string;
};

export default function HeroLayer({
  opacity,
  scale,
  titleLeft,
  titleRight,
  tagline,
}: Props) {
  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
    >
      <h1 className="text-[12vw] font-black italic tracking-tighter text-white uppercase">
        {titleLeft} <span className="text-[#008ED3]">{titleRight}</span>
      </h1>
      <p className="text-[#008ED3] font-mono tracking-[1em] text-xs">
        {tagline}
      </p>
    </motion.div>
  );
}

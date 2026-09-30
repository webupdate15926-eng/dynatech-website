"use client";

import { MotionValue, motion } from "framer-motion";
import type { LegacyStoryContent } from "@/content/schema/about";

type Props = {
  opacity: MotionValue<number>;
  data: LegacyStoryContent;
  isAr?: boolean;
};

export default function StoryVisionLayer({ opacity, data, isAr = false }: Props) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 z-30 flex items-start justify-center px-4 pb-6 pt-[140px] sm:pt-[150px] md:px-6 md:pt-[155px] lg:pt-[150px]"
    >
      <div className={`grid w-full max-w-6xl items-start gap-6 md:gap-8 lg:grid-cols-[1.1fr_0.9fr] ${isAr ? 'lg:[direction:rtl]' : ''}`}>
        <div className={`border-l-4 border-[#008ED3] bg-white/5 p-5 backdrop-blur-sm md:p-7 ${isAr ? 'border-l-0 border-r-4 text-right' : ''}`}>
          <h2
            dir="auto"
            style={{ unicodeBidi: "plaintext" }}
            className="mb-4 text-3xl font-black uppercase leading-[1.05] tracking-tight text-white md:text-4xl xl:text-5xl"
          >
            {data.storyTitle}
          </h2>
          <p
            dir="auto"
            style={{ unicodeBidi: "plaintext" }}
            className="mb-5 text-base font-semibold text-[#008ED3] md:text-lg"
          >
            {data.storySubtitle}
          </p>
          <div className="space-y-3.5">
            {data.storyParagraphs.map((paragraph, index) => (
              <p
                key={index}
                dir="auto"
                style={{ unicodeBidi: "plaintext" }}
                className="text-sm leading-relaxed text-white md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-px bg-white/10 border border-white/10">
          <div className="bg-[#121b43] p-5 md:p-6">
            <h3
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              className="mb-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl"
            >
              {data.visionTitle}
            </h3>
            <p
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              className="text-sm leading-relaxed text-white md:text-base"
            >
              {data.visionText}
            </p>
          </div>
          <div className="bg-[#121b43] p-5 md:p-6">
            <h3
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              className="mb-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl"
            >
              {data.missionTitle}
            </h3>
            <p
              dir="auto"
              style={{ unicodeBidi: "plaintext" }}
              className="text-sm leading-relaxed text-white md:text-base"
            >
              {data.missionText}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

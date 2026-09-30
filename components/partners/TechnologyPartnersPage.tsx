"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CmsMediaMap } from "@/lib/cms/types";
import type { TechnologyPartnersContent } from "@/content/schema/site";

type Props = {
  content: TechnologyPartnersContent;
  locale: string;
  media: CmsMediaMap;
};

function PartnerLogo({ id, name, src }: { id: string; name: string; src: string }) {
  if (!src) return <span className="text-center text-lg font-black text-[#111936]">{name}</span>;
  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={id === "fft" ? 952 : 959}
      height={id === "fft" ? 376 : 729}
      className={id === "fft" ? "h-14 w-auto" : "h-[5.25rem] w-auto object-contain"}
    />
  );
}

function SectionKicker({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "blue";
}) {
  const color = tone === "cyan" ? "text-[#008ED3]" : "text-[#008ED3]";

  return (
    <div className="mb-5 inline-flex flex-col gap-3">
      <p className={`text-xs font-black uppercase tracking-[0.32em] ${color}`}>
        {children}
      </p>
      <span className="h-px w-16 bg-[#008ED3]" />
    </div>
  );
}

export default function TechnologyPartnersPage({ content, locale, media }: Props) {
  const isAr = locale === "ar";
  const heroTitleLines = content.hero.title.split(". ").map((line, index, lines) =>
    index < lines.length - 1 ? `${line}.` : line
  );
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
  const revealTransition = { duration: 0.75, ease: "easeOut" as const };

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-screen bg-[#080d20] text-white"
    >
      <section className="relative flex min-h-[760px] items-center overflow-hidden px-5 pb-16 pt-32 sm:px-6 md:min-h-screen md:px-12 md:pb-20 md:pt-36 lg:px-20">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={String(media.backgroundVideo)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[#080d20]/72" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,32,0.76),rgba(8,13,32,0.52))]" />

        <div dir="ltr" className="relative z-10 mx-auto grid w-full max-w-7xl gap-7 md:grid-cols-[1.2fr_0.8fr] md:grid-rows-[auto_auto] md:items-start md:gap-x-10 md:gap-y-7 lg:gap-x-12">
          <motion.div
            initial={false}
            animate="show"
            variants={reveal}
            transition={revealTransition}
            dir={isAr ? "rtl" : "ltr"}
            className="self-center md:pr-4"
          >
            {content.hero.kicker ? <SectionKicker>{content.hero.kicker}</SectionKicker> : null}
            <h1 className="text-[2.45rem] font-black uppercase leading-[1.04] tracking-normal sm:text-5xl md:text-[clamp(2rem,3.2vw,3.5rem)]">
              {heroTitleLines.map((line, index) => (
                <span key={line} className={`block ${index > 0 ? "mt-3 text-[#008ED3]" : "text-white"}`}>
                  {line}
                </span>
              ))}
            </h1>
          </motion.div>

          <motion.div
            initial={false}
            animate="show"
            variants={reveal}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.12 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-white/15 bg-[#080d20] md:justify-self-end"
          >
            <Image
              src={String(media.fftSigningImage)}
              alt={isAr ? "توقيع اتفاقية الشراكة مع FFT" : "FFT partnership agreement signing"}
              fill
              priority
              sizes="(min-width: 768px) 36vw, 100vw"
              className="object-cover object-top"
            />
          </motion.div>

          <motion.div
            initial={false}
            animate="show"
            variants={reveal}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.18 }}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-white/15 bg-[#080d20]"
          >
            <Image
              src={String(media.cuSigningImage)}
              alt={isAr ? "توقيع اتفاقية الشراكة مع CU" : "CU partnership agreement signing"}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>

          <motion.div
            initial={false}
            animate="show"
            variants={reveal}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.24 }}
            dir={isAr ? "rtl" : "ltr"}
            className="self-center py-2 md:px-1"
          >
            <p className="text-sm font-semibold leading-relaxed text-white md:text-base">
              {content.hero.intro}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-[#008ED3] md:text-base">
              {content.hero.supporting}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#080d20] px-5 py-16 sm:px-6 md:px-12 md:py-20 lg:px-20">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {content.technologyPartners.partners.map((partner, index) => {
              const logoId = partner.id;
              const href = partner.href || (logoId === "cu" ? `/${locale}/technology-partners/composites-united` : `/${locale}/technology-partners/${logoId}`);
              const logo = partner.logo || (logoId === "fft" ? String(media.fftLogo) : logoId === "cu" ? String(media.cuLogo) : "");
              const background = partner.image || (logoId === "fft" ? String(media.fftCardImage) : logoId === "cu" ? String(media.cuLogo) : "");

              return (
                <motion.div
                  key={partner.id}
                  className="h-full"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.22 }}
                  variants={reveal}
                  transition={{ ...revealTransition, delay: reduceMotion ? 0 : index * 0.08 }}
                >
                  <Link
                    href={href}
                    className="group relative block h-full min-h-[500px] overflow-hidden border border-white/10 bg-[#111936] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#008ED3]/55 sm:p-7 md:p-9"
                  >
                    {background && logoId !== "cu" ? (
                      <Image
                        src={background}
                        alt={`${partner.name} partnership background`}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-contain object-center transition duration-700 group-hover:scale-[1.02]"
                      />
                    ) : logoId === "cu" ? (
                      <div className="absolute inset-0 bg-[#111936] [background-image:linear-gradient(#008ED312_1px,transparent_1px),linear-gradient(90deg,#008ED312_1px,transparent_1px)] [background-size:48px_48px]">
                        <Image
                          src={background}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-contain object-center p-16 opacity-30 sm:p-20"
                        />
                      </div>
                    ) : null}
                    <div className={`absolute inset-0 ${logoId === "cu" ? "bg-[linear-gradient(180deg,rgba(8,13,32,0.18),rgba(8,13,32,0.96))]" : "bg-[linear-gradient(180deg,rgba(8,13,32,0.24),rgba(8,13,32,0.9))]"}`} />
                    <div className="relative z-10 grid h-full grid-rows-[auto_auto_1fr_auto] sm:grid-rows-[7rem_4.5rem_1fr_auto]">
                      <div className="flex justify-center">
                        <div className="relative z-20 flex h-24 w-36 shrink-0 items-center justify-center bg-white px-4 py-3 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
                          <PartnerLogo id={logoId} name={partner.name} src={logo} />
                        </div>
                      </div>

                      <p className="mt-7 self-start text-xl font-black leading-snug text-white sm:mt-0 sm:self-center">
                        {partner.heading}
                      </p>
                      <p className="line-clamp-4 self-start pt-4 text-sm leading-relaxed text-white md:text-base">
                        {partner.paragraphs.join(" ")}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/10 pt-7">
                        <span className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                          {partner.ctaLabel}
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center bg-[#008ED3] text-white transition duration-300 group-hover:brightness-110">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

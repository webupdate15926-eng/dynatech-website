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
  const color = tone === "cyan" ? "text-[#43becc]" : "text-[#0087cb]";

  return (
    <div className="mb-5 inline-flex flex-col gap-3">
      <p className={`text-xs font-black uppercase tracking-[0.32em] ${color}`}>
        {children}
      </p>
      <span className="h-px w-16 bg-[#0087cb]" />
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
      <section className="relative flex min-h-[760px] items-center overflow-hidden px-5 pb-14 pt-32 sm:px-6 md:min-h-screen md:px-12 md:pb-16 md:pt-36 lg:px-20">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={String(media.backgroundVideo)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[#080d20]/12" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,13,32,0.48)_0%,rgba(8,13,32,0.12)_48%,rgba(8,13,32,0.02)_100%)]" />

        <div dir="ltr" className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.8fr)] lg:items-center lg:gap-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={reveal}
            transition={revealTransition}
            dir={isAr ? "rtl" : "ltr"}
            className="max-w-4xl"
          >
            {content.hero.kicker ? <SectionKicker>{content.hero.kicker}</SectionKicker> : null}
            <h1 className="text-[2.75rem] font-black uppercase leading-[0.94] tracking-normal sm:text-6xl md:text-7xl lg:text-[clamp(1.9rem,2.4vw,3rem)]">
              {heroTitleLines.map((line) => (
                <span key={line} className="block lg:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>
            <div className="mt-7 max-w-3xl border-s-2 border-[#43becc] bg-[#080d20]/64 p-5 backdrop-blur-sm md:p-6">
              <p className="text-base font-semibold leading-relaxed text-white md:text-lg">
                {content.hero.intro}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-200 md:text-base">
                {content.hero.supporting}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={reveal}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.12 }}
            className="grid w-full grid-cols-2 gap-3 lg:grid-cols-1 lg:justify-self-end"
          >
            <div className="relative aspect-[16/9] overflow-hidden border border-white/20 bg-[#080d20]">
              <Image
                src={String(media.fftSigningImage)}
                alt=""
                fill
                aria-hidden="true"
                sizes="(min-width: 1024px) 40vw, 50vw"
                className="scale-110 object-cover object-center opacity-35 blur-sm"
              />
              <div className="absolute inset-0 bg-[#080d20]/35" />
              <Image
                src={String(media.fftSigningImage)}
                alt={isAr ? "توقيع اتفاقية الشراكة مع FFT" : "FFT partnership agreement signing"}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 50vw"
                className="scale-[1.35] object-contain object-center"
              />
            </div>
            <div className="relative aspect-[16/9] overflow-hidden border border-white/20 bg-[#080d20]">
              <Image
                src={String(media.cuSigningImage)}
                alt={isAr ? "توقيع اتفاقية الشراكة مع CU" : "CU partnership agreement signing"}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 50vw"
                className="object-cover object-center"
              />
            </div>
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
                    className="group relative block h-full min-h-[500px] overflow-hidden border border-white/10 bg-[#111936] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#43becc]/55 sm:p-7 md:p-9"
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
                      <div className="absolute inset-0 bg-[#111936] [background-image:linear-gradient(#43becc12_1px,transparent_1px),linear-gradient(90deg,#43becc12_1px,transparent_1px)] [background-size:48px_48px]">
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
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                        <h3 className="text-3xl font-black uppercase leading-none tracking-tight md:text-5xl">
                          {partner.name}
                        </h3>
                        <div className="relative z-20 flex h-24 w-36 shrink-0 items-center justify-center border border-white/20 bg-white px-4 py-3 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
                          <PartnerLogo id={logoId} name={partner.name} src={logo} />
                        </div>
                      </div>

                      <p className="mt-7 self-start text-xl font-black leading-snug text-white/90 sm:mt-0 sm:self-center">
                        {partner.heading}
                      </p>
                      <p className="line-clamp-4 self-start pt-4 text-sm leading-relaxed text-zinc-400 md:text-base">
                        {partner.paragraphs.join(" ")}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/10 pt-7">
                        <span className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                          {partner.ctaLabel}
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center bg-[#0087cb] text-black transition duration-300 group-hover:bg-white">
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

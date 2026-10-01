"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ExpandableCollection } from "@/components/ExpandableCollection";
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
  const titleEndsWithPeriod = content.hero.title.trim().endsWith(".");
  const heroTitleLines = content.hero.title
    .split(/\.\s*/)
    .filter(Boolean)
    .map((line, index, lines) => index === lines.length - 1 && titleEndsWithPeriod ? `${line}.` : line);
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
      <section className="relative overflow-hidden border-b border-[#008ED3] bg-[#080d20] px-5 pb-14 pt-28 sm:px-7 md:px-12 md:pb-20 md:pt-40 lg:px-16 lg:pb-24 lg:pt-44">
        <video className="absolute inset-0 h-full w-full object-cover opacity-15" src={String(media.backgroundVideo)} autoPlay muted loop playsInline preload="auto" />
        <div className="absolute inset-0 bg-[#080d20]/94" />

        <div dir="ltr" className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-9 md:grid-cols-[1.52fr_1fr] md:items-start md:gap-x-10 lg:gap-x-12">
          <div className="contents md:flex md:min-w-0 md:flex-col">
            <motion.div initial={false} animate="show" variants={reveal} transition={revealTransition} dir={isAr ? "rtl" : "ltr"} className="order-1 md:order-none">
              {content.hero.kicker ? <SectionKicker>{content.hero.kicker}</SectionKicker> : null}
              <h1 className="max-w-[650px] text-[2rem] font-black uppercase leading-[1.08] tracking-normal sm:text-[2.5rem] md:text-[clamp(2rem,3.15vw,3rem)]">
                {heroTitleLines.map((line, index) => (
                  <span key={line} className={`block ${index > 0 ? "mt-5 text-[#008ED3]" : "text-white"}`}>{line}</span>
                ))}
              </h1>
            </motion.div>

            <motion.div initial={false} animate="show" variants={reveal} transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.18 }} className="relative order-3 aspect-[3/2] w-full overflow-hidden rounded-[10px] border border-[#008ED3] bg-[#080d20] md:order-none md:mt-[4.75rem]">
              <Image src={String(media.cuSigningImage)} alt={isAr ? "توقيع اتفاقية الشراكة مع CU" : "CU partnership agreement signing"} fill priority sizes="(min-width: 1280px) 670px, (min-width: 768px) 58vw, 100vw" className="object-cover object-center" />
            </motion.div>
          </div>

          <div className="contents md:flex md:min-w-0 md:flex-col">
            <motion.div initial={false} animate="show" variants={reveal} transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.12 }} className="relative order-2 aspect-[192/209] w-full overflow-hidden rounded-[10px] border border-[#008ED3] bg-[#080d20] md:order-none">
              <Image src={String(media.fftSigningImage)} alt={isAr ? "توقيع اتفاقية الشراكة مع FFT" : "FFT partnership agreement signing"} fill priority sizes="(min-width: 1280px) 430px, (min-width: 768px) 36vw, 100vw" className="object-cover object-top" />
            </motion.div>

            <motion.div
              initial={false}
              animate="show"
              variants={reveal}
              transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.24 }}
              dir={isAr ? "rtl" : "ltr"}
              className={`order-4 pt-1 md:order-none md:mt-7 ${isAr ? "border-r-2 border-[#008ED3] pr-3" : "border-l-2 border-[#008ED3] pl-3"}`}
            >
              <p className="text-[11px] font-medium leading-[1.65] text-white sm:text-xs md:text-[12px]">{content.hero.intro}</p>
              <p className="mt-4 border-t border-[#008ED3]/35 pt-4 text-[11px] leading-[1.55] text-[#008ED3] sm:text-xs md:text-[12px]">{content.hero.supporting}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#080d20] px-5 py-16 sm:px-6 md:px-12 md:py-20 lg:px-20">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="relative mx-auto max-w-7xl">
          <ExpandableCollection className="grid gap-5 lg:grid-cols-2" locale={locale}>
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
                      <p className="self-start pt-4 text-sm leading-relaxed text-white md:text-base">
                        {partner.paragraphs.join(" ")}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/10 pt-7">
                        <span className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                          {partner.ctaLabel}
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center bg-[#008ED3] text-white transition duration-300 group-hover:brightness-110">
                          <ArrowUpRight size={18} className={isAr ? "-rotate-90" : ""} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </ExpandableCollection>
        </div>
      </section>
    </main>
  );
}

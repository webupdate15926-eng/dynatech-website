import type { Locale } from "@/i18n/config";
import Image from "next/image";
import type { ContactContent, GlobalCmsContent } from "@/content/schema/site";
import { getPageDocument } from "@/lib/cms/page-document";

function SectionKicker({
  children,
  tone = "blue",
  className = "mb-4",
}: {
  children: React.ReactNode;
  tone?: "blue" | "cyan";
  className?: string;
}) {
  const textColor = tone === "cyan" ? "text-[#43becc]" : "text-[#0087cb]";
  const lineColor = tone === "cyan" ? "bg-[#43becc]" : "bg-[#0087cb]";

  return (
    <div className={`inline-flex flex-col gap-3 ${className}`}>
      <p className={`text-xs font-black uppercase tracking-[0.3em] ${textColor}`}>
        {children}
      </p>
      <span className={`h-px w-16 ${lineColor}`} />
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  const [document, globalDocument] = await Promise.all([
    getPageDocument<ContactContent>("contact", locale),
    getPageDocument<GlobalCmsContent>("global", locale),
  ]);
  const contactDetails = globalDocument.content.contact;
  const content = document.content;
  const isAr = locale === "ar";

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-screen bg-[#0a0f29] pt-32 text-white selection:bg-[#0087cb] selection:text-black"
    >
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-16 pt-8 sm:px-6 md:px-12 lg:px-20">
        <Image
          src={String(document.media.backgroundImage)}
          alt={isAr ? "مبنى ذا بوديوم في كايرو فيستيفال سيتي" : "The Podium office building at Cairo Festival City"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#080d20]/12" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,13,32,0.58)_0%,rgba(8,13,32,0.12)_58%,rgba(8,13,32,0.02)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#43becc] to-transparent" />
        <div className="pointer-events-none absolute -right-8 top-10 text-[15vw] font-black uppercase leading-none tracking-tight text-white/[0.025]">
          {isAr ? "تواصل" : "Contact"}
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionKicker tone="cyan" className="mb-5">
              {content.hero.kicker}
            </SectionKicker>
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.94] tracking-tight md:text-7xl lg:text-8xl">
              {content.hero.title}
            </h1>
          </div>

          <div className="border border-white/12 bg-[#121b43]/65 p-5 backdrop-blur-md md:p-8">
            <p className="text-lg font-semibold leading-relaxed text-white md:text-xl">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 md:px-12 md:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-20">
        <aside className="space-y-8">
          <div>
            <SectionKicker>{content.conversation.title}</SectionKicker>
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              {content.conversation.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#121b43] p-6">
            <SectionKicker tone="cyan" className="mb-3">
              {globalDocument.content.labels.email}
            </SectionKicker>
            <a
              href={`mailto:${contactDetails.email}`}
              className="mt-3 block text-2xl font-black tracking-tight text-white transition hover:text-[#43becc]"
            >
              {contactDetails.email}
            </a>
          </div>

          <div className="border border-white/10 bg-[#121b43] p-6">
            <SectionKicker tone="cyan" className="mb-3">
              {content.form.categoriesTitle}
            </SectionKicker>
            <div className="mt-5 flex flex-wrap gap-2">
              {content.form.categories.map((category) => (
                <span
                  key={category}
                  className="border border-[#0087cb]/30 bg-[#0087cb]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#43becc]"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <form
          action={`mailto:${content.form.recipientEmail || contactDetails.email}`}
          method="post"
          encType="text/plain"
          className="grid gap-4 border border-white/10 bg-[#121b43]/80 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:p-8"
        >
          <h2 className="mb-2 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            {content.form.title}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="fullName"
              required
              placeholder={content.form.fields.fullName}
              className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-[#43becc]"
            />
            <input
              name="company"
              placeholder={content.form.fields.company}
              className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-[#43becc]"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={content.form.fields.email}
              className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-[#43becc]"
            />
            <input
              name="phone"
              placeholder={content.form.fields.phone}
              className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-[#43becc]"
            />
          </div>

          <select
            name="inquiryType"
            defaultValue=""
            className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#43becc]"
          >
            <option value="" disabled>
              {content.form.fields.inquiryType}
            </option>
            {content.form.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <textarea
            name="message"
            required
            placeholder={content.form.fields.message}
            rows={7}
            className="min-h-40 resize-y border border-white/10 bg-[#0a0f29] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-[#43becc]"
          />

          <button
            type="submit"
            className="mt-2 inline-flex min-h-12 items-center justify-center bg-[#0087cb] px-7 text-xs font-black uppercase tracking-[0.24em] text-black transition hover:bg-white"
          >
            {content.form.submitLabel}
          </button>
        </form>
      </section>
    </main>
  );
}

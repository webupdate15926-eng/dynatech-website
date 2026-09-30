"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

type ContactFormProps = {
  locale: "en" | "ar";
  title: string;
  categories: string[];
  submitLabel: string;
  fields: {
    fullName: string;
    company: string;
    email: string;
    phone: string;
    inquiryType: string;
    message: string;
  };
};

export function ContactForm({ locale, title, categories, submitLabel, fields }: ContactFormProps) {
  const isAr = locale === "ar";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to send message");

      form.reset();
      setStatus("success");
      setFeedback(isAr ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً." : "Your message was sent successfully. We will contact you soon.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error && error.message
        ? error.message
        : isAr ? "تعذر إرسال الرسالة. حاول مرة أخرى." : "The message could not be sent. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 border border-white/10 bg-[#121b43]/80 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:p-8">
      <h2 className="mb-2 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">{title}</h2>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="fullName" required maxLength={120} autoComplete="name" placeholder={fields.fullName} className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-white focus:border-[#008ED3]" />
        <input name="company" maxLength={160} autoComplete="organization" placeholder={fields.company} className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-white focus:border-[#008ED3]" />
        <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder={fields.email} className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-white focus:border-[#008ED3]" />
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder={fields.phone} className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-white focus:border-[#008ED3]" />
      </div>

      <select name="inquiryType" required defaultValue="" className="min-h-12 border border-white/10 bg-[#0a0f29] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#008ED3]">
        <option value="" disabled>{fields.inquiryType}</option>
        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>

      <textarea name="message" required minLength={10} maxLength={5000} placeholder={fields.message} rows={7} className="min-h-40 resize-y border border-white/10 bg-[#0a0f29] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white focus:border-[#008ED3]" />

      <button type="submit" disabled={status === "sending"} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 bg-[#008ED3] px-7 text-xs font-black uppercase text-black transition hover:bg-white disabled:cursor-wait disabled:opacity-60">
        {status === "sending" ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}
        {status === "sending" ? (isAr ? "جارٍ الإرسال..." : "Sending...") : submitLabel}
      </button>

      {feedback ? (
        <p role="status" aria-live="polite" className={`text-sm font-bold ${status === "success" ? "text-[#008ED3]" : "text-red-300"}`}>{feedback}</p>
      ) : null}
    </form>
  );
}

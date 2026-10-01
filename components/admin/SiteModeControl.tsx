"use client";

import { Check, ExternalLink, Globe2, LoaderCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";

type SiteMode = "website" | "landing";

export function SiteModeControl({ token, locale }: { token: string; locale: Locale }) {
  const isAr = locale === "ar";
  const [mode, setMode] = useState<SiteMode | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMode = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/cms/site-mode", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not read website mode.");
      setMode(result.mode === "landing" ? "landing" : "website");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read website mode.");
    }
  }, [token]);

  useEffect(() => { void loadMode(); }, [loadMode]);

  const chooseMode = async (nextMode: SiteMode) => {
    if (!mode || nextMode === mode) return;
    const message = nextMode === "landing"
      ? (isAr ? "سيشاهد الزوار صفحة Coming Soon بدل الموقع الكامل. هل تريد المتابعة؟" : "Visitors will see the Coming Soon page instead of the full website. Continue?")
      : (isAr ? "سيعود الموقع الكامل للظهور أمام الزوار. هل تريد المتابعة؟" : "The full website will be visible to visitors again. Continue?");
    if (!window.confirm(message)) return;

    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/cms/site-mode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mode: nextMode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not change website mode.");
      setMode(result.mode);
      setNotice(isAr ? "تم تغيير واجهة الموقع بنجاح." : "Website display changed successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not change website mode.");
    } finally {
      setSaving(false);
    }
  };

  if (!mode) return <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">{error ? <><p className="text-sm text-red-300">{error}</p><button type="button" onClick={() => void loadMode()} className="admin-button">{isAr ? "إعادة المحاولة" : "Try again"}</button></> : <LoaderCircle className="animate-spin text-[#008ED3]" />}</div>;

  const options: { id: SiteMode; icon: typeof Globe2; title: string; description: string }[] = [
    { id: "website", icon: Globe2, title: isAr ? "الموقع الكامل" : "Full website", description: isAr ? "عرض كل صفحات ومحتوى موقع DYNATECH للزوار." : "Show all DYNATECH pages and published content to visitors." },
    { id: "landing", icon: Rocket, title: isAr ? "صفحة Coming Soon" : "Coming Soon page", description: isAr ? "عرض صفحة الإطلاق المختصرة بدل صفحات الموقع." : "Show the focused launch page instead of the full website." },
  ];

  return <section className="rounded-md border border-white/10 bg-[var(--admin-panel)] p-5 md:p-7">
    <div className="border-b border-white/10 pb-5">
      <p className="text-xs font-bold uppercase text-[#008ED3]">{isAr ? "واجهة الموقع" : "WEBSITE DISPLAY"}</p>
      <h3 className="mt-2 text-2xl font-black">{isAr ? "ماذا يشاهد الزوار؟" : "What do visitors see?"}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{isAr ? "اختر الواجهة المطلوبة. التغيير يظهر فورًا، ولوحة التحكم تظل متاحة في الحالتين." : "Choose the public experience. The change is immediate, and the dashboard remains available in both modes."}</p>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {options.map((option) => {
        const active = mode === option.id;
        const Icon = option.icon;
        return <button key={option.id} type="button" disabled={saving} onClick={() => void chooseMode(option.id)} className={`min-h-48 rounded-md border p-5 text-start transition ${active ? "border-[#008ED3] bg-[#008ED3]/10" : "border-white/10 bg-[#0c1017] hover:border-white/30"}`}>
          <div className="flex items-start justify-between gap-4"><span className={`flex h-11 w-11 items-center justify-center rounded-md ${active ? "bg-[#008ED3] text-white" : "bg-white/5 text-white"}`}><Icon size={22} /></span>{active && <span className="flex items-center gap-1 text-xs font-black text-[#008ED3]"><Check size={15} />{isAr ? "مفعل الآن" : "LIVE NOW"}</span>}</div>
          <h4 className="mt-5 text-xl font-black text-white">{option.title}</h4>
          <p className="mt-2 text-sm leading-6 text-white/60">{option.description}</p>
        </button>;
      })}
    </div>

    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
      <div>{saving && <p className="flex items-center gap-2 text-sm text-[#008ED3]"><LoaderCircle size={16} className="animate-spin" />{isAr ? "جاري تطبيق التغيير..." : "Applying change..."}</p>}{notice && <p className="text-sm font-bold text-[#008ED3]">{notice}</p>}{error && <p className="text-sm text-red-300">{error}</p>}</div>
      <Link href={`/${locale}/landing`} target="_blank" className="admin-button"><ExternalLink size={16} />{isAr ? "معاينة Landing Page" : "Preview landing page"}</Link>
    </div>
  </section>;
}

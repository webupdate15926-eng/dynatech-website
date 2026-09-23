"use client";

import { ExternalLink, LoaderCircle, LogOut, Power, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";

type SiteStatus = { enabled: boolean; updatedAt: string | null };

export default function SuperAdminControl({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [status, setStatus] = useState<SiteStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    const response = await fetch("/api/super-admin/site-status", { cache: "no-store" });
    if (response.status === 403) { setAuthenticated(false); setStatus(null); return; }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Could not read site status.");
    setStatus(result);
  };

  useEffect(() => {
    fetch("/api/super-admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (result: { authenticated?: boolean; configured?: boolean }) => {
        setConfigured(result.configured !== false);
        setAuthenticated(result.authenticated === true);
        if (result.authenticated) await loadStatus();
      })
      .catch(() => setError(isAr ? "تعذر التحقق من جلسة الدخول." : "Could not verify the private session."))
      .finally(() => setLoading(false));
  }, [isAr]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/super-admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not sign in.");
      setAuthenticated(true);
      await loadStatus();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not sign in."); }
    finally { setSaving(false); }
  };

  const logout = async () => {
    await fetch("/api/super-admin/session", { method: "DELETE" });
    setAuthenticated(false); setStatus(null); setError("");
  };

  const toggle = async () => {
    if (!status) return;
    const next = !status.enabled;
    const question = next ? (isAr ? "سيتم إيقاف الموقع أمام الزوار فورًا. هل أنت متأكد؟" : "The public website will be taken offline immediately. Continue?") : (isAr ? "سيتم تشغيل الموقع أمام الزوار الآن. هل أنت متأكد؟" : "The public website will become available now. Continue?");
    if (!window.confirm(question)) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/super-admin/site-status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: next }) });
      const result = await response.json();
      if (response.status === 403) { setAuthenticated(false); setStatus(null); throw new Error(isAr ? "انتهت جلسة الدخول. سجل الدخول مرة أخرى." : "Your session expired. Sign in again."); }
      if (!response.ok) throw new Error(result.error ?? "Could not update site status.");
      setStatus(result);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update site status."); }
    finally { setSaving(false); }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#080d20] text-[#43becc]"><LoaderCircle className="animate-spin" /></main>;

  if (!authenticated) return <main dir={isAr ? "rtl" : "ltr"} className="flex min-h-screen items-center justify-center bg-[#080d20] p-5 text-white">
    <form className="w-full max-w-md border border-white/10 bg-[#111936] p-7 shadow-2xl" onSubmit={login}>
      <ShieldCheck className="text-[#43becc]" size={32} />
      <h1 className="mt-5 text-3xl font-black uppercase">{isAr ? "دخول المالك الخاص" : "Private Owner Access"}</h1>
      <p className="mt-2 text-sm leading-6 text-white/55">{isAr ? "بيانات الدخول هنا مستقلة تمامًا عن حسابات لوحة المحتوى." : "These credentials are completely separate from all CMS accounts."}</p>
      <div className="mt-7 space-y-3"><input name="email" type="email" required autoComplete="username" placeholder={isAr ? "البريد الخاص" : "Private email"} className="h-12 w-full border border-white/10 bg-[#080d20] px-4 outline-none focus:border-[#43becc]" /><input name="password" type="password" required autoComplete="current-password" placeholder={isAr ? "كلمة المرور الخاصة" : "Private password"} className="h-12 w-full border border-white/10 bg-[#080d20] px-4 outline-none focus:border-[#43becc]" /></div>
      {!configured && <p className="mt-4 text-sm text-amber-300">{isAr ? "بيانات المالك الخاصة لم تضبط على السيرفر بعد." : "Private owner credentials are not configured on the server yet."}</p>}
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      <button disabled={saving || !configured} className="mt-5 flex h-12 w-full items-center justify-center bg-[#0087cb] text-xs font-black uppercase tracking-widest text-black hover:bg-[#43becc] disabled:opacity-50">{saving ? <LoaderCircle className="animate-spin" size={18} /> : isAr ? "دخول خاص" : "Private sign in"}</button>
    </form>
  </main>;

  return <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#080d20] px-5 py-10 text-white md:px-10"><div className="mx-auto max-w-4xl">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-7"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#43becc]">DYNATECH</p><h1 className="mt-2 text-3xl font-black">{isAr ? "لوحة تحكم المالك" : "Owner Control Panel"}</h1><p className="mt-2 text-sm text-white/45">{isAr ? "دخول مستقل ومخصص لك فقط، خارج حسابات لوحة المحتوى." : "Independent private access, separate from every CMS account."}</p></div><button onClick={logout} title={isAr ? "تسجيل الخروج" : "Sign out"} className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/70 hover:border-white hover:text-white"><LogOut size={18} /></button></header>
    <section className={`mt-10 border p-6 md:p-9 ${status?.enabled ? "border-red-400/35 bg-red-400/[0.07]" : "border-emerald-400/30 bg-emerald-400/[0.06]"}`}><div className="flex flex-wrap items-start justify-between gap-6"><div><div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${status?.enabled ? "bg-red-400" : "bg-emerald-400"}`} /><p className="text-sm font-black uppercase tracking-widest">{status?.enabled ? (isAr ? "الموقع متوقف" : "Website offline") : (isAr ? "الموقع يعمل" : "Website online")}</p></div><h2 className="mt-5 text-3xl font-black">{status?.enabled ? (isAr ? "الزوار يشاهدون صفحة التوقف المؤقت" : "Visitors see the maintenance page") : (isAr ? "الموقع متاح لجميع الزوار" : "The website is available to visitors")}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">{isAr ? "لوحة المحتوى ولوحة المالك ستظلان متاحتين لك حتى أثناء توقف الموقع." : "The CMS and this owner panel remain available while the public website is offline."}</p></div><Power size={38} className={status?.enabled ? "text-red-300" : "text-emerald-300"} /></div><button disabled={saving || !status} onClick={toggle} className={`mt-8 flex min-h-12 items-center justify-center gap-3 px-6 text-sm font-black disabled:opacity-50 ${status?.enabled ? "bg-emerald-400 text-black hover:bg-white" : "bg-red-500 text-white hover:bg-red-400"}`}>{saving ? <LoaderCircle size={18} className="animate-spin" /> : <Power size={18} />}{status?.enabled ? (isAr ? "تشغيل الموقع" : "Bring website online") : (isAr ? "إيقاف الموقع" : "Take website offline")}</button>{error && <p className="mt-4 text-sm text-red-300">{error}</p>}{status?.updatedAt && <p className="mt-5 text-xs text-white/35">{isAr ? "آخر تحديث:" : "Last updated:"} {new Date(status.updatedAt).toLocaleString(isAr ? "ar-EG" : "en-GB")}</p>}</section>
    <div className="mt-6 flex flex-wrap gap-3"><Link href={`/${locale}/admin`} className="inline-flex items-center gap-2 border border-white/15 px-5 py-3 text-sm font-bold hover:border-[#43becc]"><ShieldCheck size={17} />{isAr ? "فتح لوحة المحتوى" : "Open CMS"}</Link><Link href={`/${locale}`} target="_blank" className="inline-flex items-center gap-2 border border-white/15 px-5 py-3 text-sm font-bold hover:border-[#43becc]">{isAr ? "معاينة الموقع" : "View website"}<ExternalLink size={16} /></Link></div>
  </div></main>;
}

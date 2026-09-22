"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import { Check, ChevronLeft, ChevronRight, CircleAlert, CloudUpload, Copy, Eye, FileText, Images, Languages, LayoutDashboard, LoaderCircle, LogOut, Menu, Save, Settings, Type, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import "./admin.css";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { fieldLabel, groupSectionFields, type EditorPath } from "@/components/admin/editor-model";
import { LoginForm } from "@/components/admin/LoginForm";
import { UserManagement } from "@/components/admin/UserManagement";
import type { Locale } from "@/i18n/config";
import { isSafeSupabaseBrowserKey } from "@/lib/cms/browser-key";
import { cmsPagePaths } from "@/lib/cms/config";
import { mergeCmsValues, setAtPath } from "@/lib/cms/document-utils";
import { normalizeCmsDocument } from "@/lib/cms/normalize-document";
import type { CmsMediaMap, CmsPageDefinition, JsonValue } from "@/lib/cms/types";

type EditableDocument = { content: JsonValue; media: CmsMediaMap };
type DefaultResponse = { configured: boolean; pages: CmsPageDefinition[]; document: EditableDocument };
type ViewMode = "content" | "media" | "library" | "users";
type MediaRow = { id: string; public_id: string; resource_type: "image" | "video" | "raw"; secure_url: string; width: number | null; height: number | null; duration: number | null; created_at: string };

const pageHints: Record<string, [string, string]> = {
  global: ["Navigation, footer and shared contact details", "القائمة والفوتر وبيانات التواصل المشتركة"],
  home: ["Main opening page and footer details", "الواجهة الرئيسية وبيانات الفوتر"],
  "about-us": ["Company, CEO message and timeline", "الشركة ورسالة الرئيس التنفيذي والخط الزمني"],
  "technology-partners": ["Partnership overview and partner cards", "نظرة عامة وبطاقات شركاء التكنولوجيا"],
  "partner-fft": ["FFT profile and video library", "صفحة FFT ومكتبة الفيديوهات"],
  "partner-cu": ["Composites United profile and video library", "صفحة Composites United ومكتبة الفيديوهات"],
  "the-auto-hub": ["Project introduction, team, figures and gallery", "مقدمة المشروع والفريق والأرقام والمعرض"],
  "tech-info": ["Technology information and videos", "المعلومات التكنولوجية والفيديوهات"],
  careers: ["Careers page and Why Join Us", "صفحة الوظائف ولماذا تنضم إلينا"],
  contact: ["Contact copy, address and form", "نصوص التواصل والعنوان والنموذج"],
  privacy: ["Privacy policy and website disclaimer", "سياسة الخصوصية وإخلاء المسؤولية"],
};

function assetName(asset: MediaRow) { return asset.public_id.split("/").at(-1) ?? asset.public_id; }

function MediaCard({ asset, action, compact = false }: { asset: MediaRow; action?: ReactNode; compact?: boolean }) {
  return <article className="overflow-hidden rounded-md border border-white/10 bg-[#0c1017]">
    <div className={`relative bg-black ${compact ? "aspect-[4/3]" : "aspect-video"}`}>
      {asset.resource_type === "image" ? <Image src={asset.secure_url} alt={assetName(asset)} fill sizes="(min-width:1280px) 20vw, (min-width:640px) 40vw, 100vw" className="object-contain" /> : asset.resource_type === "video" ? <video src={asset.secure_url} className="h-full w-full object-contain" muted controls={!action} playsInline preload="metadata" /> : <div className="flex h-full items-center justify-center"><FileText className="text-white/25" /></div>}
    </div>
    <div className="flex min-h-12 items-center gap-2 p-3"><p className="min-w-0 flex-1 truncate text-xs text-white/65" title={asset.public_id}>{assetName(asset)}</p>{action}</div>
  </article>;
}

export default function CmsDashboard({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [accountRole, setAccountRole] = useState<"owner" | "editor">("editor");
  const [needsUserMigration, setNeedsUserMigration] = useState(false);
  const [pages, setPages] = useState<CmsPageDefinition[]>([]);
  const [pageKey, setPageKey] = useState("home");
  const [editingLocale, setEditingLocale] = useState<Locale>(locale);
  const [document, setDocument] = useState<EditableDocument | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [activeFieldGroup, setActiveFieldGroup] = useState("");
  const [view, setView] = useState<ViewMode>("content");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pickingPath, setPickingPath] = useState<EditorPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<MediaRow[]>([]);
  const [configured, setConfigured] = useState(true);
  const [connectionError, setConnectionError] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    return url && key && isSafeSupabaseBrowserKey(key) ? createBrowserClient(url, key) : null;
  }, []);
  const dirty = Boolean(document && savedSnapshot && JSON.stringify(document) !== savedSnapshot);
  const currentPage = pages.find((page) => page.key === pageKey);
  const contentObject = document?.content && typeof document.content === "object" && !Array.isArray(document.content) ? document.content : {};
  const sections = Object.entries(contentObject).filter(([, value]) => value !== null);
  const selectedSection = sections.find(([key]) => key === activeSection) ?? sections[0];
  const fieldGroups = selectedSection ? groupSectionFields(selectedSection[1], locale, pageKey, ["content", selectedSection[0]]) : [];
  const selectedFieldGroup = fieldGroups.find((group) => group.id === activeFieldGroup) ?? fieldGroups[0];
  const ui = { content: isAr ? "النصوص" : "Text content", media: isAr ? "الصور والفيديو" : "Images & video", library: isAr ? "مكتبة الوسائط" : "Media library", users: isAr ? "الحسابات" : "Accounts" };

  useEffect(() => {
    if (!supabase) { setConfigured(false); setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setIsAdmin(null); });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) { setIsAdmin(null); return; }
    let active = true;
    setConnectionError("");
    supabase.from("cms_admins").select("*").eq("user_id", session.user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) setConnectionError(error.code === "PGRST205" ? "CMS tables are missing. Run the migration in Supabase SQL Editor." : error.message);
      setIsAdmin(Boolean(data && data.is_active !== false));
      if (data?.role === "owner") setAccountRole("owner");
      setNeedsUserMigration(Boolean(data && !data.role));
    });
    return () => { active = false; };
  }, [session, supabase]);

  const loadDocument = useCallback(async () => {
    if (!supabase || !session || !isAdmin) return;
    setLoading(true); setNotice("");
    try {
      const fallbackResponse = await fetch(`/api/cms/defaults?pageKey=${encodeURIComponent(pageKey)}&locale=${editingLocale}`);
      if (!fallbackResponse.ok) throw new Error("Could not load page defaults.");
      const fallback = (await fallbackResponse.json()) as DefaultResponse;
      setPages(fallback.pages);
      const [draftResult, publishedResult, mediaResult] = await Promise.all([
        supabase.from("cms_drafts").select("document").eq("page_key", pageKey).eq("locale", editingLocale).maybeSingle(),
        supabase.from("cms_pages").select("document").eq("page_key", pageKey).eq("locale", editingLocale).maybeSingle(),
        supabase.from("cms_media").select("id,public_id,resource_type,secure_url,width,height,duration,created_at").order("created_at", { ascending: false }).limit(60),
      ]);
      const queryError = draftResult.error ?? publishedResult.error ?? mediaResult.error;
      if (queryError) throw new Error(queryError.message);
      const savedDocument = (draftResult.data?.document ?? publishedResult.data?.document) as JsonValue | undefined;
      const nextDocument = normalizeCmsDocument(pageKey, mergeCmsValues(fallback.document, savedDocument));
      setDocument(nextDocument); setSavedSnapshot(JSON.stringify(nextDocument)); setMediaLibrary((mediaResult.data ?? []) as MediaRow[]);
    } catch (error) {
      setDocument(null); setNotice(error instanceof Error ? error.message : "Could not load CMS content.");
    } finally { setLoading(false); }
  }, [editingLocale, isAdmin, pageKey, session, supabase]);

  useEffect(() => { void loadDocument(); }, [loadDocument]);
  useEffect(() => { setActiveSection(""); setActiveFieldGroup(""); setView("content"); }, [pageKey, editingLocale]);
  useEffect(() => { setActiveFieldGroup(""); }, [activeSection]);
  useEffect(() => {
    const prevent = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);

  const canLeave = () => !dirty || window.confirm(isAr ? "عندك تعديلات لم يتم حفظها. هل تريد مغادرة الصفحة؟" : "You have unsaved changes. Leave this page?");
  const choosePage = (nextPage: string) => { if (nextPage !== pageKey && canLeave()) { setPageKey(nextPage); setSidebarOpen(false); } };
  const chooseLocale = (nextLocale: Locale) => { if (nextLocale !== editingLocale && canLeave()) setEditingLocale(nextLocale); };
  const changeDocument = (path: EditorPath, value: JsonValue) => { if (document) setDocument(setAtPath(document as unknown as JsonValue, path, value) as EditableDocument); };

  const saveDraft = async () => {
    if (!supabase || !session || !document) return false;
    setSaving(true); setNotice("");
    try {
      const { error } = await supabase.from("cms_drafts").upsert({ page_key: pageKey, locale: editingLocale, document, updated_by: session.user.id }, { onConflict: "page_key,locale" });
      if (error) throw new Error(error.message);
      setSavedSnapshot(JSON.stringify(document)); setNotice(isAr ? "تم حفظ المسودة بنجاح" : "Draft saved successfully"); return true;
    } catch (error) { setNotice(error instanceof Error ? error.message : "Draft save failed"); return false; }
    finally { setSaving(false); }
  };

  const publish = async () => {
    if (!supabase) return;
    const saved = await saveDraft(); if (!saved) return;
    setSaving(true);
    try {
      const { error } = await supabase.rpc("publish_cms_page", { p_page_key: pageKey, p_locale: editingLocale });
      if (error) throw new Error(error.message);
      const response = await fetch("/api/cms/revalidate", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` }, body: JSON.stringify({ pageKey, locale: editingLocale }) });
      if (!response.ok) throw new Error("Content was published, but website refresh failed. Retry publishing.");
      setNotice(isAr ? "تم النشر وظهر المحتوى على الموقع" : "Published and live on the website");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Publishing failed"); }
    finally { setSaving(false); }
  };

  const upload = async (file: File, path: EditorPath) => {
    if (!supabase || !session || !document) return;
    setUploadingPath(path.join(".")); setNotice("");
    try {
      const signatureResponse = await fetch("/api/cloudinary/sign", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signatureData.error ?? "Upload authorization failed");
      const form = new FormData();
      form.set("file", file); form.set("api_key", signatureData.apiKey); form.set("timestamp", String(signatureData.timestamp)); form.set("signature", signatureData.signature); form.set("folder", signatureData.folder);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`, { method: "POST", body: form });
      const asset = await response.json();
      if (!response.ok) throw new Error(asset.error?.message ?? "Cloudinary upload failed");
      changeDocument(path, asset.secure_url);
      const { error: mediaError } = await supabase.from("cms_media").insert({ public_id: asset.public_id, resource_type: asset.resource_type, secure_url: asset.secure_url, format: asset.format, width: asset.width ?? null, height: asset.height ?? null, duration: asset.duration ?? null, bytes: asset.bytes ?? null, uploaded_by: session.user.id });
      if (mediaError) throw new Error(`Uploaded to Cloudinary, but media library save failed: ${mediaError.message}`);
      setMediaLibrary((current) => [{ id: asset.asset_id ?? asset.public_id, public_id: asset.public_id, resource_type: asset.resource_type, secure_url: asset.secure_url, width: asset.width ?? null, height: asset.height ?? null, duration: asset.duration ?? null, created_at: new Date().toISOString() }, ...current]);
      setNotice(isAr ? "تم رفع الملف. احفظ المسودة ثم انشر." : "File uploaded. Save the draft, then publish.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Upload failed"); }
    finally { setUploadingPath(null); }
  };

  if (!configured) return <main className="min-h-screen bg-[#080d20] p-8 text-white"><div className="mx-auto max-w-2xl border border-amber-400/30 bg-amber-400/10 p-6"><h1 className="text-2xl font-black">CMS setup required</h1><p className="mt-3 text-sm leading-7 text-white/70">Set the Supabase URL and a publishable key in <code>.env.local</code>, then restart the server.</p></div></main>;
  if (loading && !session) return <main className="flex min-h-screen items-center justify-center bg-[#080d20] text-[#43becc]"><LoaderCircle className="animate-spin" /></main>;
  if (!supabase || !session) return supabase ? <LoginForm supabase={supabase} locale={locale} /> : null;
  if (isAdmin === null) return <main className="flex min-h-screen items-center justify-center bg-[#080d20] text-[#43becc]"><LoaderCircle className="animate-spin" /></main>;
  if (!isAdmin) return <main className="flex min-h-screen items-center justify-center bg-[#080d20] p-5 text-white"><div className="w-full max-w-lg border border-red-300/25 bg-red-400/10 p-6"><h1 className="text-2xl font-black">{connectionError ? "CMS connection error" : "Administrator access required"}</h1><p className="mt-3 text-sm text-white/60">{connectionError || "This account is signed in but is not listed in cms_admins."}</p><button onClick={() => supabase.auth.signOut()} className="admin-button mt-5">Sign out</button></div></main>;

  const editorProps = { locale, pageKey, onChange: changeDocument, onUpload: upload, onPickMedia: setPickingPath, uploadingPath };
  return <main dir={isAr ? "rtl" : "ltr"} className="admin-ui min-h-screen bg-[var(--admin-bg)] text-white">
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-[#080b11]/95 px-4 backdrop-blur-xl md:px-6">
      <div className="flex min-w-0 items-center gap-3"><button type="button" className="admin-icon lg:hidden" aria-label={isAr ? "فتح الصفحات" : "Open pages"} onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div className="min-w-0"><p className="text-[10px] font-black text-[#43becc]">DYNATECH CMS</p><h1 className="truncate text-base font-extrabold">{isAr ? "إدارة محتوى الموقع" : "Website content manager"}</h1></div></div>
      <div className="flex items-center gap-2"><span className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:flex ${dirty ? "bg-amber-400/10 text-amber-200" : "bg-emerald-400/10 text-emerald-200"}`}>{dirty ? <CircleAlert size={14} /> : <Check size={14} />}{dirty ? (isAr ? "تعديلات غير محفوظة" : "Unsaved changes") : (isAr ? "كل التعديلات محفوظة" : "All changes saved")}</span><Link href={`/${editingLocale}${cmsPagePaths[pageKey] ?? ""}`} target="_blank" className="admin-button"><Eye size={16} /><span className="hidden sm:inline">{isAr ? "معاينة الصفحة" : "Preview page"}</span></Link><button onClick={() => supabase.auth.signOut()} title={isAr ? "تسجيل الخروج" : "Sign out"} className="admin-icon"><LogOut size={16} /></button></div>
    </header>

    <div className="mx-auto grid max-w-[1700px] lg:grid-cols-[250px_minmax(0,1fr)]">
      {sidebarOpen && <button type="button" aria-label="Close" className="fixed inset-0 z-40 bg-black/65 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`${sidebarOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"} fixed inset-y-0 z-50 w-[280px] overflow-y-auto border-e border-white/10 bg-[#0d121a] p-4 transition-transform lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100vh-4rem)] lg:w-auto lg:translate-x-0`}>
        <div className="mb-5 flex items-center justify-between lg:hidden"><strong>{isAr ? "اختر الصفحة" : "Choose a page"}</strong><button type="button" className="admin-icon" onClick={() => setSidebarOpen(false)}><X size={17} /></button></div>
        <p className="mb-3 px-2 text-[11px] font-bold text-white/40">{isAr ? "صفحات الموقع" : "WEBSITE PAGES"}</p>
        <nav className="space-y-1">{pages.map((page) => { const active = pageKey === page.key; return <button key={page.key} onClick={() => choosePage(page.key)} className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-start text-sm font-bold transition ${active ? "bg-[#118fc3] text-white" : "text-white/66 hover:bg-white/5 hover:text-white"}`}><FileText size={16} className="shrink-0" /><span className="min-w-0 flex-1 truncate">{isAr ? page.labelAr : page.label}</span>{isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}</button>; })}</nav>
        <div className="mt-8 border-t border-white/10 pt-5"><div className="flex items-center gap-2 px-2 text-xs text-white/35"><Settings size={14} /><span className="truncate">{session.user.email}</span></div></div>
      </aside>

      <section className="min-w-0 px-4 py-6 md:px-7 md:py-8 xl:px-10"><div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#43becc]"><LayoutDashboard size={15} />{isAr ? "تعديل صفحة" : "Editing page"}</div><h2 className="text-2xl font-black md:text-3xl">{isAr ? currentPage?.labelAr : currentPage?.label}</h2><p className="mt-2 text-sm text-white/48">{pageHints[pageKey]?.[isAr ? 1 : 0] ?? ""}</p></div><div className="flex items-center gap-2 rounded-md border border-white/10 bg-[#10151e] p-1"><Languages size={16} className="mx-2 text-white/45" />{(["en", "ar"] as Locale[]).map((item) => <button key={item} onClick={() => chooseLocale(item)} className={`h-9 rounded px-4 text-xs font-black ${editingLocale === item ? "bg-white text-black" : "text-white/50 hover:text-white"}`}>{item === "ar" ? "العربية" : "English"}</button>)}</div></div>
        <div className="mb-6 flex gap-1 overflow-x-auto border-b border-white/10">{(["content", "media", "library", "users"] as ViewMode[]).map((item) => <button key={item} onClick={() => { if (canLeave()) setView(item); }} className={`flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-bold ${view === item ? "border-[#43becc] text-white" : "border-transparent text-white/45 hover:text-white"}`}>{item === "content" ? <Type size={17} /> : item === "media" ? <CloudUpload size={17} /> : item === "library" ? <Images size={17} /> : <Users size={17} />}{ui[item]}{item === "library" && <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px]">{mediaLibrary.length}</span>}</button>)}</div>

        {view === "users" ? <UserManagement session={session} locale={locale} role={accountRole} needsMigration={needsUserMigration} /> : loading || !document ? <div className="flex min-h-96 items-center justify-center"><LoaderCircle className="animate-spin text-[#43becc]" /></div> : <>
          {view === "content" && <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]"><div><p className="mb-3 text-xs font-bold text-white/40">{isAr ? "أقسام الصفحة" : "PAGE SECTIONS"}</p><div className="grid grid-cols-2 gap-2 md:grid-cols-1">{sections.map(([key]) => <button key={key} type="button" onClick={() => setActiveSection(key)} className={`min-h-11 rounded-md px-3 text-start text-sm font-bold ${selectedSection?.[0] === key ? "bg-white/10 text-[#43becc]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>{fieldLabel(["content", key], locale)}</button>)}</div></div><div className="min-w-0 rounded-md border border-white/10 bg-[var(--admin-panel)] p-5 md:p-7">{selectedSection ? <><div className="mb-5 border-b border-white/10 pb-4"><p className="text-xs font-bold text-[#43becc]">{isAr ? "محتوى القسم" : "SECTION CONTENT"}</p><h3 className="mt-1 text-xl font-black">{fieldLabel(["content", selectedSection[0]], locale)}</h3></div>{fieldGroups.length > 1 && <div className="mb-7"><p className="mb-3 text-xs font-bold text-white/40">{isAr ? "اختر الجزء الذي تريد تعديله" : "CHOOSE WHAT TO EDIT"}</p><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{fieldGroups.map((group) => <button key={group.id} type="button" onClick={() => setActiveFieldGroup(group.id)} className={`min-h-11 rounded-md border px-3 text-start text-sm font-bold transition ${selectedFieldGroup?.id === group.id ? "border-[#43becc] bg-[#43becc]/10 text-[#72dbe6]" : "border-white/10 bg-[#0c1017] text-white/58 hover:border-white/25 hover:text-white"}`}>{group.label}</button>)}</div></div>}{selectedFieldGroup && <div><h4 className="mb-5 text-base font-extrabold text-white/85">{selectedFieldGroup.label}</h4><ContentEditor {...editorProps} value={selectedFieldGroup.value} path={["content", selectedSection[0]]} /></div>}</> : <p className="text-sm text-white/45">{isAr ? "لا توجد أقسام قابلة للتعديل." : "No editable sections found."}</p>}</div></div>}
          {view === "media" && <div className="rounded-md border border-white/10 bg-[var(--admin-panel)] p-5 md:p-7"><div className="mb-6 border-b border-white/10 pb-4"><h3 className="text-xl font-black">{isAr ? "صور وفيديوهات الصفحة" : "Page images and videos"}</h3><p className="mt-2 text-sm leading-6 text-white/48">{isAr ? "اضغط رفع ملف جديد أو اختر ملفًا سبق رفعه من المكتبة." : "Upload a new file or choose an existing one from the media library."}</p></div><div className="space-y-8"><ContentEditor {...editorProps} value={document.media} path={["media"]} mediaOnly /><ContentEditor {...editorProps} value={document.content} path={["content"]} mediaOnly /></div></div>}
          {view === "library" && <div><div className="mb-5"><h3 className="text-xl font-black">{ui.library}</h3><p className="mt-1 text-sm text-white/45">{isAr ? "كل الملفات التي تم رفعها ويمكن إعادة استخدامها." : "All uploaded files, ready to reuse."}</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{mediaLibrary.map((asset) => <MediaCard key={asset.id} asset={asset} action={<button type="button" title={isAr ? "نسخ الرابط" : "Copy URL"} onClick={async () => { await navigator.clipboard.writeText(asset.secure_url); setNotice(isAr ? "تم نسخ رابط الملف" : "Media URL copied"); }} className="admin-icon"><Copy size={14} /></button>} />)}</div></div>}
        </>}

        {view !== "users" && <div className="sticky bottom-3 z-30 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/12 bg-[#111720]/95 p-3 shadow-2xl backdrop-blur-xl"><div className="min-w-0"><p className={`text-xs font-bold ${notice ? "text-[#62d6e2]" : dirty ? "text-amber-200" : "text-white/45"}`}>{notice || (dirty ? (isAr ? "احفظ التعديلات قبل مغادرة الصفحة" : "Save your changes before leaving") : (isAr ? "المحتوى محفوظ" : "Content is saved"))}</p><p className="mt-1 hidden text-[11px] text-white/30 md:block">{isAr ? "المسودة لا تظهر للزوار. النشر يجعل التعديلات ظاهرة على الموقع." : "A draft stays private. Publish makes the changes visible on the website."}</p></div><div className="flex gap-2"><button disabled={saving || !document || !dirty} onClick={saveDraft} className="admin-button">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}{isAr ? "حفظ كمسودة" : "Save draft"}</button><button disabled={saving || !document} onClick={publish} className="admin-button border-[#118fc3] bg-[#118fc3] text-white hover:bg-[#17a8e2]"><Check size={16} />{isAr ? "نشر على الموقع" : "Publish website"}</button></div></div>}
      </div></section>
    </div>

    {pickingPath && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="admin-scrollbar max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-md border border-white/15 bg-[#111720] p-5 shadow-2xl md:p-7"><div className="sticky top-0 z-10 mb-5 flex items-start justify-between gap-4 border-b border-white/10 bg-[#111720] pb-5"><div><h3 className="text-xl font-black">{isAr ? "اختر ملفًا من المكتبة" : "Choose from media library"}</h3><p className="mt-1 text-sm text-white/45">{isAr ? "اضغط على الصورة أو الفيديو لاستخدامه في هذا المكان." : "Select an image or video to use in this field."}</p></div><button type="button" className="admin-icon" onClick={() => setPickingPath(null)}><X size={17} /></button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{mediaLibrary.map((asset) => <button type="button" key={asset.id} className="text-start transition hover:-translate-y-0.5 hover:ring-2 hover:ring-[#43becc]" onClick={() => { changeDocument(pickingPath, asset.secure_url); setPickingPath(null); setNotice(isAr ? "تم اختيار الملف. لا تنسَ حفظ المسودة." : "File selected. Remember to save the draft."); }}><MediaCard asset={asset} compact /></button>)}</div></div></div>}
  </main>;
}

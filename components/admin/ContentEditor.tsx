"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ArrowDown, ArrowUp, CloudUpload, Images, Link2, LoaderCircle, Plus, Trash2 } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { JsonValue } from "@/lib/cms/types";
import { containsMedia, fieldLabel, isHiddenField, isMediaPath, itemTitle, type EditorPath } from "./editor-model";

type Props = {
  value: JsonValue;
  path: EditorPath;
  locale: Locale;
  pageKey: string;
  onChange: (path: EditorPath, value: JsonValue) => void;
  onUpload: (file: File, path: EditorPath) => void;
  onPickMedia: (path: EditorPath) => void;
  uploadingPath: string | null;
  mediaOnly?: boolean;
};

const inputClass = "w-full rounded border border-white/15 bg-[#10151e] px-3 py-2.5 text-sm leading-7 text-white outline-none focus:border-[#43becc] focus:ring-1 focus:ring-[#43becc]";

function newArrayItem(path: EditorPath, previous: JsonValue | undefined, locale: Locale): JsonValue {
  const key = path.join(".");
  if (key === "content.technologyPartners.partners") return { id: `custom-${crypto.randomUUID().slice(0, 8)}`, name: "", heading: "", paragraphs: [""], ctaLabel: locale === "ar" ? "اعرف المزيد" : "Know More", ctaHref: "", href: "", logo: "", image: "" };
  if (key === "content.team") return { category: "", name: "", image: "", imagePosition: "center", biography: "" };
  if (key === "content.figures") return { label: "", value: "", description: "" };
  if (key === "content.videoSection.items") return { title: "", description: "", src: "" };
  if (key === "content.copy.gallery") return { label: "", type: "video", featured: false, src: "" };
  if (previous && typeof previous === "object") return structuredClone(previous);
  return "";
}

export function ContentEditor(props: Props) {
  const { value, path, locale, pageKey, onChange, onUpload, onPickMedia, uploadingPath, mediaOnly = false } = props;
  const id = useId();
  const [showLink, setShowLink] = useState(false);
  const ar = locale === "ar";
  const media = isMediaPath(path);
  const label = fieldLabel(path, locale);
  const child = (item: JsonValue, nextPath: EditorPath) => <ContentEditor {...props} value={item} path={nextPath} />;

  if (Array.isArray(value)) {
    const fixed = path.join(".") === "content.navigation" || (mediaOnly && path[0] === "content");
    const add = () => {
      onChange(path, [...value, newArrayItem(path, value.at(-1), locale)]);
    };
    return <div className="space-y-4">
      {value.map((item, index) => <section key={index} className="border-b border-white/10 pb-5 last:border-b-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="min-w-0 text-sm font-semibold text-white">{typeof item === "object" && item !== null ? itemTitle(item, index, locale) : `${ar ? (media ? "ملف" : "فقرة / سطر") : (media ? "File" : "Paragraph / line")} ${index + 1}`}</h3>
          {!fixed && <div className="flex shrink-0 gap-1">
            <button type="button" title={ar ? "نقل لأعلى" : "Move up"} disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(path, next); }} className="admin-icon"><ArrowUp size={16} /></button>
            <button type="button" title={ar ? "نقل لأسفل" : "Move down"} disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(path, next); }} className="admin-icon"><ArrowDown size={16} /></button>
            <button type="button" title={ar ? "حذف" : "Remove"} onClick={() => onChange(path, value.filter((_, i) => i !== index))} className="admin-icon hover:text-red-300"><Trash2 size={16} /></button>
          </div>}
        </div>
        {typeof item === "string" && !media
          ? <textarea aria-label={`${label} ${index + 1}`} value={item} rows={Math.max(2, Math.min(7, Math.ceil(item.length / 100)))} onChange={(e) => onChange([...path, index], e.target.value)} className={inputClass} />
          : child(item, [...path, index])}
      </section>)}
      {!fixed && <button type="button" onClick={add} className="admin-button"><Plus size={16} />{ar ? (media ? "إضافة ملف" : "إضافة عنصر") : (media ? "Add file" : "Add entry")}</button>}
    </div>;
  }

  if (value && typeof value === "object") {
    return <div className="space-y-6">{Object.entries(value)
      .filter(([key, item]) => {
        const nextPath = [...path, key];
        if (isHiddenField(nextPath, pageKey)) return false;
        if (pageKey === "technology-partners" && key === "ctaHref" && ["fft", "cu"].includes(String(value.id))) return false;
        return mediaOnly ? containsMedia(item, nextPath) : !isMediaPath(nextPath);
      })
      .map(([key, item]) => {
        const nextPath = [...path, key];
        const object = item && typeof item === "object";
        return <div key={key}>
          {object
            ? <details open={path.length < 2} className="admin-group"><summary>{fieldLabel(nextPath, locale)}</summary><div className="pt-5">{child(item, nextPath)}</div></details>
            : <div className="space-y-2"><label className="text-sm font-medium text-white/80">{fieldLabel(nextPath, locale)}</label>{child(item, nextPath)}</div>}
        </div>;
      })}</div>;
  }

  if (typeof value === "boolean") return <label className="inline-flex items-center gap-3 text-sm"><input type="checkbox" checked={value} onChange={(e) => onChange(path, e.target.checked)} />{ar ? "مفعّل" : "Enabled"}</label>;
  if (typeof value === "number") return <input aria-label={label} type="number" value={value} onChange={(e) => onChange(path, Number(e.target.value))} className={inputClass} />;

  const text = value === null ? "" : String(value);
  if (!media) return text.length > 90
    ? <textarea aria-label={label} value={text} rows={Math.min(9, Math.max(3, Math.ceil(text.length / 100)))} onChange={(e) => onChange(path, e.target.value)} className={inputClass} />
    : <input aria-label={label} type={path.at(-1) === "recipientEmail" ? "email" : "text"} dir={path.at(-1) === "recipientEmail" ? "ltr" : undefined} value={text} onChange={(e) => onChange(path, e.target.value)} className={inputClass} />;

  const video = /\.(mp4|webm|mov)(\?|$)/i.test(text) || /video/i.test(String(path.at(-1)));
  const busy = uploadingPath === path.join(".");
  return <div className="space-y-3">
    <div className="relative flex aspect-video max-h-64 w-full items-center justify-center overflow-hidden rounded border border-white/10 bg-[#0c1017]">
      {text ? video
        ? <video key={text} src={text} controls muted playsInline preload="metadata" className="h-full w-full object-contain" />
        : <Image src={text} alt={label} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-contain" />
        : <Images size={32} className="text-white/25" />}
    </div>
    <div className="flex flex-wrap gap-2">
      <label htmlFor={id} className="admin-button cursor-pointer bg-[#0087cb] text-white"><CloudUpload size={16} />{busy ? <LoaderCircle size={16} className="animate-spin" /> : ar ? "رفع ملف جديد" : "Upload new file"}</label>
      <input id={id} type="file" accept="image/*,video/*" className="sr-only" disabled={Boolean(uploadingPath)} onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file, path); e.target.value = ""; }} />
      <button type="button" onClick={() => onPickMedia(path)} className="admin-button"><Images size={16} />{ar ? "اختيار من المكتبة" : "Choose from library"}</button>
      <button type="button" title={ar ? "تعديل الرابط" : "Edit link"} onClick={() => setShowLink(!showLink)} className="admin-icon"><Link2 size={16} /></button>
    </div>
    {showLink && <input aria-label={ar ? "رابط الملف" : "File URL"} dir="ltr" value={text} onChange={(e) => onChange(path, e.target.value)} className={inputClass} />}
  </div>;
}

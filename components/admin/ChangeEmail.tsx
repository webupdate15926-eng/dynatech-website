"use client";

import type { Session } from "@supabase/supabase-js";
import { AtSign, LoaderCircle } from "lucide-react";
import { useState } from "react";

import type { Locale } from "@/i18n/config";

export function ChangeEmail({ session, locale }: { session: Session; locale: Locale }) {
  const isAr = locale === "ar";
  const [email, setEmail] = useState(session.user.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  return <section className="rounded-md border border-white/10 bg-[var(--admin-panel)] p-5 md:p-7">
    <div className="mb-2 flex items-center gap-2"><AtSign size={18} className="text-[#008ED3]" /><h3 className="text-lg font-extrabold">{isAr ? "تغيير بريد حسابك" : "Change your email"}</h3></div>
    <p className="mb-5 text-sm text-white/55">{isAr ? "استخدم كلمة مرورك الحالية لتأكيد التغيير." : "Use your current password to confirm the change."}</p>
    {error && <p role="alert" className="mb-4 text-sm text-red-200">{error}</p>}
    {done && <p role="status" className="mb-4 text-sm text-emerald-200">{isAr ? "تم تغيير البريد. استخدم البريد الجديد في تسجيل الدخول القادم." : "Email changed. Use the new email next time you sign in."}</p>}
    <form className="grid max-w-xl gap-4" onSubmit={async (event) => {
      event.preventDefault(); setBusy(true); setError(""); setDone(false);
      try {
        const response = await fetch("/api/cms/users/email", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, currentPassword }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Email change failed.");
        setCurrentPassword(""); setDone(true);
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Email change failed."); }
      finally { setBusy(false); }
    }}>
      <label className="text-sm text-white/65">{isAr ? "البريد الجديد" : "New email"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#008ED3]" type="email" dir="ltr" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label className="text-sm text-white/65">{isAr ? "كلمة المرور الحالية" : "Current password"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#008ED3]" type="password" required autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
      <button className="admin-button w-fit border-[#008ED3] bg-[#008ED3] text-white" disabled={busy}>{busy ? <LoaderCircle size={16} className="animate-spin" /> : <AtSign size={16} />}{isAr ? "حفظ البريد" : "Save email"}</button>
    </form>
  </section>;
}

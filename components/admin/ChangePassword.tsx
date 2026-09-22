"use client";

import type { Session } from "@supabase/supabase-js";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useState } from "react";

import type { Locale } from "@/i18n/config";

export function ChangePassword({ session, locale }: { session: Session; locale: Locale }) {
  const isAr = locale === "ar";
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  return <section className="rounded-md border border-white/10 bg-[var(--admin-panel)] p-5 md:p-7">
    <div className="mb-2 flex items-center gap-2"><KeyRound size={18} className="text-[#43becc]" /><h3 className="text-lg font-extrabold">{isAr ? "تغيير كلمة مرور حسابك" : "Change your password"}</h3></div>
    <p className="mb-5 text-sm text-white/55">{session.user.email}</p>
    {error && <p role="alert" className="mb-4 text-sm text-red-200">{error}</p>}
    {done && <p role="status" className="mb-4 text-sm text-emerald-200">{isAr ? "تم تغيير كلمة المرور" : "Password changed successfully"}</p>}
    <form className="grid max-w-xl gap-4" onSubmit={async (event) => {
      event.preventDefault(); setError(""); setDone(false);
      if (password !== confirmPassword) { setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match."); return; }
      setBusy(true);
      try {
        const response = await fetch("/api/cms/users/password", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, password }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Password change failed.");
        setCurrentPassword(""); setPassword(""); setConfirmPassword(""); setDone(true);
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Password change failed."); }
      finally { setBusy(false); }
    }}>
      <label className="text-sm text-white/65">{isAr ? "كلمة المرور الحالية" : "Current password"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#43becc]" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
      <label className="text-sm text-white/65">{isAr ? "كلمة المرور الجديدة" : "New password"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#43becc]" type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <label className="text-sm text-white/65">{isAr ? "تأكيد كلمة المرور" : "Confirm new password"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#43becc]" type="password" autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
      <button className="admin-button w-fit border-[#118fc3] bg-[#118fc3] text-white" disabled={busy}>{busy ? <LoaderCircle size={16} className="animate-spin" /> : <KeyRound size={16} />}{isAr ? "حفظ كلمة المرور" : "Save password"}</button>
    </form>
  </section>;
}

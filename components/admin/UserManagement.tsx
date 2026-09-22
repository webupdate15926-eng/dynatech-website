"use client";

import type { Session } from "@supabase/supabase-js";
import { KeyRound, LoaderCircle, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ChangePassword } from "@/components/admin/ChangePassword";
import type { Locale } from "@/i18n/config";

type Role = "owner" | "editor";
type Member = { id: string; email: string; role: Role; isActive: boolean; createdAt: string; lastSignInAt: string | null };

export function UserManagement({ session, locale, role, needsMigration }: { session: Session; locale: Locale; role: Role; needsMigration: boolean }) {
  const isAr = locale === "ar";
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("editor");
  const [newPassword, setNewPassword] = useState("");
  const [editingPasswordFor, setEditingPasswordFor] = useState<string | null>(null);
  const [replacementPassword, setReplacementPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(role === "owner");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const request = useCallback(async (url: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: object) => {
    const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${session.access_token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Request failed.");
    return result as { members?: Member[] };
  }, [session.access_token]);

  const refresh = useCallback(async () => {
    if (role !== "owner") return;
    setLoading(true);
    try { setMembers((await request("/api/cms/users", "GET")).members ?? []); setError(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load users."); }
    finally { setLoading(false); }
  }, [request, role]);
  useEffect(() => { void refresh(); }, [refresh]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(""); setNotice("");
    try { await action(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Action failed."); }
    finally { setBusy(false); }
  };

  return <div className="space-y-8">
    <div><div className="flex items-center gap-2 text-[#43becc]"><Users size={18} /><span className="text-xs font-bold">{isAr ? "الحسابات والصلاحيات" : "ACCOUNTS & ACCESS"}</span></div><h2 className="mt-2 text-2xl font-black">{isAr ? "إدارة المستخدمين" : "User management"}</h2></div>
    {needsMigration && <p role="status" className="rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">{isAr ? "إدارة المستخدمين تحتاج تشغيل ترحيل قاعدة البيانات للحسابات أولًا." : "User management needs the account database migration first."}</p>}
    {error && <p role="alert" className="rounded-md border border-red-300/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {notice && <p role="status" className="rounded-md border border-emerald-300/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</p>}

    {role === "owner" && <section className="rounded-md border border-white/10 bg-[var(--admin-panel)] p-5 md:p-7">
      <div className="mb-2 flex items-center gap-2"><ShieldCheck size={18} className="text-[#43becc]" /><h3 className="text-lg font-extrabold">{isAr ? "مستخدمو لوحة التحكم" : "Dashboard users"}</h3></div>
      <p className="mb-5 text-sm text-white/55">{isAr ? "الأدمن ينشئ الحساب ويحدد كلمة مروره. شاركها مع المستخدم بشكل خاص؛ لن نعرضها بعد الحفظ." : "Create an account and set its password. Share it privately; it cannot be viewed after saving."}</p>
      <form className="mb-6 grid gap-3 border-b border-white/10 pb-6 sm:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)_auto]" onSubmit={(event) => { event.preventDefault(); void run(async () => { await request("/api/cms/users", "POST", { email, role: newRole, password: newPassword }); setEmail(""); setNewPassword(""); setNotice(isAr ? "تم إنشاء الحساب. شارك كلمة المرور مع المستخدم." : "Account created. Share the password with the user."); await refresh(); }); }}>
        <label className="min-w-0 text-sm text-white/65">{isAr ? "بريد المستخدم" : "User email"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#43becc]" type="email" required autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="text-sm text-white/65">{isAr ? "الصلاحية" : "Role"}<select className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white" value={newRole} onChange={(event) => setNewRole(event.target.value as Role)}><option value="editor">{isAr ? "مستخدم" : "User"}</option><option value="owner">{isAr ? "أدمن" : "Admin"}</option></select></label>
        <label className="min-w-0 text-sm text-white/65">{isAr ? "كلمة المرور" : "Password"}<input className="mt-2 h-11 w-full rounded border border-white/15 bg-[#0c1017] px-3 text-white outline-none focus:border-[#43becc]" type="password" required minLength={12} maxLength={256} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
        <button className="admin-button self-end" disabled={busy || needsMigration}><UserPlus size={16} />{isAr ? "إنشاء" : "Create"}</button>
      </form>
      {loading ? <LoaderCircle size={22} className="animate-spin text-[#43becc]" /> : <div className="space-y-2">{members.map((member) => <div key={member.id} className="rounded-md border border-white/10 bg-[#0c1017] p-3">
        <div className="flex flex-wrap items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold" dir="ltr">{member.email || member.id}</p><p className="mt-1 text-xs text-white/40">{member.id === session.user.id ? (isAr ? "حسابك" : "Your account") : member.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "موقوف" : "Disabled")}</p></div>
          <select aria-label={isAr ? `صلاحية ${member.email}` : `${member.email} role`} className="h-10 rounded border border-white/15 bg-[#111720] px-2 text-xs" value={member.role} disabled={busy || member.id === session.user.id} onChange={(event) => { const nextRole = event.target.value as Role; void run(async () => { await request("/api/cms/users", "PATCH", { id: member.id, role: nextRole }); setNotice(isAr ? "تم تعديل الصلاحية" : "Role updated"); await refresh(); }); }}><option value="editor">{isAr ? "مستخدم" : "User"}</option><option value="owner">{isAr ? "أدمن" : "Admin"}</option></select>
          <button type="button" className="admin-button" disabled={busy || member.id === session.user.id} onClick={() => { setEditingPasswordFor(editingPasswordFor === member.id ? null : member.id); setReplacementPassword(""); }}><KeyRound size={15} />{isAr ? "تغيير الباسورد" : "Change password"}</button>
          <button type="button" className="admin-button" disabled={busy || member.id === session.user.id} onClick={() => { const next = !member.isActive; if (!next && !window.confirm(isAr ? `إيقاف وصول ${member.email}؟` : `Disable ${member.email}?`)) return; void run(async () => { await request("/api/cms/users", "PATCH", { id: member.id, isActive: next }); setNotice(next ? (isAr ? "تم تفعيل الحساب" : "Account enabled") : (isAr ? "تم إيقاف الحساب" : "Account disabled")); await refresh(); }); }}>{member.isActive ? (isAr ? "إيقاف" : "Disable") : (isAr ? "تفعيل" : "Enable")}</button>
          <button type="button" className="admin-button border-red-300/25 text-red-200" disabled={busy || member.id === session.user.id} onClick={() => { if (!window.confirm(isAr ? `حذف حساب ${member.email} نهائيًا؟ لا يمكن التراجع.` : `Permanently delete ${member.email}? This cannot be undone.`)) return; void run(async () => { await request("/api/cms/users", "DELETE", { id: member.id }); setNotice(isAr ? "تم حذف الحساب" : "Account deleted"); await refresh(); }); }}><Trash2 size={15} />{isAr ? "حذف" : "Delete"}</button>
        </div>
        {editingPasswordFor === member.id && <form className="mt-3 flex flex-wrap items-end gap-2 border-t border-white/10 pt-3" onSubmit={(event) => { event.preventDefault(); void run(async () => { await request("/api/cms/users/reset-password", "POST", { id: member.id, password: replacementPassword }); setReplacementPassword(""); setEditingPasswordFor(null); setNotice(isAr ? "تم تغيير كلمة المرور" : "Password changed"); }); }}><label className="min-w-48 flex-1 text-sm text-white/65">{isAr ? "كلمة المرور الجديدة" : "New password"}<input className="mt-2 h-10 w-full rounded border border-white/15 bg-[#111720] px-3 text-white" type="password" required minLength={12} maxLength={256} autoComplete="new-password" value={replacementPassword} onChange={(event) => setReplacementPassword(event.target.value)} /></label><button className="admin-button" disabled={busy}>{isAr ? "حفظ" : "Save"}</button></form>}
      </div>)}</div>}
    </section>}

    <ChangePassword session={session} locale={locale} />
  </div>;
}

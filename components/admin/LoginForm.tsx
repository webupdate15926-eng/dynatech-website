"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { Image as ImageIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";

import type { Locale } from "@/i18n/config";

export function LoginForm({ supabase, locale }: { supabase: SupabaseClient; locale: Locale }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isAr = locale === "ar";

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="flex min-h-screen items-center justify-center bg-[#080d20] p-5 text-white">
      <form className="w-full max-w-md border border-white/10 bg-[#111936] p-7 shadow-2xl" onSubmit={async (event) => {
        event.preventDefault(); setLoading(true); setError("");
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) setError(signInError.message);
        setLoading(false);
      }}>
        <ImageIcon className="text-[#43becc]" size={30} />
        <h1 className="mt-5 text-3xl font-black uppercase">{isAr ? "لوحة إدارة المحتوى" : "Content Dashboard"}</h1>
        <p className="mt-2 text-sm text-white/55">{isAr ? "ادخل بالبريد وكلمة المرور التي حددها الأدمن." : "Sign in with the email and password set by your admin."}</p>
        <div className="mt-7 space-y-3">
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="h-12 w-full border border-white/10 bg-[#080d20] px-4 outline-none focus:border-[#43becc]" />
          <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="h-12 w-full border border-white/10 bg-[#080d20] px-4 outline-none focus:border-[#43becc]" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <button disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center bg-[#0087cb] text-xs font-black uppercase tracking-widest text-black hover:bg-[#43becc] disabled:opacity-50">
          {loading ? <LoaderCircle className="animate-spin" size={18} /> : isAr ? "دخول" : "Sign In"}
        </button>
        <p className="mt-4 text-sm text-white/45">{isAr ? "نسيت كلمة المرور؟ اطلب من الأدمن تغييرها من لوحة الحسابات." : "Forgot your password? Ask an admin to change it in Accounts."}</p>
      </form>
    </main>
  );
}

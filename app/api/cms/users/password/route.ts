import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { isSafeSupabaseBrowserKey } from "@/lib/cms/browser-key";
import { createCmsServerAdmin } from "@/lib/cms/server-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const body = await request.json().catch(() => null) as { currentPassword?: unknown; password?: unknown } | null;
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!token || !currentPassword || password.length < 12 || password.length > 256 || password === currentPassword) {
    return NextResponse.json({ error: "Provide your current password and a different new password (12-256 characters)." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const admin = createCmsServerAdmin();
  if (!url || !key || !isSafeSupabaseBrowserKey(key) || !admin) {
    return NextResponse.json({ error: "CMS authentication is not configured." }, { status: 503 });
  }
  const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: identity, error: identityError } = await auth.auth.getUser(token);
  if (identityError || !identity.user?.email) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const { data: member } = await admin.from("cms_admins").select("is_active").eq("user_id", identity.user.id).maybeSingle();
  if (!member?.is_active) return NextResponse.json({ error: "Dashboard access is disabled." }, { status: 403 });

  const { data: proof, error: proofError } = await auth.auth.signInWithPassword({ email: identity.user.email, password: currentPassword });
  if (proofError || proof.user?.id !== identity.user.id) return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });

  const { error: updateError } = await admin.auth.admin.updateUserById(identity.user.id, { password });
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json({ updated: true }, { headers: { "Cache-Control": "no-store" } });
}

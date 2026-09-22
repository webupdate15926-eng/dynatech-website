import { NextRequest, NextResponse } from "next/server";

import { verifyCmsAdmin } from "@/lib/cms/admin";
import { createCmsServerAdmin } from "@/lib/cms/server-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = await verifyCmsAdmin(token);
  if (!user) return NextResponse.json({ error: "Owner access required." }, { status: 403 });

  const admin = createCmsServerAdmin();
  if (!admin) return NextResponse.json({ error: "Set SUPABASE_SECRET_KEY on the server." }, { status: 503 });
  const { data: owner } = await admin.from("cms_admins").select("role,is_active").eq("user_id", user.id).maybeSingle();
  if (owner?.role !== "owner" || !owner.is_active) return NextResponse.json({ error: "Owner access required." }, { status: 403 });

  const body = await request.json().catch(() => null) as { id?: unknown; password?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(id) || id === user.id || password.length < 12 || password.length > 256) {
    return NextResponse.json({ error: "Choose a valid account and password (12-256 characters)." }, { status: 400 });
  }
  const { data: member, error: readError } = await admin.from("cms_admins").select("user_id").eq("user_id", id).maybeSingle();
  if (readError || !member) return NextResponse.json({ error: "CMS user not found." }, { status: 404 });

  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ updated: true }, { headers: { "Cache-Control": "no-store" } });
}

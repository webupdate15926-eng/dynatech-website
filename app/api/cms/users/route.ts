import { NextRequest, NextResponse } from "next/server";

import { verifyCmsAdmin } from "@/lib/cms/admin";
import { createCmsServerAdmin } from "@/lib/cms/server-admin";

export const runtime = "nodejs";

type Member = { user_id: string; role: "owner" | "editor"; is_active: boolean; created_at: string };

async function getOwner(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = await verifyCmsAdmin(token);
  if (!user) return null;

  const admin = createCmsServerAdmin();
  if (!admin) return { error: NextResponse.json({ error: "Set SUPABASE_SECRET_KEY on the server to manage users." }, { status: 503 }) };

  const { data, error } = await admin.from("cms_admins").select("role,is_active").eq("user_id", user.id).maybeSingle();
  if (error || data?.role !== "owner" || !data.is_active) return null;
  return { user, admin };
}

function denied() {
  return NextResponse.json({ error: "Owner access required." }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const access = await getOwner(request);
  if (!access) return denied();
  if ("error" in access) return access.error;

  const { admin } = access;
  const { data, error } = await admin.from("cms_admins").select("user_id,role,is_active,created_at").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const members = await Promise.all(((data ?? []) as Member[]).map(async (member) => {
    const { data: account } = await admin.auth.admin.getUserById(member.user_id);
    return {
      id: member.user_id,
      email: account.user?.email ?? "",
      role: member.role,
      isActive: member.is_active,
      createdAt: member.created_at,
      lastSignInAt: account.user?.last_sign_in_at ?? null,
    };
  }));
  return NextResponse.json({ members });
}

export async function POST(request: NextRequest) {
  const access = await getOwner(request);
  if (!access) return denied();
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null) as { email?: unknown; role?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = body?.role;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || (role !== "owner" && role !== "editor") || password.length < 12 || password.length > 256) {
    return NextResponse.json({ error: "Provide a valid email, role, and password (12-256 characters)." }, { status: 400 });
  }
  const { admin } = access;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Account creation failed." }, { status: 400 });

  const { error: memberError } = await admin.from("cms_admins").insert({ user_id: data.user.id, role, is_active: true });
  if (memberError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }
  return NextResponse.json({ created: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: NextRequest) {
  const access = await getOwner(request);
  if (!access) return denied();
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null) as { id?: unknown; role?: unknown; isActive?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(id) || id === access.user.id) {
    return NextResponse.json({ error: "Choose another valid account." }, { status: 400 });
  }
  const changes: { role?: "owner" | "editor"; is_active?: boolean } = {};
  if (body?.role !== undefined) {
    if (body.role !== "owner" && body.role !== "editor") return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    changes.role = body.role;
  }
  if (body?.isActive !== undefined) {
    if (typeof body.isActive !== "boolean") return NextResponse.json({ error: "Invalid account status." }, { status: 400 });
    changes.is_active = body.isActive;
  }
  if (!Object.keys(changes).length) return NextResponse.json({ error: "No changes provided." }, { status: 400 });

  const { admin } = access;
  const { data: current, error: readError } = await admin.from("cms_admins").select("role,is_active").eq("user_id", id).maybeSingle();
  if (readError || !current) return NextResponse.json({ error: "CMS user not found." }, { status: 404 });
  if (current.role === "owner" && current.is_active && (changes.role === "editor" || changes.is_active === false)) {
    const { count, error: countError } = await admin.from("cms_admins").select("user_id", { count: "exact", head: true }).eq("role", "owner").eq("is_active", true);
    if (countError || (count ?? 0) <= 1) return NextResponse.json({ error: "Keep at least one active owner." }, { status: 409 });
  }
  const { error } = await admin.from("cms_admins").update(changes).eq("user_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ updated: true });
}

export async function DELETE(request: NextRequest) {
  const access = await getOwner(request);
  if (!access) return denied();
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(id) || id === access.user.id) {
    return NextResponse.json({ error: "Choose another valid account." }, { status: 400 });
  }
  const { admin } = access;
  const { data: member, error: readError } = await admin.from("cms_admins").select("role,is_active").eq("user_id", id).maybeSingle();
  if (readError || !member) return NextResponse.json({ error: "CMS user not found." }, { status: 404 });
  if (member.role === "owner" && member.is_active) {
    const { count, error: countError } = await admin.from("cms_admins").select("user_id", { count: "exact", head: true }).eq("role", "owner").eq("is_active", true);
    if (countError || (count ?? 0) <= 1) return NextResponse.json({ error: "Keep at least one active owner." }, { status: 409 });
  }
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}

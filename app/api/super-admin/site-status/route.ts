import { NextRequest, NextResponse } from "next/server";

import { createCmsServerAdmin } from "@/lib/cms/server-admin";
import { isSuperAdminRequest } from "@/lib/super-admin/auth";

export const runtime = "nodejs";

function getAccess(request: NextRequest) {
  if (!isSuperAdminRequest(request)) return null;
  const admin = createCmsServerAdmin();
  if (!admin) return { error: NextResponse.json({ error: "Server administration is not configured." }, { status: 503 }) };
  return { admin };
}

function denied() {
  return NextResponse.json({ error: "Super admin access required." }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const access = getAccess(request);
  if (!access) return denied();
  if ("error" in access) return access.error;

  const { data, error } = await access.admin.from("cms_pages").select("document").eq("page_key", "site-control").eq("locale", "en").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const document = data?.document as { maintenance?: { enabled?: boolean; updatedAt?: string } } | null;
  return NextResponse.json({ enabled: document?.maintenance?.enabled === true, updatedAt: document?.maintenance?.updatedAt ?? null }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: NextRequest) {
  const access = getAccess(request);
  if (!access) return denied();
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null) as { enabled?: unknown } | null;
  if (typeof body?.enabled !== "boolean") return NextResponse.json({ error: "Invalid site status." }, { status: 400 });

  const updatedAt = new Date().toISOString();
  const document = { maintenance: { enabled: body.enabled, updatedAt, updatedBy: "private-super-admin" } };
  const { error } = await access.admin.from("cms_pages").upsert({ page_key: "site-control", locale: "en", document, updated_at: updatedAt, published_at: updatedAt }, { onConflict: "page_key,locale" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ enabled: body.enabled, updatedAt }, { headers: { "Cache-Control": "no-store" } });
}

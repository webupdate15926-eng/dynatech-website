import { NextRequest, NextResponse } from "next/server";

import { verifyCmsAdmin } from "@/lib/cms/admin";
import { createCmsServerAdmin } from "@/lib/cms/server-admin";

export const runtime = "nodejs";

type SiteMode = "website" | "landing";
type SiteControlDocument = {
  maintenance?: { enabled?: boolean; updatedAt?: string; updatedBy?: string };
  display?: { mode?: SiteMode; updatedAt?: string; updatedBy?: string };
};

async function getOwnerAccess(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = await verifyCmsAdmin(token);
  const admin = createCmsServerAdmin();
  if (!user || !admin) return null;

  const { data: member } = await admin.from("cms_admins").select("role,is_active").eq("user_id", user.id).maybeSingle();
  if (!member || member.is_active === false || member.role !== "owner") return null;
  return { admin, user };
}

function denied() {
  return NextResponse.json({ error: "Owner access required." }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const access = await getOwnerAccess(request);
  if (!access) return denied();

  const { data, error } = await access.admin.from("cms_pages").select("document").eq("page_key", "site-control").eq("locale", "en").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const document = data?.document as SiteControlDocument | null;
  return NextResponse.json({ mode: document?.display?.mode === "landing" ? "landing" : "website", updatedAt: document?.display?.updatedAt ?? null }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: NextRequest) {
  const access = await getOwnerAccess(request);
  if (!access) return denied();

  const body = await request.json().catch(() => null) as { mode?: unknown } | null;
  if (body?.mode !== "website" && body?.mode !== "landing") return NextResponse.json({ error: "Invalid website mode." }, { status: 400 });

  const { data: current, error: readError } = await access.admin.from("cms_pages").select("document").eq("page_key", "site-control").eq("locale", "en").maybeSingle();
  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 });

  const updatedAt = new Date().toISOString();
  const document: SiteControlDocument = {
    ...((current?.document as SiteControlDocument | null) ?? {}),
    display: { mode: body.mode, updatedAt, updatedBy: access.user.id },
  };
  const { error } = await access.admin.from("cms_pages").upsert({ page_key: "site-control", locale: "en", document, updated_at: updatedAt, published_at: updatedAt }, { onConflict: "page_key,locale" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ mode: body.mode, updatedAt }, { headers: { "Cache-Control": "no-store" } });
}

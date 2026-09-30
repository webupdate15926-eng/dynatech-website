import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { verifyCmsAdmin } from "@/lib/cms/admin";
import { createCmsServerAdmin } from "@/lib/cms/server-admin";
import type { JsonValue } from "@/lib/cms/types";

export const runtime = "nodejs";

type MediaAsset = {
  public_id?: unknown;
  resource_type?: unknown;
  secure_url?: unknown;
  format?: unknown;
  width?: unknown;
  height?: unknown;
  duration?: unknown;
  bytes?: unknown;
};

function replaceString(value: JsonValue, from: string, to: string): { value: JsonValue; changed: boolean } {
  if (typeof value === "string") return { value: value === from ? to : value, changed: value === from };
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const result = replaceString(item, from, to);
      changed ||= result.changed;
      return result.value;
    });
    return { value: next, changed };
  }
  if (value && typeof value === "object") {
    let changed = false;
    const next = Object.fromEntries(Object.entries(value).map(([key, item]) => {
      const result = replaceString(item, from, to);
      changed ||= result.changed;
      return [key, result.value];
    }));
    return { value: next, changed };
  }
  return { value, changed: false };
}

function containsString(value: JsonValue, target: string): boolean {
  if (typeof value === "string") return value === target;
  if (Array.isArray(value)) return value.some((item) => containsString(item, target));
  return Boolean(value && typeof value === "object" && Object.values(value).some((item) => containsString(item, target)));
}

async function authorize(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = await verifyCmsAdmin(token);
  const admin = createCmsServerAdmin();
  return user && admin ? { user, admin } : null;
}

function configureCloudinary() {
  const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) return false;
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return true;
}

export async function PATCH(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const body = await request.json().catch(() => null) as { id?: unknown; asset?: MediaAsset } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const asset = body?.asset;
  if (!id || typeof asset?.public_id !== "string" || typeof asset.secure_url !== "string" || typeof asset.resource_type !== "string") {
    return NextResponse.json({ error: "Invalid replacement asset." }, { status: 400 });
  }

  const { data: current, error: fetchError } = await auth.admin.from("cms_media").select("*").eq("id", id).maybeSingle();
  if (fetchError || !current) return NextResponse.json({ error: fetchError?.message ?? "Media file not found." }, { status: 404 });
  if (current.public_id !== asset.public_id || current.resource_type !== asset.resource_type) {
    return NextResponse.json({ error: "Replacement must keep the same Cloudinary file identity and type." }, { status: 400 });
  }

  for (const table of ["cms_pages", "cms_drafts"] as const) {
    const { data: rows, error } = await auth.admin.from(table).select("page_key,locale,document");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const row of rows ?? []) {
      const result = replaceString(row.document as JsonValue, current.secure_url, asset.secure_url);
      if (result.changed) {
        const { error: updateError } = await auth.admin.from(table).update({ document: result.value }).eq("page_key", row.page_key).eq("locale", row.locale);
        if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }
  }

  const update = {
    secure_url: asset.secure_url,
    format: typeof asset.format === "string" ? asset.format : null,
    width: typeof asset.width === "number" ? asset.width : null,
    height: typeof asset.height === "number" ? asset.height : null,
    duration: typeof asset.duration === "number" ? asset.duration : null,
    bytes: typeof asset.bytes === "number" ? asset.bytes : null,
  };
  const { data, error } = await auth.admin.from("cms_media").update(update).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ media: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  if (!configureCloudinary()) return NextResponse.json({ error: "CMS media configuration is incomplete." }, { status: 503 });
  const body = await request.json().catch(() => null) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Media id is required." }, { status: 400 });

  const { data: media, error: fetchError } = await auth.admin.from("cms_media").select("*").eq("id", id).maybeSingle();
  if (fetchError || !media) return NextResponse.json({ error: fetchError?.message ?? "Media file not found." }, { status: 404 });
  for (const table of ["cms_pages", "cms_drafts"] as const) {
    const { data: rows, error } = await auth.admin.from(table).select("document");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if ((rows ?? []).some((row) => containsString(row.document as JsonValue, media.secure_url))) {
      return NextResponse.json({ error: "This file is used in website content. Replace or remove it from the page first." }, { status: 409 });
    }
  }

  const result = await cloudinary.uploader.destroy(media.public_id, { resource_type: media.resource_type, invalidate: true });
  if (!["ok", "not found"].includes(result.result)) return NextResponse.json({ error: "Cloudinary could not delete this file." }, { status: 502 });
  const { error } = await auth.admin.from("cms_media").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
}

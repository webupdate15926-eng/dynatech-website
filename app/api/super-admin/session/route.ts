import { NextRequest, NextResponse } from "next/server";

import {
  createSuperAdminSession,
  isSuperAdminConfigured,
  isSuperAdminRequest,
  SUPER_ADMIN_COOKIE,
  superAdminCookieOptions,
  verifySuperAdminCredentials,
} from "@/lib/super-admin/auth";

export const runtime = "nodejs";

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowedOrigins = new Set([request.nextUrl.origin]);
  const configuredSiteUrl = process.env.CMS_SITE_URL;

  if (configuredSiteUrl) {
    try {
      const configuredOrigin = new URL(configuredSiteUrl).origin;
      const configuredUrl = new URL(configuredOrigin);
      allowedOrigins.add(configuredOrigin);
      configuredUrl.hostname = configuredUrl.hostname.startsWith("www.")
        ? configuredUrl.hostname.slice(4)
        : `www.${configuredUrl.hostname}`;
      allowedOrigins.add(configuredUrl.origin);
    } catch {
      // An invalid CMS_SITE_URL must not weaken the same-origin check.
    }
  }

  try {
    return allowedOrigins.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isSuperAdminRequest(request), configured: isSuperAdminConfigured() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isSuperAdminConfigured()) return NextResponse.json({ error: "Private owner access is not configured on the server." }, { status: 503 });
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  if (typeof body?.email !== "string" || typeof body.password !== "string" || !verifySuperAdminCredentials(body.email, body.password)) {
    return NextResponse.json({ error: "Invalid private credentials." }, { status: 401 });
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(SUPER_ADMIN_COOKIE, createSuperAdminSession(), superAdminCookieOptions);
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(SUPER_ADMIN_COOKIE, "", { ...superAdminCookieOptions, maxAge: 0 });
  return response;
}

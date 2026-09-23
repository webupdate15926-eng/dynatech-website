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
  return !origin || origin === request.nextUrl.origin;
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

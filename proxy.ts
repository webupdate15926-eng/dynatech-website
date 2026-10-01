import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales, type Locale } from "@/i18n/config";

function getPreferredLocale(): Locale {
  // Always default to English for new visitors
  return defaultLocale;
}

type SiteControl = { maintenanceEnabled: boolean; displayMode: "website" | "landing" };

async function getSiteControl(): Promise<SiteControl> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { maintenanceEnabled: false, displayMode: "website" };

  try {
    const response = await fetch(`${url}/rest/v1/cms_pages?page_key=eq.site-control&locale=eq.en&select=document`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!response.ok) return { maintenanceEnabled: false, displayMode: "website" };
    const rows = await response.json() as { document?: { maintenance?: { enabled?: boolean }; display?: { mode?: string } } }[];
    return {
      maintenanceEnabled: rows[0]?.document?.maintenance?.enabled === true,
      displayMode: rows[0]?.document?.display?.mode === "landing" ? "landing" : "website",
    };
  } catch {
    return { maintenanceEnabled: false, displayMode: "website" };
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const hasLocale = locales.includes(first as Locale);

  if (hasLocale) {
    const protectedArea = ["admin", "super-admin", "maintenance"].includes(segments[1] ?? "");
    if (!protectedArea) {
      const control = await getSiteControl();
      if (control.maintenanceEnabled) {
        const maintenanceUrl = request.nextUrl.clone();
        maintenanceUrl.pathname = `/${first}/maintenance`;
        return NextResponse.rewrite(maintenanceUrl);
      }
      if (control.displayMode === "landing" && segments[1] !== "landing") {
        const landingUrl = request.nextUrl.clone();
        landingUrl.pathname = `/${first}/landing`;
        return NextResponse.rewrite(landingUrl);
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", first);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("locale", first, { path: "/" });
    return response;
  }

  const cookieLocale = request.cookies.get("locale")?.value;
  const locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : getPreferredLocale();

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("locale", locale, { path: "/" });
  return response;
}

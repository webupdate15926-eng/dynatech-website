import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { verifyCmsAdmin } from "@/lib/cms/admin";
import { cmsPagePaths } from "@/lib/cms/config";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!(await verifyCmsAdmin(token))) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  }

  const { pageKey, locale } = (await request.json()) as { pageKey?: string; locale?: string };
  if (locale !== "en" && locale !== "ar") {
    return NextResponse.json({ error: "Unsupported locale." }, { status: 400 });
  }

  if (pageKey === "global") {
    revalidatePath(`/${locale}`, "layout");
  } else if (pageKey && Object.hasOwn(cmsPagePaths, pageKey)) {
    revalidatePath(`/${locale}${cmsPagePaths[pageKey]}`);
    if (pageKey === "technology-partners") {
      revalidatePath(`/${locale}/technology-partners/[slug]`, "page");
    }
  } else {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }

  return NextResponse.json({ revalidated: true });
}

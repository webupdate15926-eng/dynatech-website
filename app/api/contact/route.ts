import { NextRequest, NextResponse } from "next/server";

import type { ContactContent } from "@/content/schema/site";
import type { Locale } from "@/i18n/config";
import { getPageDocument } from "@/lib/cms/page-document";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map<string, { count: number; expiresAt: number }>();

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.expiresAt <= now) {
    attempts.set(key, { count: 1, expiresAt: now + 10 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return NextResponse.json({ message: "Message service is not configured yet." }, { status: 503 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (isRateLimited(forwardedFor || "unknown")) {
    return NextResponse.json({ message: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (text(payload.website, 200)) return NextResponse.json({ ok: true });

  const locale: Locale = payload.locale === "ar" ? "ar" : "en";
  const fullName = text(payload.fullName, 120);
  const company = text(payload.company, 160);
  const email = text(payload.email, 254).toLowerCase();
  const phone = text(payload.phone, 40);
  const inquiryType = text(payload.inquiryType, 160);
  const message = text(payload.message, 5000);

  if (!fullName || !emailPattern.test(email) || !inquiryType || message.length < 10) {
    return NextResponse.json({ message: locale === "ar" ? "برجاء مراجعة البيانات المطلوبة." : "Please check the required fields." }, { status: 400 });
  }

  const document = await getPageDocument<ContactContent>("contact", locale);
  const recipient = document.content.form.recipientEmail.trim();
  if (!emailPattern.test(recipient)) {
    return NextResponse.json({ message: "The recipient email is not configured correctly." }, { status: 503 });
  }

  const subject = `DYNATECH website: ${inquiryType}`;
  const rows = [
    ["Name", fullName],
    ["Company", company || "-"],
    ["Email", email],
    ["Phone", phone || "-"],
    ["Inquiry", inquiryType],
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #ddd">${label}</th><td style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipient],
      reply_to: email,
      subject,
      text: `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;color:#111"><h2>New website inquiry</h2><table style="border-collapse:collapse;width:100%;max-width:680px">${htmlRows}</table><h3 style="margin-top:24px">Message</h3><p style="white-space:pre-wrap;line-height:1.7">${escapeHtml(message)}</p></div>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend contact delivery failed", response.status, await response.text());
    return NextResponse.json({ message: locale === "ar" ? "تعذر إرسال الرسالة حالياً. حاول مرة أخرى." : "The message could not be sent right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

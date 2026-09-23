import "server-only";

import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const SUPER_ADMIN_COOKIE = "dynatech_super_admin";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHex] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  try {
    const expected = Buffer.from(expectedHex, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function getSessionSecret() {
  const secret = process.env.SUPER_ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isSuperAdminConfigured() {
  return Boolean(process.env.SUPER_ADMIN_EMAIL && process.env.SUPER_ADMIN_PASSWORD_HASH && getSessionSecret());
}

export function verifySuperAdminCredentials(email: string, password: string) {
  const configuredEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.SUPER_ADMIN_PASSWORD_HASH;
  if (!configuredEmail || !passwordHash || !getSessionSecret()) return false;
  return safeEqual(email.trim().toLowerCase(), configuredEmail) && verifyPassword(password, passwordHash);
}

export function createSuperAdminSession() {
  const secret = getSessionSecret();
  if (!secret) throw new Error("Super admin session secret is not configured.");
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySuperAdminSession(token?: string | null) {
  const secret = getSessionSecret();
  if (!secret || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof session.exp === "number" && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function isSuperAdminRequest(request: NextRequest) {
  return verifySuperAdminSession(request.cookies.get(SUPER_ADMIN_COOKIE)?.value);
}

export const superAdminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};

import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  AuthTokens,
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "@/lib/auth";
import { validateTokens } from "./validate-tokens";

/** Edge-safe: cookie presence only (no Node crypto in middleware). */
const hasBetterAuthSession = (request: NextRequest) => {
  try {
    return !!getSessionCookie(request);
  } catch {
    return false;
  }
};

/**
 * Validate the Better Auth session for real instead of trusting cookie
 * presence. A dead-but-present session cookie (e.g. after a failed sign-out
 * or an expired server-side session) must NOT count as authenticated —
 * otherwise the login page 307s to /feed and the login form becomes
 * unreachable (the auth trap).
 *
 * Edge-safe: plain fetch, no Node crypto. `/api/auth/get-session` returns
 * `{ session, user }` or `null` (HTTP 200 in both cases).
 *
 * Returns `undefined` when the validator itself is unreachable — the caller
 * must fail open to the presence-based check in that case.
 */
export const hasValidSession = async (
  request: NextRequest
): Promise<boolean | undefined> => {
  try {
    const url = new URL("/api/auth/get-session", request.url);
    const res = await fetch(url, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    if (!res.ok) return undefined;
    const data = await res.json().catch(() => null);
    return !!data?.session;
  } catch {
    return undefined;
  }
};

export const isAuthenticated = async (request: NextRequest) => {
  try {
    if (hasBetterAuthSession(request)) return true;

    const authTokens = getAuthTokensFromRequest(request);

    if (!authTokens) return false;

    // Validate Refresh Token
    const payload = await validateTokens(authTokens);

    return !!payload;
  } catch {
    return false;
  }
};

export const isCitizen = async (request: NextRequest) => {
  try {
    if (hasBetterAuthSession(request)) return true;

    const authTokens = getAuthTokensFromRequest(request);

    if (!authTokens) return false;

    // Validate Refresh Token
    const payload = await validateTokens(authTokens);

    if (!payload) return false;

    return payload.membership === "citizen";
  } catch {
    return false;
  }
};

const ADMIN_ACCOUNT_ADDRESS =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "0x6BE98e964CdEfB66Dbc724aF25B4Bdcc8075D801"
    : "0xcBe3a6B073d1460Cc642fC686769A2EB6aF32fa7";

export const isAdmin = async (request: NextRequest) => {
  // 1. Better Auth session → server-side is_admin flag (source of truth).
  // Edge-safe: same pattern as hasValidSession (auth-trap fix).
  try {
    const url = new URL("/api/admin/check", request.url);
    const res = await fetch(url, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.is_admin === true) return true;
    }
    // 403 = authenticated but not an admin → definitive, don't fall through.
    if (res.status === 403) return false;
    // 401 / network error → fall through to the legacy wallet check.
  } catch {
    // Validator unreachable → fall through to the legacy wallet check.
  }

  // 2. Legacy wallet-address check (fallback for the old auth path).
  try {
    const authTokens = getAuthTokensFromRequest(request);

    if (!authTokens) return false;

    // Validate Refresh Token
    const payload = await validateTokens(authTokens);

    if (!payload) return false;

    return payload.sub.toLowerCase() === ADMIN_ACCOUNT_ADDRESS.toLowerCase();
  } catch {
    return false;
  }
};

const getAuthTokensFromRequest = (request: NextRequest): AuthTokens | null => {
  const accessToken = request.cookies.get(ACCESS_TOKEN_STORAGE_KEY);
  const refreshToken = request.cookies.get(REFRESH_TOKEN_STORAGE_KEY);

  if (!accessToken || !refreshToken) return null;

  return {
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  };
};

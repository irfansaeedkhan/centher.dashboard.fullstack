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

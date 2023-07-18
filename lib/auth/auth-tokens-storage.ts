import { setCookie, getCookie } from "cookies-next";
import { AuthTokens } from "./types";

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

export const getAuthTokens = (): AuthTokens | null => {
  try {
    const tokens = {
      access_token: getCookie(ACCESS_TOKEN_STORAGE_KEY)?.toString(),
      refresh_token: getCookie(REFRESH_TOKEN_STORAGE_KEY)?.toString(),
    };

    if (!tokens.access_token || !tokens.refresh_token) {
      return null;
    }

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  } catch {
    return null;
  }
};

export const setAuthTokens = (tokens: AuthTokens): boolean => {
  try {
    setCookie(ACCESS_TOKEN_STORAGE_KEY, tokens.access_token, {
      maxAge: 60 * 60 * 24 * 15,
      sameSite: "lax",
      secure: true,
    });
    setCookie(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh_token, {
      maxAge: 60 * 60 * 24 * 15,
      sameSite: "lax",
      secure: true,
    });

    return true;
  } catch {
    return false;
  }
};

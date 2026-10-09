import { AppError } from "@/utils/app-error";
import { setAuthTokens } from "./auth-tokens-storage";

export type LogoutResponse = {
  status: string;
  message: string;
};

/**
 * Phase 1: sign out through Better Auth (`POST /api/auth/sign-out`), which
 * clears the server session and the session cookie. The legacy CIS
 * `/auth/logout` endpoint no longer exists (API identity: same-origin
 * `/api/*` only) — calling it always failed with "Can not logout" while the
 * session stayed active.
 *
 * Legacy wallet tokens (if any) are also cleared so a stale wallet session
 * cannot linger after logout.
 */
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });

    // 401 here just means there was no active session left — still logged out.
    if (!response.ok && response.status !== 401) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new AppError(
        new Error(data.message ?? "Logout failed"),
        data.message ?? "Can not logout",
        "logout"
      );
    }
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(error, "Can not logout", "logout");
  } finally {
    // Belt-and-braces: drop any legacy wallet tokens too.
    setAuthTokens({ access_token: "", refresh_token: "" });
  }

  return {
    status: "success",
    message: "Successfully logged out",
  };
};

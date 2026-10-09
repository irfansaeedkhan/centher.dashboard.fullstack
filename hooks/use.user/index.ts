import { useCallback } from "react";
import useSWR from "swr";
import { LoggedInUser } from "@/models/user";
import { axiosCIS } from "@/utils/axios";
import { updateMe } from "@/lib/user";

/**
 * Phase 1 session resilience: a 401 from `/api/users/me` means the Better Auth
 * session is stale/invalid. We clear it server-side via sign-out (so the
 * cookie-presence middleware can't bounce us into a login→feed→login loop)
 * and redirect to `/auth/login` — no boot loop, no silent broken render.
 */
const handleStaleSession = async () => {
  if (typeof window === "undefined") return;
  // Don't redirect from the auth pages themselves.
  if (window.location.pathname.startsWith("/auth/")) return;
  try {
    // Same requirement as lib/auth/logout.ts: Better Auth rejects this
    // endpoint without a JSON content-type (415) and without a parseable
    // JSON body (400). If this silently fails, a dead-but-present session
    // cookie traps the user in a /feed <-> /auth/login redirect loop with no
    // logout button and no login form (middleware trusts cookie presence).
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  } catch {
    // Sign-out failing must not block the redirect below.
  }
  window.location.replace("/auth/login");
};

const isUnauthorized = (error: any) =>
  error?.response?.status === 401 || error?.code === "UNAUTHORIZED";

const useUser = () => {
  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    `/api/users/me`,
    async (url) => {
      try {
        const { data } = await axiosCIS.get<LoggedInUser>(url);
        return data;
      } catch (error: any) {
        if (isUnauthorized(error)) {
          // Fire-and-forget: clear the stale session, then bounce to login.
          void handleStaleSession();
        }
        throw (
          error.response?.data ?? {
            status: "error",
            message: isUnauthorized(error) ? "unauthenticated" : "server_error",
            message_description: "Something went wrong",
          }
        );
      }
    },
    {
      onErrorRetry(err, _, _2, revalidate, { retryCount }) {
        // Never retry a 401 — the session is gone; retrying just delays the
        // redirect and hammers the API.
        if (isUnauthorized(err) || err.message === "unauthenticated") {
          return;
        }

        // Retry up to 5 times if there is any other error
        if (retryCount >= 5) {
          return;
        }

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  const updateUser = useCallback(
    async (user: Partial<LoggedInUser>) => {
      try {
        const updatedUser = await updateMe(user);
        mutate(updatedUser, false);
      } catch (error: any) {
        throw (
          error.response?.data ?? {
            status: "error",
            message: "server_error",
            message_description: "Something went wrong",
          }
        );
      }
    },
    [mutate]
  );

  const mutateUser = useCallback(
    async (userPartial: Partial<LoggedInUser>) => {
      mutate({ ...user, ...(userPartial as LoggedInUser) }, false);
    },
    [mutate, user]
  );

  const refetchUser = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    user: user,
    isLoading: !error && !user,
    error,
    updateUser,
    mutateUser,
    refetchUser,
  };
};

export default useUser;

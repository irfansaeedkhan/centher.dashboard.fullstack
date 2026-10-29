import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "@/hooks/use.user";
import { createProfileView } from "./create.profile.view";

export const useCreateUserProfileView = () => {
  const router = useRouter();
  const { user: loggedInUser, isLoading: isUserLoading } = useUser();

  const [userProfileViews, setUserProfileViews] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const user_id = router.query.user_id?.toString();
    // Feed fix 2026-10-29 (owner views): never record the owner's
    // own visit as audience growth. Wait for the session first: if
    // we fired while the session was still loading, the owner's
    // visit would slip through as an anonymous-looking count. An
    // anonymous visitor is also skipped — the server rejects that
    // ping with 401 anyway, so skipping avoids a useless failed
    // request. The server enforces the same rule as defence in depth.
    if (
      user_id &&
      !isUserLoading &&
      loggedInUser &&
      loggedInUser._id.toLowerCase() !== user_id.toLowerCase()
    ) {
      (async () => {
        try {
          const res = await createProfileView(user_id, controller);
          setUserProfileViews(res.views_count);
        } catch (error: any) {
          process.env.NODE_ENV !== "production" && console.dir(error);
          setUserProfileViews(null);
        }
      })();
    }

    return () => {
      controller?.abort();
    };
  }, [router.query.user_id, loggedInUser, isUserLoading]);

  return {
    userProfileViews,
  };
};

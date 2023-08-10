import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createProfileView } from "./create.profile.view";

export const useCreateUserProfileView = () => {
  const router = useRouter();

  const [userProfileViews, setUserProfileViews] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const user_id = router.query.user_id?.toString()?.toLowerCase();
    if (user_id) {
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
  }, [router.query.user_id]);

  return {
    userProfileViews,
  };
};

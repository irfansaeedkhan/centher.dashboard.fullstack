// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Current directory imports
import { createProfileView } from "./create.profile.view";

export const useCreateUserProfileView = () => {
  const router = useRouter();

  const [userProfileViews, setUserProfileViews] = useState<number | null>(null);

  useEffect(() => {
    const account_address = router.query.account_address
      ?.toString()
      ?.toLowerCase();
    if (account_address) {
      (async () => {
        try {
          const res = await createProfileView(account_address);
          setUserProfileViews(res.views_count);
        } catch (error: any) {
          process.env.NEXT_PUBLIC_WEB3_MODE !== "production" &&
            console.dir(error);
          setUserProfileViews(null);
        }
      })();
    }
  }, [router]);

  return {
    userProfileViews,
  };
};

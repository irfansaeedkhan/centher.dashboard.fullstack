// React, Next, NPM Packages
import { useEffect, useState } from "react";

// App imports
import useUser from "@/hooks/use.user";

// Current directory imports
import { getProfileViews } from "./get.profile.views";

export const useGetUserProfileViews = () => {
  const { user: loggedInUser } = useUser();

  const [userProfileViews, setUserProfileViews] = useState<number | null>(null);

  useEffect(() => {
    const account_address = loggedInUser?.account_address;
    if (account_address) {
      (async () => {
        try {
          const res = await getProfileViews(account_address);
          setUserProfileViews(res.views_count);
        } catch (error: any) {
          process.env.NODE_ENV !== "production" && console.dir(error);
          setUserProfileViews(null);
        }
      })();
    }
  }, [loggedInUser]);

  return {
    userProfileViews,
  };
};

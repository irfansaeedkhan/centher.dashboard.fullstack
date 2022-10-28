import React, { useMemo } from "react";
import { useRouter } from "next/router";

import { AppRoutes } from "@/constants/app.routes";

export const useCurrentPageRoute = () => {
  const router = useRouter();

  const currentPageRoute = useMemo(() => {
    return {
      isSinglePostPage: router.pathname === AppRoutes.feed.single_post,
      isFeedPage: router.pathname === AppRoutes.feed.index,
      isProfilePage: router.pathname === AppRoutes.profile.account_address,
    };
  }, [router.pathname]);

  return currentPageRoute;
};

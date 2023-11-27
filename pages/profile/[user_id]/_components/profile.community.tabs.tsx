import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";

export const ProfileCommunityTabs: React.FC = () => {
  const router = useRouter();

  return (
    <div className="scrollSetLight2 mb-4 flex w-full space-x-2 overflow-auto rounded-2xl p-1.5 sm:gap-2 fsm:mb-6">
      <Link
        href={{
          pathname: AppRoutes.profile.followers,
          query: { user_id: router.query.user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.followers &&
            "myBox font-medium",
          "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
        )}
      >
        Followers
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.following,
          query: { user_id: router.query.user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.following &&
            "myBox font-medium",
          "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
        )}
      >
        Following
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.referrals,
          query: { user_id: router.query.user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.referrals &&
            "myBox font-medium",
          "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
        )}
      >
        Referrals
      </Link>
    </div>
  );
};

import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FinalButton from "@/components/button/final.button";
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
        className="min-w-max"
      >
        <FinalButton
          title="Followers"
          variant={`${
            router.pathname === AppRoutes.profile.followers
              ? "primary"
              : "secondary"
          }`}
          className="rounded-[14px] text-xs sm:text-base fmd:px-6 fmd:py-2"
        />
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.following,
          query: { user_id: router.query.user_id },
        }}
        className="min-w-max"
      >
        <FinalButton
          title="Following"
          variant={`${
            router.pathname === AppRoutes.profile.following
              ? "primary"
              : "secondary"
          }`}
          className="rounded-[14px] text-xs sm:text-base fmd:px-6 fmd:py-2"
        />
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.referrals,
          query: { user_id: router.query.user_id },
        }}
        className="min-w-max"
      >
        <FinalButton
          title="Referrals"
          variant={`${
            router.pathname === AppRoutes.profile.referrals
              ? "primary"
              : "secondary"
          }`}
          className="rounded-[14px] text-xs sm:text-base fmd:px-6 fmd:py-2"
        />
      </Link>
    </div>
  );
};

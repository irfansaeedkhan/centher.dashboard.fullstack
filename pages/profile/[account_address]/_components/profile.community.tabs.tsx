import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import FinalButton from "@/components/button/final.button";
import { AppRoutes } from "@/constants/app.routes";

export const ProfileCommunityTabs: React.FC = ({}) => {
  const router = useRouter();

  return (
    <div className="mb-4 flex w-full justify-center space-x-2 rounded-2xl p-1.5 fsm:mb-6 sm:gap-2 flg:justify-start [@media(max-width:370px)]:overflow-auto">
      <Link
        href={`/profile/${router.query.account_address}/community/followers`}
        className="w-full max-w-max"
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
        href={`/profile/${router.query.account_address}/community/following`}
        className="w-full max-w-max"
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
        href={`/profile/${router.query.account_address}/community/referrals`}
        className="w-full max-w-max"
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

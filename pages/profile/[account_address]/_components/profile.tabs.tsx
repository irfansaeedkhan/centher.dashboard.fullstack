// React, Next, NPM Packages
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import useGetUser from "@/hooks/use.get.user";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";

export const ProfileTabs: React.FC = () => {
  const router = useRouter();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const currentPageRoute = useMemo(
    () => ({
      isProfilePage:
        router.pathname === AppRoutes.profile.account_address ||
        router.pathname === AppRoutes.profile.following ||
        router.pathname === AppRoutes.profile.followers ||
        router.pathname === AppRoutes.profile.replies,
      isNFTProfilePage:
        router.pathname === AppRoutes.profile.nfts ||
        router.pathname === AppRoutes.profile.purchased ||
        router.pathname === AppRoutes.profile.collection,
    }),
    [router.pathname]
  );

  return (
    <div
      className={`mb-4 flex w-full space-x-2 rounded-2xl bg-black-shade-6 p-1.5 fsm:mb-6 fsm:max-w-[430px]`}
    >
      <Link
        href={{
          pathname: AppRoutes.profile.account_address,
          query: {
            account_address: user?.account_address,
          },
        }}
        className="w-full"
      >
        <Button
          title={"Social Profile"}
          variant={`${currentPageRoute.isProfilePage ? "v1" : "v2"}`}
          className="fsm:px-8 fsm:py-3"
        />
      </Link>
      <Link
        href={{
          pathname: AppRoutes.profile.nfts,
          query: {
            account_address: user?.account_address,
          },
        }}
        className="w-full"
      >
        <Button
          title={"NFT Profile"}
          variant={`${currentPageRoute.isNFTProfilePage ? "v1" : "v2"}`}
          className="fsm:px-8 fsm:py-3"
        />
      </Link>
    </div>
  );
};

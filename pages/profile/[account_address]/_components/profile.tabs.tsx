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
        router.pathname === AppRoutes.profile.collections,
    }),
    [router.pathname]
  );

  return (
    <div
      className={`flex fsm:max-w-[430px] w-full fsm:w-max bg-black-shade-6 p-1.5 rounded-2xl mb-4 fsm:mb-6 space-x-2`}
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
          className="fsm:px-8 fsm:py-3  fsm:max-w-[200px]"
        />
      </Link>
      {/* <Link
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
      </Link> */}
    </div>
  );
};

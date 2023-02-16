import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import useUser from "@/hooks/use.user";

interface ProfileProps {
  account_address: string | string[] | undefined;
}

export const ProfileTabsSocial: React.FC<ProfileProps> = ({
  account_address,
}) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();

  return (
    <div className="mx-auto mt-2 flex max-w-max gap-2 overflow-auto text-[13px] fsm:text-sm fmd:mt-4 fmd:gap-10">
      <Link
        href={`/profile/${account_address}`}
        className={clsx(
          router.pathname === AppRoutes.profile.account_address
            ? "border-b-2 font-medium text-white"
            : "text-gray-shade-7",
          "min-w-max cursor-pointer py-2 px-4"
        )}
      >
        Posts
      </Link>
      {loggedInUser &&
        loggedInUser.account_address === router.query.account_address && (
          <Link
            href={`/profile/${account_address}/replies`}
            className={clsx(
              router.pathname === AppRoutes.profile.replies
                ? "border-b-2 font-medium text-white"
                : "text-gray-shade-7",
              "min-w-max cursor-pointer py-2 px-4"
            )}
          >
            Replies
          </Link>
        )}
      <Link
        href={`/profile/${account_address}/nfts/owned`}
        className={clsx(
          router.pathname === AppRoutes.profile.owned ||
            router.pathname === AppRoutes.profile.created ||
            router.pathname === AppRoutes.profile.collection
            ? "border-b-2 font-medium text-white"
            : "text-gray-shade-7",
          "min-w-max cursor-pointer py-2 px-4"
        )}
      >
        NFTs
      </Link>
      {loggedInUser &&
        loggedInUser.account_address === router.query.account_address && (
          <Link
            href={`/profile/${account_address}/followers`}
            className={clsx(
              router.pathname === AppRoutes.profile.followers
                ? "border-b-2 font-medium text-white"
                : "text-gray-shade-7",
              "min-w-max cursor-pointer py-2 px-4"
            )}
          >
            Followers
          </Link>
        )}
      {loggedInUser &&
        loggedInUser.account_address === router.query.account_address && (
          <Link
            href={`/profile/${account_address}/following`}
            className={clsx(
              router.pathname === AppRoutes.profile.following
                ? "border-b-2 font-medium text-white"
                : "text-gray-shade-7",
              "min-w-max cursor-pointer py-2 px-4"
            )}
          >
            Following
          </Link>
        )}
    </div>
  );
};

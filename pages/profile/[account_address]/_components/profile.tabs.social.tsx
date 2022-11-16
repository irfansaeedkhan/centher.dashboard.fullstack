import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";

interface ProfileProps {
  account_address: string | string[] | undefined;
}

export const ProfileTabsSocial: React.FC<ProfileProps> = ({
  account_address,
}) => {
  const router = useRouter();

  return (
    <div className="flex gap-2 fmd:gap-10 max-w-max mx-auto overflow-auto text-sm fmd:text-base">
      <Link
        href={`/profile/${account_address}`}
        className={clsx(
          router.pathname === AppRoutes.profile.account_address
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-2 px-4 cursor-pointer"
        )}
      >
        Posts
      </Link>

      <Link
        href={`/profile/${account_address}/replies`}
        className={clsx(
          router.pathname === AppRoutes.profile.replies
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-2 px-4 cursor-pointer"
        )}
      >
        Replies
      </Link>

      <Link
        href={`/profile/${account_address}/followers`}
        className={clsx(
          router.pathname === AppRoutes.profile.followers
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-2 px-4 cursor-pointer"
        )}
      >
        Followers
      </Link>

      <Link
        href={`/profile/${account_address}/following`}
        className={clsx(
          router.pathname === AppRoutes.profile.following
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-2 px-4 cursor-pointer"
        )}
      >
        Followings
      </Link>
    </div>
  );
};

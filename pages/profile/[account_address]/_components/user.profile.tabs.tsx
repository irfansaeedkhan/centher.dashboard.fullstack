import { AppRoutes } from "@/constants/app.routes";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface ProfileProps {
  account_address: string | string[] | undefined;
  loggedInUser: string | string[] | undefined;
}

const UserProfileTabs: React.FC<ProfileProps> = ({
  account_address,
  loggedInUser,
}) => {
  const router = useRouter();

  return (
    <div className="mt-6 flex gap-10">
      <Link
        href={`/profile/${account_address}`}
        className={clsx(
          router.pathname === AppRoutes.profile.account_address
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
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
          "py-[10px] px-4 cursor-pointer"
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
          "py-[10px] px-4 cursor-pointer"
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
          "py-[10px] px-4 cursor-pointer"
        )}
      >
        Followings
      </Link>
    </div>
  );
};

export default UserProfileTabs;

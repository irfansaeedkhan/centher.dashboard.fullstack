import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";
import useUser from "@/hooks/use.user";

interface ProfileProps {
  user_id: string | string[] | undefined;
}

export const ProfileTabsSocial: React.FC<ProfileProps> = ({ user_id }) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();

  return (
    <div className="mx-auto mt-2 flex max-w-max gap-2 overflow-auto text-[13px] fsm:text-sm fmd:mt-4 fmd:gap-10">
      <Link
        href={{
          pathname: AppRoutes.profile.user_id,
          query: { user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.user_id
            ? "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium text-white"
            : "text-gray-shade-7",
          "min-w-max cursor-pointer px-4 py-2"
        )}
      >
        Posts
      </Link>
      {loggedInUser && loggedInUser._id === router.query.user_id && (
        <Link
          href={{
            pathname: AppRoutes.profile.replies,
            query: { user_id },
          }}
          className={clsx(
            router.pathname === AppRoutes.profile.replies
              ? "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium text-white"
              : "text-gray-shade-7",
            "min-w-max cursor-pointer px-4 py-2"
          )}
        >
          Replies
        </Link>
      )}
      <Link
        href={{
          pathname: AppRoutes.profile.created,
          query: { user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.owned ||
            router.pathname === AppRoutes.profile.created ||
            router.pathname === AppRoutes.profile.listed ||
            router.pathname === AppRoutes.profile.collection
            ? "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium text-white"
            : "text-gray-shade-7",
          "min-w-max cursor-pointer px-4 py-2"
        )}
      >
        NFTs
      </Link>
      <Link
        href={{
          pathname:
            loggedInUser && loggedInUser._id === router.query.user_id
              ? AppRoutes.profile.followers
              : AppRoutes.profile.team_members,
          query: { user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.followers ||
            router.pathname === AppRoutes.profile.following ||
            router.pathname === AppRoutes.profile.referrals ||
            router.pathname === AppRoutes.profile.team_members
            ? "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium text-white"
            : "text-gray-shade-7",
          "min-w-max cursor-pointer px-4 py-2"
        )}
      >
        Community
      </Link>
    </div>
  );
};

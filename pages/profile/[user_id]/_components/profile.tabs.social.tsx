import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";
import { LoggedInUser, User } from "@/models/user";
import { useGetOrgMembers } from "@/hooks/org-team-members";

interface ProfileProps {
  user: User;
  loggedInUser: LoggedInUser | undefined;
}

export const ProfileTabsSocial: React.FC<ProfileProps> = ({
  user,
  loggedInUser,
}) => {
  const router = useRouter();
  const { orgMembers } = useGetOrgMembers(router.query.user_id?.toString());

  return (
    <div className="mx-auto mt-2 flex max-w-max gap-2 overflow-auto text-[13px] fsm:text-sm fmd:mt-4 fmd:gap-10">
      <Link
        href={{
          pathname: AppRoutes.profile.user_id,
          query: { user_id: user._id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.user_id &&
            "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium",
          "min-w-max cursor-pointer px-4 py-2 text-white"
        )}
      >
        Posts
      </Link>
      {loggedInUser && loggedInUser._id === router.query.user_id && (
        <Link
          href={{
            pathname: AppRoutes.profile.replies,
            query: { user_id: user._id },
          }}
          className={clsx(
            router.pathname === AppRoutes.profile.replies &&
              "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium",
            "min-w-max cursor-pointer px-4 py-2 text-white"
          )}
        >
          Replies
        </Link>
      )}
      <Link
        href={{
          pathname:
            user.membership.status === "citizen"
              ? AppRoutes.profile.created
              : AppRoutes.profile.owned,
          query: { user_id: user._id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.owned ||
            router.pathname === AppRoutes.profile.created ||
            router.pathname === AppRoutes.profile.listed ||
            (router.pathname === AppRoutes.profile.collection &&
              "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium"),
          "min-w-max cursor-pointer px-4 py-2 text-white"
        )}
      >
        NFTs
      </Link>
      {user.membership.status === "citizen" && !!orgMembers.length && (
        <Link
          href={{
            pathname: AppRoutes.profile.team,
            query: { user_id: user._id },
          }}
          className={clsx(
            router.pathname === AppRoutes.profile.team &&
              "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium",
            "min-w-max cursor-pointer px-4 py-2 text-white"
          )}
        >
          Team
        </Link>
      )}
      {loggedInUser && loggedInUser._id === router.query.user_id && (
        <Link
          href={{
            pathname: AppRoutes.profile.followers,
            query: { user_id: user._id },
          }}
          className={clsx(
            router.pathname === AppRoutes.profile.followers ||
              router.pathname === AppRoutes.profile.following ||
              (router.pathname === AppRoutes.profile.referrals &&
                "bg-gradient bg-[length:100%_3px] bg-bottom bg-no-repeat pb-4 font-medium"),
            "min-w-max cursor-pointer px-4 py-2 text-white"
          )}
        >
          Community
        </Link>
      )}
    </div>
  );
};

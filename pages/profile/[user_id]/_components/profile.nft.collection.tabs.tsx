import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";
import { User } from "@/models/user";
import clsx from "clsx";

interface Props {
  user: User;
}

export const ProfileNFTCollectionTabs: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  return (
    <div className="scrollSetLight2 mb-4 flex w-full max-w-[430px] gap-5 overflow-x-auto rounded-2xl p-1.5 fsm:mb-6">
      {user.membership.status === "citizen" && (
        <Link
          href={{
            pathname: AppRoutes.profile.created,
            query: { user_id: router.query.user_id },
          }}
          className={clsx(
            router.pathname === AppRoutes.profile.created &&
              "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          Created
        </Link>
      )}
      <Link
        href={{
          pathname: AppRoutes.profile.owned,
          query: { user_id: router.query.user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.owned && "myBox font-medium",
          "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
        )}
      >
        Owned
      </Link>

      <Link
        href={{
          pathname: AppRoutes.profile.listed,
          query: { user_id: router.query.user_id },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.listed && "myBox font-medium",
          "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
        )}
      >
        Listed
      </Link>

      {user.membership.status === "citizen" && (
        <Link
          href={{
            pathname: AppRoutes.profile.collection,
            query: { user_id: router.query.user_id },
          }}
          className={clsx(
            router.pathname === AppRoutes.profile.collection &&
              "myBox font-medium",
            "w-fit flex-shrink-0 px-4 py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
          )}
        >
          Collections
        </Link>
      )}
    </div>
  );
};

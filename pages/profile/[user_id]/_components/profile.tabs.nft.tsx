import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";

interface ProfileProps {
  userId: string | string[] | undefined;
}

export const ProfileTabsNFT: React.FC<ProfileProps> = ({ userId }) => {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-max gap-2 overflow-auto text-sm fmd:gap-10 fmd:text-base">
      <Link
        href={{
          pathname: AppRoutes.profile.nfts,
          query: { user_id: userId },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.nfts
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "cursor-pointer px-4 py-[10px]"
        )}
      >
        Owned
      </Link>

      <Link
        href={{
          pathname: AppRoutes.profile.collection,
          query: { user_id: userId },
        }}
        className={clsx(
          router.pathname === AppRoutes.profile.collection
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "cursor-pointer px-4 py-[10px]"
        )}
      >
        Collections
      </Link>
    </div>
  );
};

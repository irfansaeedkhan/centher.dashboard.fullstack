import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";

interface ProfileProps {
  account_address: string | string[] | undefined;
}

export const ProfileTabsNFT: React.FC<ProfileProps> = ({ account_address }) => {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-max gap-2 overflow-auto text-sm fmd:gap-10 fmd:text-base">
      <Link
        href={`/profile/${account_address}/nfts`}
        className={clsx(
          router.pathname === AppRoutes.profile.nfts
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "cursor-pointer py-[10px] px-4"
        )}
      >
        Owned
      </Link>

      <Link
        href={`/profile/${account_address}/collection`}
        className={clsx(
          router.pathname === AppRoutes.profile.collection
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "cursor-pointer py-[10px] px-4"
        )}
      >
        Collections
      </Link>
    </div>
  );
};

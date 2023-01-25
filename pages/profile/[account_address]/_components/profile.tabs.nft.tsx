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
    <div className="flex gap-2 fmd:gap-10 max-w-max mx-auto overflow-auto text-sm fmd:text-base">
      <Link
        href={`/profile/${account_address}/nfts`}
        className={clsx(
          router.pathname === AppRoutes.profile.nfts
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
        )}
      >
        Owned
      </Link>

      <Link
        href={`/profile/${account_address}/collections`}
        className={clsx(
          router.pathname === AppRoutes.profile.collections
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
        )}
      >
        Collections
      </Link>
    </div>
  );
};

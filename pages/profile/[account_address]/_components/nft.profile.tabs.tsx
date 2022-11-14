import { AppRoutes } from "@/constants/app.routes";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface ProfileProps {
  account_address: string | string[] | undefined;
}

const NFTProfileTabs: React.FC<ProfileProps> = ({ account_address }) => {
  const router = useRouter();

  return (
    <div className="mt-6 flex gap-10 w-full justify-center">
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

      {/* <Link
        href={`/profile/${account_address}/purchased`}
        className={clsx(
          router.pathname === AppRoutes.profile.purchased
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
        )}
      >
        Purchased
      </Link> */}

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

export default NFTProfileTabs;

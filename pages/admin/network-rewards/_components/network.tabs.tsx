import { AppRoutes } from "@/constants/app.routes";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NetworkTabs = () => {
  const router = useRouter();

  return (
    <div className="max-w-[428px] w-full bg-black-shade-6 h-12 p-[6px] rounded-[14px] text-sm font-bold flex gap-4 mb-6">
      <Link
        href={AppRoutes.admin.network_rewards}
        className={clsx(
          `w-full max-w-[200px] text-center h-full rounded-xl flex items-center justify-center`,
          router.pathname === AppRoutes.admin.network_rewards
            ? `bg-brand-primary text-black-shade-3`
            : `bg-black-shade-6 text-gray-shade-7`
        )}
      >
        Launchpad
      </Link>
      <Link
        href={AppRoutes.admin.network_rewards_marketplace}
        className={clsx(
          `w-full max-w-[200px] text-center h-full rounded-xl flex items-center justify-center`,
          router.pathname === AppRoutes.admin.network_rewards_marketplace
            ? `bg-brand-primary text-black-shade-3`
            : `bg-black-shade-6 text-gray-shade-7`
        )}
      >
        Marketplace
      </Link>
    </div>
  );
};

export default NetworkTabs;

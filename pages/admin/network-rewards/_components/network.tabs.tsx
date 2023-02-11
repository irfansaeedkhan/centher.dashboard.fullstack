import { AppRoutes } from "@/constants/app.routes";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NetworkTabs = () => {
  const router = useRouter();

  return (
    <div className="mb-6 flex h-auto w-full max-w-[500px] items-center gap-4 rounded-[14px] bg-black-shade-6 p-[6px] text-sm font-bold">
      <Link
        href={AppRoutes.admin.network_rewards}
        className={clsx(
          `flex h-full w-full max-w-[250px] items-center justify-center rounded-xl py-3 text-center`,
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
          `flex h-full w-full max-w-[250px] items-center justify-center rounded-xl py-3 text-center`,
          router.pathname === AppRoutes.admin.network_rewards_marketplace
            ? `bg-brand-primary text-black-shade-3`
            : `bg-black-shade-6 text-gray-shade-7`
        )}
      >
        Marketplace
      </Link>
      <Link
        href={AppRoutes.admin.network_rewards_UpdateContract}
        className={clsx(
          `flex h-full w-full max-w-[250px] items-center justify-center rounded-xl py-3 text-center`,
          router.pathname === AppRoutes.admin.network_rewards_UpdateContract
            ? `bg-brand-primary text-black-shade-3`
            : `bg-black-shade-6 text-gray-shade-7`
        )}
      >
        Update Contract
      </Link>
    </div>
  );
};

export default NetworkTabs;

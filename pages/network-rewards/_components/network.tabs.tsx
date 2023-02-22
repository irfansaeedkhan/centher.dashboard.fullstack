import { AppRoutes } from "@/constants/app.routes";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NetworkTabs = () => {
  const router = useRouter();

  return (
    <div className="mb-6 flex h-12 w-full max-w-[428px] gap-4 rounded-[14px] bg-black-shade-6 p-[6px] text-sm font-bold">
      <Link
        href={AppRoutes.referral.overview}
        className={clsx(
          `flex h-full w-full max-w-[200px] items-center justify-center rounded-xl text-center`,
          router.pathname === AppRoutes.referral.overview
            ? `bg-brand-primary text-black-shade-3`
            : `bg-black-shade-6 text-gray-shade-7`
        )}
      >
        Overview
      </Link>
      <Link
        href={AppRoutes.referral.network_rewards}
        className={clsx(
          `flex h-full w-full max-w-[200px] items-center justify-center rounded-xl text-center`,
          router.pathname === AppRoutes.referral.network_rewards
            ? `bg-brand-primary text-black-shade-3`
            : `bg-black-shade-6 text-gray-shade-7`
        )}
      >
        Rewards
      </Link>
    </div>
  );
};

export default NetworkTabs;

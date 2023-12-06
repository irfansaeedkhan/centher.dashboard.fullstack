import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";

export const PromotionCard7 = () => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-[272px] flex-col items-center justify-end rounded-10px bg-[url(/images/apy-ad.png)] bg-cover bg-center bg-no-repeat pb-4`
      )}
    >
      <Image
        src="/images/poster.png"
        alt="poster"
        width={175}
        height={181}
        className="h-[181px] w-[175px] object-contain"
      />
      <div className="flex flex-col items-center gap-2.5">
        <p className="text-center text-xl font-bold text-white">
          3.75% Monthly Rewards
        </p>
        <p className="px-1 text-center text-[10px] font-medium uppercase text-white">
          Revolutionize Your Finances: Prospera’s Staking Innovation – 3.75%
          Monthly Rewards, Automatic and Limitless Potential!
        </p>
        <Link
          href={AppRoutes.staking.index}
          className="flex w-full items-center justify-center"
        >
          <Button
            title="Check it OUT!"
            variant="primary"
            borderRounded="10px"
            className="w-full max-w-[149px]"
          />
        </Link>
      </div>
    </div>
  );
};

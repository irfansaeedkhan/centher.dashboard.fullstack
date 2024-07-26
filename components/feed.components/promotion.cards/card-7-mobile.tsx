import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";

export const PromotionCard7Mobile = () => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-full max-w-[272px] flex-col items-center justify-end rounded-10px border border-gray-shade-3 bg-[url(/images/apy-ad.png)] bg-cover bg-center bg-no-repeat pb-4`
      )}
    >
      <Image
        src="/images/poster-updated.png"
        alt="poster"
        width={175}
        height={181}
        className="h-[181px] w-[175px] object-contain"
      />
      <div className="flex flex-col items-center gap-2.5">
        <p className="px-0.5 text-center text-base font-bold text-white fxm:text-xl">
          3.75% Monthly Rewards
        </p>
        <p className="px-1 text-center text-[10px] font-medium uppercase text-white">
          Revolutionize Your Finances: Prospera&apos;s Staking Innovation –
          3.75% Monthly Rewards, Automatic and Limitless Potential!
        </p>
        <Link
          href={AppRoutes.staking.index}
          className="flex w-full items-center justify-center px-4"
        >
          <Button
            title="Check it OUT!"
            variant="primary"
            borderRounded="10px"
            className="w-full max-w-full text-sm fsm:text-base"
          />
        </Link>
      </div>
    </div>
  );
};

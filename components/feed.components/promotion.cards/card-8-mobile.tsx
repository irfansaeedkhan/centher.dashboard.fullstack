import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";

export const PromotionCard8Mobile = () => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-full max-w-[272px] flex-col items-center justify-end rounded-10px border border-gray-shade-3 bg-[url(/images/apy-ad.png)] bg-cover bg-center bg-no-repeat px-4 pb-4`
      )}
    >
      <Image
        src="/images/apex-mobile.png"
        alt="apex-mobile"
        width={175}
        height={181}
        className="h-[170px] w-[170px] object-contain fxm:h-[181px] fxm:w-[175px]"
      />
      <div className="flex flex-col items-center gap-2.5">
        <p className="text-center text-base font-bold uppercase text-white fxm:text-xl">
          45% APY in USDT
        </p>
        <p className="text-center text-[10px] font-medium uppercase text-white">
          Stake, Earn, Repeat with Prospera’s 45% APY in USDT – Your Gateway to
          Financial Freedom!
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

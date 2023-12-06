import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard8: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-[272px] flex-col items-center justify-end rounded-10px bg-[url(/images/apy-ad.png)] bg-cover bg-center bg-no-repeat px-4 pb-4`,
        className
      )}
      {...props}
    >
      <Image
        src="/images/apex-mobile.png"
        alt="apex-mobile"
        width={175}
        height={181}
        className="h-[181px] w-[175px] object-contain"
      />
      <div className="flex flex-col items-center gap-2.5">
        <p className="text-center text-xl font-bold uppercase text-white">
          45% APY in USDT
        </p>
        <p className="text-center text-[10px] font-medium uppercase text-white">
          Stake, Earn, Repeat with Prospera’s 45% APY in USDT – Your Gateway to
          Financial Freedom!
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

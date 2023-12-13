import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard3Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-full max-w-[200px] flex-col items-center justify-end overflow-hidden rounded-10px border border-gray-shade-3 bg-[url(/images/market-place-comingsoon.png)] bg-cover bg-no-repeat p-6 fxm:max-w-[272px]`,
        className
      )}
      {...props}
    >
      <div className="mb-[6px] mt-3 flex flex-col items-center justify-center gap-4 text-center">
        <span>
          <h2 className="text-xl font-bold text-white fxm:text-2xl fxm:leading-[26px]">
            NFT
          </h2>
          <h2 className="animationTextHeading text-xl font-bold fxm:text-2xl fxm:leading-[26px]">
            MARKETPLACE
          </h2>
        </span>
        <p className="text-xs font-semibold text-[#A0A4BB]">
          <span className="text-white">V2</span> NFT Marketplace with LOCK
          feature is
        </p>
        <h3 className="!text-[16px] font-bold  leading-[28px] tracking-widest text-white">
          LIVE NOW
        </h3>

        <Link
          href={{
            pathname: AppRoutes.marketplace.explore,
          }}
          className="flex w-full items-center justify-center px-4"
        >
          <Button
            title="Check it out"
            variant="primary"
            borderRounded="10px"
            className="w-full max-w-full text-sm fsm:text-base"
          />
        </Link>
      </div>
    </div>
  );
};

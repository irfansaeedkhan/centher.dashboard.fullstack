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
        `relative flex h-[348px] w-[272px] flex-col items-center justify-end overflow-hidden rounded-10px border border-gray-shade-3 bg-[url(/images/market-place-comingsoon.png)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div className="mb-[6px] mt-3 flex flex-col items-center justify-center gap-4 text-center">
        <span>
          <h2 className="!text-[24px] font-extrabold leading-[26px] text-white">
            NFT
          </h2>
          <h2 className="animationTextHeading !text-[24px] font-extrabold leading-[26px]">
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
        >
          <Button
            title="Check it out"
            variant="primary"
            borderRounded="10px"
            className="mt-4"
          />
        </Link>
      </div>
    </div>
  );
};

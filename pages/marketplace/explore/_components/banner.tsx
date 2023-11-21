import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";
import useUser from "@/hooks/use.user";

export const Banner = () => {
  const { user } = useUser();
  return (
    <div className="relative rounded-2xl bg-elevation-1">
      <div className="relative z-50 max-w-[294px] p-4 fsm:max-w-[360px] fsm:p-6 fmd:max-w-[500px] fmd:p-10 fxl:max-w-[620px]">
        <p className="text-sm font-bold text-white fsm:text-xl fmd:text-[28px] fmd:leading-[34px] fxl:text-4xl fxl:leading-[44px]">
          Social, <span className="textGradient">Entertainment</span>, and{" "}
          <span className="textGradient">NFTs.</span> All YOU want it&apos;s
          Here
        </p>
        <p className="mt-3 text-[11px] font-medium text-gray-shade-18 fsm:text-sm fmd:text-base">
          Enjoy Your Time, Become a Creator NOW!
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={
              user?.membership.status === "citizen"
                ? AppRoutes.marketplace.create_nft
                : AppRoutes.citizenship
            }
            className="w-fit"
          >
            <Button
              title="Create Nft"
              variant="primary"
              className="mt-6 h-10 text-[14px]"
              borderRounded="10px"
            />
          </Link>
          <Link
            href={
              user?.membership.status === "citizen"
                ? AppRoutes.marketplace.create_collection
                : AppRoutes.citizenship
            }
          >
            <Button
              title="Create Collection"
              variant="primary"
              className="mt-6 h-10 w-fit text-[14px]"
              borderRounded="10px"
            />
          </Link>
        </div>
      </div>
      <Image
        src="/images/bg-explore.png"
        fill={true}
        alt="Explore"
        sizes="1920px"
        quality={100}
        className="absolute z-20 rounded-lg object-cover"
      />
    </div>
  );
};

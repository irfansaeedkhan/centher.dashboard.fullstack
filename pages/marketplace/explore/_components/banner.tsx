import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

export const Banner = () => {
  return (
    <div className="relative rounded-2xl bg-elevation-1">
      <div className="relative z-50 max-w-[294px] p-4 fsm:max-w-[360px] fsm:p-6 fmd:max-w-[500px] fmd:p-10 fxl:max-w-[620px]">
        <p className="text-sm font-bold text-white fsm:text-xl fmd:text-[28px] fmd:leading-[34px] fxl:text-4xl fxl:leading-[44px]">
          Social, <span className="text-brand-primary">Entertainment</span>, and{" "}
          <span className="text-brand-primary">NFTs.</span> All YOU want
          it&apos;s Here
        </p>
        <p className="mt-3 text-[11px] font-medium text-gray-shade-18 fsm:text-sm fmd:text-base">
          Enjoy Your Time, Become a Creator NOW!
        </p>
        {/* <Link
          href={AppRoutes.marketplace.create_nft}
          className={`mt-6 inline-block w-fit rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-black-shade-2 hover:bg-brand-primary-dark fsm:px-6 fsm:text-sm`}
        >
          Create NFT
        </Link> */}
        <Link href={AppRoutes.marketplace.create_nft}>
          <FinalButton
            title="Create Nft"
            variant="primary"
            className="mt-6 h-10 w-[150px] text-[14px]"
            borderRounded="14px"
          />
        </Link>
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

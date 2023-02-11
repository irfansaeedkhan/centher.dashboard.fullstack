import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="relative flex max-w-[1300px]">
      <div className="!z-50 flex flex-col p-4 fsm:p-0 sm:m-5 sm:max-w-full md:m-10 md:max-w-[70%] f2xl:max-w-[595px]">
        <p className="font-bold text-white sm:text-2xl sm:!leading-7 md:text-34 md:!leading-[43px]">
          Social, <span className="text-brand-primary">Entertainment</span>, and{" "}
          <span className="text-brand-primary">NFTs.</span> All YOU want
          it&apos;s Here
        </p>
        <p className="mt-3 text-base font-medium text-gray-shade-18">
          Enjoy Your Time, Become a Creator NOW!
        </p>
        <Link
          href={AppRoutes.marketplace.create_nft}
          className={`mt-6 flex w-fit items-center rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-black-shade-2 hover:bg-brand-primary-dark `}
        >
          Create NFT
        </Link>
      </div>
      <Image
        src="/images/bg-explore.png"
        fill={true}
        alt="bg"
        className="absolute !z-20 rounded-lg object-cover"
      />
    </div>
  );
};

export default Banner;

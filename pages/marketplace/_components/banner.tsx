import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="relative flex max-w-[1300px]">
      <div className="f2xl:max-w-[595px] md:max-w-[70%] sm:max-w-full md:m-10 sm:m-5 !z-50 flex flex-col">
        <p className="md:text-34 sm:text-2xl font-bold text-white md:!leading-[43px] sm:!leading-7">
          Social, <span className="text-brand-primary">Entertainment</span>, and{" "}
          <span className="text-brand-primary">NFTs.</span> All YOU want
          it&apos;s Here
        </p>
        <p className="text-base font-medium text-gray-shade-18 mt-3">
          Enjoy Your Time, Become a Creator NOW!
        </p>
        <Link
          href={AppRoutes.marketplace.create_nft}
          className={`mt-6 w-fit px-6 py-2 flex text-sm rounded-lg items-center font-semibold bg-brand-primary text-black-shade-2 hover:bg-brand-primary-dark `}
        >
          Create NFT
        </Link>
      </div>
      <Image
        src="/images/bg-explore.png"
        fill={true}
        alt="bg"
        className="object-cover rounded-lg absolute !z-20"
      />
    </div>
  );
};

export default Banner;

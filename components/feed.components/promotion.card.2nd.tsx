import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import { Rocket, RocketShadow } from "@/assets/svgs";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const PromotionCard2nd: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "w-[272px] h-[348px] bg-[url(/images/bg-promotion2.png)] rounded-[10px] bg-no-repeat bg-cover relative p-6 flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="mb-4 ml-12 relative">
        <span className="absolute -left-14 top-0">
          <RocketShadow />
        </span>
        <span className="z-20">
          <Rocket />
        </span>
      </div>
      <div>
        <p className="text-sm font-extrabold leading-[17.07px] text-white text-center">
          DO YOU WANT TO CREATE YOUR OWN
        </p>
        <p className="animationTextHeading !text-[22px] leading-[26.82px] font-extrabold text-center">
          LAUNCHPAD?
        </p>
      </div>
      <Link
        href={AppRoutes.nfts.create_nft}
        className={`mt-4 w-fit px-6 py-2 flex text-sm rounded-lg items-center font-semibold bg-brand-primary text-black-shade-2 hover:bg-brand-primary-dark `}
      >
        Create Now
      </Link>
    </div>
  );
};

export default PromotionCard2nd;

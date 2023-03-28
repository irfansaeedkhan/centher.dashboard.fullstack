import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import { Rocket, RocketShadow } from "@/assets/svgs";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-[272px] flex-col items-center justify-center overflow-hidden rounded-10px bg-[url(/images/bg-promotion2.png)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div className={`relative mb-4 ml-12`}>
        <span className={`absolute -left-14 top-0`}>
          <RocketShadow />
        </span>
        <span className={`z-20`}>
          <Rocket />
        </span>
      </div>
      <div>
        <p
          className={`text-center text-sm font-extrabold leading-[17.07px] text-white`}
        >
          Did you take a look at our new
        </p>
        <p
          className={`animationTextHeading text-center !text-[22px] font-extrabold leading-[26.82px]`}
        >
          LAUNCHPAD?
        </p>
      </div>
      <Link
        href={{
          pathname: AppRoutes.launchpad,
          query: { token_address: "dexa", round: 0 },
        }}
        className={`mt-4 flex w-fit items-center rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-black-shade-2 hover:bg-brand-primary-dark `}
      >
        Go
      </Link>
    </div>
  );
};

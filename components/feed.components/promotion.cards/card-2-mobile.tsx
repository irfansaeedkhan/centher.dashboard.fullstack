import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import { Rocket, RocketShadow } from "@/assets/svgs";
import FinalButton from "@/components/button/final.button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-[272px] flex-col items-center justify-center overflow-hidden rounded-10px border border-gray-shade-3 bg-[url(/images/bg-promotion2.png)] bg-cover bg-no-repeat p-6`,
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
          className={`text-center text-sm font-medium leading-[17.07px] text-white`}
        >
          We released the Pre Booking Form for DeXa Token! The first token
          launched on Centher! Book your tokens now before the Pre Sale starts!
        </p>
      </div>
      <Link
        href={{
          pathname: AppRoutes.launchpad_pre_booking.index,
        }}
      >
        <FinalButton
          title="Book Now"
          variant="primary"
          borderRounded="10px"
          className="mt-4"
        />
      </Link>
    </div>
  );
};

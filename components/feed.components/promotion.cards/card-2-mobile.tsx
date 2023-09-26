import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import { Rocket, RocketShadow } from "@/assets/svgs";
import FinalButton from "@/components/button/final.button";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-[272px] flex-col items-center justify-center overflow-hidden rounded-10px border border-gray-shade-3  bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div className={`relative`}>
        <Image
          src="/images/dexagon--launch.png"
          width={150}
          height={150}
          alt="Picture of the author"
          className="h-auto w-auto object-contain"
        />
      </div>
      <div>
        <p
          className={`text-center text-sm font-medium uppercase leading-[17.07px] text-white`}
        >
          Dexa token is for sale now! Go get it for the best price before round
          1 ends!
        </p>
      </div>
      <Link
        href={{
          pathname: AppRoutes.launchpad_pre_booking.index,
        }}
      >
        <FinalButton
          title="Buy DeXa Token"
          variant="primary"
          borderRounded="10px"
          className="mt-4"
        />
      </Link>
    </div>
  );
};

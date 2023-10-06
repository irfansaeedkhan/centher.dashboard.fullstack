import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard6: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-[272px] flex-col items-center justify-end overflow-hidden rounded-10px bg-[url(/images/staking.gif)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div>
        <p
          className={`text-center text-sm font-medium leading-[17.07px] text-white`}
        >
          Are you a Centher Citizen? Check out Staking as a Service!
        </p>
      </div>
      <Link
        href={{
          pathname: AppRoutes.staking.index,
        }}
      >
        <FinalButton
          title="Stake Now!"
          variant="primary"
          borderRounded="10px"
          className="mt-4"
        />
      </Link>
    </div>
  );
};

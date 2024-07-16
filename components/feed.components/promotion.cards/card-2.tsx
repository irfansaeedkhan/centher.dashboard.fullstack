import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[330px] w-[272px] flex-col items-center justify-end rounded-10px bg-[url(/images/dexa-bomb.png)] bg-cover bg-center bg-no-repeat px-4 py-6`,
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center">
        <p
          className={`w-full max-w-[220px] text-center text-sm font-bold uppercase leading-[17.07px] text-white`}
        >
          Buy and stake DXC coin on 369x
        </p>
        <Link
          href={AppRoutes.staking.index}
          className="flex w-full items-center justify-center"
        >
          <Button
            title="Let's Go"
            variant="primary"
            borderRounded="10px"
            className="mt-4 w-full max-w-[149px]"
          />
        </Link>
      </div>
    </div>
  );
};

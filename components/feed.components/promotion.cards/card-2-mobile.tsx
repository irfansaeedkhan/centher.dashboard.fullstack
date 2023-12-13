import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard2Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-full max-w-[272px] flex-col items-center justify-end overflow-hidden rounded-10px border border-gray-shade-3 bg-[url(/images/dexa-bomb.png)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div>
        <p
          className={`w-full max-w-[220px] text-center text-sm font-medium uppercase leading-[17.07px] text-white`}
        >
          Buy and stake DXC coin on Centher
        </p>
      </div>
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
  );
};

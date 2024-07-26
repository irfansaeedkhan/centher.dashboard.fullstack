import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard5Mobile: React.FC<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-full max-w-[272px] flex-col items-center justify-end overflow-hidden rounded-10px border border-gray-shade-3 bg-[url(/images/x369x-citizenship.gif)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    >
      <div>
        <p
          className={`text-center text-sm font-medium leading-[17.07px] text-white`}
        >
          Get your Business Account with 369x Passport
        </p>
      </div>
      <Link
        href={{
          pathname: AppRoutes.citizenship,
        }}
      >
        <Button
          title="Become a Citizen!"
          variant="primary"
          borderRounded="10px"
          className="mt-4"
        />
      </Link>
    </div>
  );
};

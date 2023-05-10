import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { AppRoutes } from "@/constants/app.routes";
import { Rocket, RocketShadow } from "@/assets/svgs";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const PromotionCard4: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        `relative flex h-[348px] w-[272px] flex-col items-center justify-center overflow-hidden rounded-10px bg-[url(/images/promotion-card-4.gif)] bg-cover bg-no-repeat p-6`,
        className
      )}
      {...props}
    ></div>
  );
};

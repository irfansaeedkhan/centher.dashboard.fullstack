import { Flor } from "@/assets/svgs";
import Image from "next/image";
import React from "react";

export const PromotionCard1 = () => {
  return (
    <div className="relative flex h-[348px] w-[272px] flex-col items-center overflow-hidden rounded-10px bg-[url(/images/No-counter.png)] bg-cover bg-no-repeat p-6">
      <div className="absolute bottom-0 left-0 z-50 ">
        <Flor />
      </div>
      <Image
        src="/images/promotion.png"
        alt=""
        width={220}
        height={30}
        className="!h-[30px] !max-w-[220px] object-cover"
      />
      <div className="mb-[6px] mt-3 flex flex-col items-center justify-center">
        <h2 className="animationTextHeading !text-[21px] font-extrabold leading-[26px]">
          {process.env.NEXT_PUBLIC_BRAND_NAME} DAO
        </h2>
        <h2 className="!text-[21px] font-extrabold leading-[26px] text-white">
          LAUNCHPAD
        </h2>
      </div>
      <Image
        src="/images/token2.png"
        alt=""
        width={159}
        height={156}
        className="!h-[156px] !w-[159px] object-cover"
      />
    </div>
  );
};

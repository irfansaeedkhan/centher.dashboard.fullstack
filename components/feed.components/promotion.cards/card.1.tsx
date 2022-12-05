import { Flor } from "@/assets/svgs";
import Image from "next/image";
import React from "react";

export const PromotionCard1 = () => {
  return (
    <div className="w-[272px] h-[348px] rounded-10px overflow-hidden bg-[url(/images/No-counter.png)] bg-no-repeat bg-cover relative p-6 flex flex-col items-center">
      <div className="absolute bottom-0 z-50 left-0 ">
        <Flor />
      </div>
      <Image
        src="/images/promotion.png"
        alt=""
        width={220}
        height={30}
        className="!max-w-[220px] !h-[30px] object-cover"
      />
      <div className="flex flex-col items-center justify-center mt-3 mb-[6px]">
        <h2 className="animationTextHeading !text-[21px] font-extrabold leading-[26px]">
          NETHER DAO
        </h2>
        <h2 className="text-white !text-[21px] font-extrabold leading-[26px]">
          LAUNCHPAD
        </h2>
      </div>
      <Image
        src="/images/token2.png"
        alt=""
        width={159}
        height={156}
        className="!w-[159px] !h-[156px] object-cover"
      />
    </div>
  );
};

import React from "react";

export const PromotionCard3 = () => {
  return (
    <div className="relative flex h-[348px] w-[272px] flex-col items-center justify-end overflow-hidden rounded-10px bg-[url(/images/market-place-comingsoon.png)] bg-cover bg-no-repeat p-6">
      <div className="mt-3 mb-[6px] flex flex-col items-center justify-center gap-4 text-center">
        <span>
          <h2 className="!text-[24px] font-extrabold leading-[26px] text-white">
            NFT
          </h2>
          <h2 className="animationTextHeading !text-[24px] font-extrabold leading-[26px]">
            MARKETPLACE
          </h2>
        </span>
        <p className="text-xs font-semibold text-[#A0A4BB]">
          <span className="text-white">V2</span> NFT Marketplace with LOCK
          feature is
        </p>
        <h3 className="!text-[16px] font-bold  leading-[28px] tracking-widest text-white">
          COMING SOON
        </h3>
      </div>
    </div>
  );
};

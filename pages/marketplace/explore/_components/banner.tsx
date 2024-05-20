import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { AppRoutes } from "@/constants/app.routes";
import useUser from "@/hooks/use.user";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";

export const Banner = () => {
  const { user } = useUser();
  const router = useRouter();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);

  const handleShowBuyCitizenshipModal = (route: string) => {
    if (user?.membership.status === "citizen") {
      router.push(route);
      return;
    }
    setShowBuyCitizenshipModal(true);
  };
  return (
    <div className="relative rounded-2xl bg-elevation-1">
      <div className="relative z-50 p-4 fsm:p-6 fmd:p-10">
        <div className="max-w-[294px] fsm:max-w-[360px] fmd:max-w-[500px] fxl:max-w-[620px]">
          <p className="text-sm font-bold text-white fsm:text-xl fmd:text-[28px] fmd:leading-[34px] fxl:text-4xl fxl:leading-[44px]">
            Social, <span className="textGradient">Entertainment</span>, and{" "}
            <span className="textGradient">NFTs.</span> All YOU want it&apos;s
            Here
          </p>
          <p className="mt-3 text-[11px] font-medium text-gray-shade-18 fsm:text-sm fmd:text-base">
            Enjoy Your Time, Become a Creator NOW!
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <div
            className="gradient-border-3 flex h-10 cursor-pointer flex-col items-center justify-center !rounded-[10px] p-[1px]"
            onClick={() =>
              handleShowBuyCitizenshipModal(AppRoutes.marketplace.create_nft)
            }
          >
            <span className="glass-card h-10 w-fit rounded-[10px] bg-black/[0.04] px-4 py-2">
              <span className="textGradient text-xs font-semibold fsm:text-[14px]">
                Create NFT
              </span>
            </span>
          </div>
          <div
            className="gradient-border-3 relative flex h-10 cursor-pointer flex-col items-center justify-center !rounded-[10px] p-[1px]"
            onClick={() =>
              handleShowBuyCitizenshipModal(
                AppRoutes.marketplace.create_collection
              )
            }
          >
            <span className="glass-card h-10 w-fit rounded-[10px] bg-black/[0.04] px-4 py-2">
              <span className="textGradient text-xs font-semibold fsm:text-[14px]">
                Create Collection
              </span>
            </span>
          </div>
        </div>
      </div>
      <Image
        src="/images/bg-explore.png"
        fill={true}
        alt="Explore"
        sizes="1920px"
        quality={100}
        className="absolute z-20 rounded-lg object-cover"
      />
      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
    </div>
  );
};

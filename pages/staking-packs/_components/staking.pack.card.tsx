import React, { useState } from "react";
import { ModalWrapper } from "@/components/modal";
import Button from "@/components/button";
import { StakingPack } from "./staking.pack.data";

interface StakingPackCardProps {
  stakingPack: StakingPack;
}
export const StakingPackCard: React.FC<StakingPackCardProps> = ({
  stakingPack,
}) => {
  const [avatarModal, setAvatarModal] = useState(false);
  const AuthorizeFunction = () => {
    setAvatarModal(true);
  };

  return (
    <div className="stakingCard w-full max-w-[482px] overflow-hidden rounded-2xl bg-background-shade-3">
      <div className="flex items-center justify-between bg-background-shade-2 p-5">
        <h3 className="text-base font-bold text-white f2xl:text-lg">
          Staking Pack
        </h3>
        <Button
          title={"Authorize NTR"}
          variant={"primary"}
          className="max-w-[155px]"
          onClick={AuthorizeFunction}
        />
      </div>
      <div className="flex flex-col gap-5 pb-6 pt-8 sm:px-4 md:px-5">
        <div className="flex flex-col gap-3">
          <div className="flex w-full sm:justify-between sm:gap-9 md:justify-start md:gap-10">
            <span className="w-1/3 text-xs leading-[24px] text-gray-shade-7">
              Staking Pack
            </span>
            <span className="w-1/3 text-xs leading-[24px] text-gray-shade-7">
              Daily Percentage
            </span>
            <span className="w-1/3 text-xs leading-[24px] text-gray-shade-7">
              Daily Profit
            </span>
          </div>
          <div className="flex w-full sm:justify-between sm:gap-9 md:justify-start md:gap-10">
            <div className="flex w-1/3 gap-1 sm:flex-col md:flex-row">
              <span className="textGradient text-base  font-semibold">
                500NTR
              </span>
              <span className="text-sm font-semibold text-gray-shade-7">
                ($50)
              </span>
            </div>
            <span className="w-1/3 text-base font-semibold text-white">
              0.15
            </span>
            <span className="w-1/3 text-base font-semibold text-white">
              0,8 NTR
            </span>
          </div>
        </div>
        <div className="flex w-full gap-10 sm:justify-between md:justify-start">
          <div className="flex w-full gap-10">
            <div className="flex w-1/3 flex-col">
              <span className="pb-3 text-xs leading-[24px] text-gray-shade-7">
                Duration
              </span>
              <span className="text-base font-semibold text-white">0.15</span>
            </div>
            <div className="flex w-1/3 min-w-max flex-col">
              <span className="pb-3 text-xs leading-[24px] text-gray-shade-7">
                Claim Lookup
              </span>
              <span className="text-base font-semibold text-white">0.15</span>
            </div>
            <div className="flex w-1/3 flex-col"></div>
          </div>
        </div>
        <Button title={"Buy now"} variant={"secondary"} className="py-4" />
      </div>

      <ModalWrapper
        isOpen={avatarModal}
        onClose={() => setAvatarModal(false)}
        title={"Avatars"}
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          sdfsdf
        </div>
      </ModalWrapper>
    </div>
  );
};

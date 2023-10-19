// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { ModalWrapper } from "@/components/modal";
import Button from "@/components/button";

// Current directory imports
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
    <div className={StackCard}>
      <div className={StackCardTop}>
        <h3 className={CardTitle}>Staking Pack</h3>
        <Button
          title={"Authorize NTR"}
          variant={"primary"}
          className="max-w-[155px]"
          onClick={AuthorizeFunction}
        />
      </div>
      <div className={StackCardContent}>
        {/* <div className=""> */}
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
        <div className={StackCardContentWrap}>
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
        <div className={modalBodyWrapper}>sdfsdf</div>
      </ModalWrapper>
    </div>
  );
};

// styling
const modalBodyWrapper = ctl(`
  flex 
  gap-4 
  w-full 
  flex-wrap
  items-center 
  justify-center 
`);
const StackCard = ctl(`
  stakingCard overflow-hidden bg-background-shade-3 rounded-2xl   max-w-[482px]  w-full
`);
const StackCardTop = ctl(`
  flex justify-between items-center bg-background-shade-2 p-5
`);
const CardTitle = ctl(`
  text-base f2xl:text-lg font-bold text-white
`);
const StackCardContent = ctl(`
  pt-8 md:px-5 sm:px-4 flex flex-col gap-5 pb-6
`);
const StackCardContentWrap = ctl(`
  flex md:justify-start sm:justify-between gap-10 w-full
`);
const StackCardContentItem = ctl(`
   w-1/3
`);
const ContentItemTitle = ctl(`
  text-xs leading-[24px] text-gray-shade-7 pb-3 
`);
const ContentItemData = ctl(`
  text-base textGradient  font-semibold
`);
const ContentItemData2 = ctl(`
  text-base text-white font-semibold
`);
const rateContainer = ctl(`
  flex flex-col items-baseline lg:flex-row lg:items-center space-x-1 
`);
const ContentItemRate = ctl(`
  text-sm font-semibold text-gray-shade-7
`);

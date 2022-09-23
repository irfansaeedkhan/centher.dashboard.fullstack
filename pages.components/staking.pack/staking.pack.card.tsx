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
          variant={"v1"}
          className="max-w-[155px]"
          onClick={AuthorizeFunction}
        />
      </div>
      <div className={StackCardContent}>
        <div className={StackCardContentWrap}>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitle}>Staking Pack</h5>
            <div className={rateContainer}>
              <h4 className={ContentItemData}>
                {stakingPack.rateNTR ?? "N/A"}NTR
              </h4>
              <h6 className={ContentItemRate}>
                (${Math.floor(stakingPack.rateNTR * 0.013102)})
              </h6>
            </div>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitle}>Daily Percentage</h5>
            <h4 className={ContentItemData2}>{stakingPack.percentage}</h4>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitle}>Daily Profit</h5>
            <h4 className={ContentItemData2}>{stakingPack.profit} NTR</h4>
          </div>
        </div>
        <div className={StackCardContentWrap}>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitle}>Claim Lockup</h5>
            <h4 className={ContentItemData2}>{stakingPack.claimLockup}</h4>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitle}>Duration</h5>
            <h4 className={ContentItemData2}>{stakingPack.duration}</h4>
          </div>
        </div>
        <Button title={"Buy now"} variant={"v3"} className="py-4" />
      </div>
      {avatarModal && (
        <ModalWrapper onClose={() => setAvatarModal(false)} title={"Avatars"}>
          <div className={modalBodyWrapper}>sdfsdf</div>
        </ModalWrapper>
      )}
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
  text-18px font-bold text-white
`);
const StackCardContent = ctl(`
  pt-8 px-5 flex flex-col gap-5 pb-6
`);
const StackCardContentWrap = ctl(`
  flex md:justify-start sm:justify-between gap-10 
`);
const StackCardContentItem = ctl(`
   w-max
`);
const ContentItemTitle = ctl(`
  text-12px leading-[24px] text-gray-shade-7 pb-3 
`);
const ContentItemData = ctl(`
  text-16px textGradient  font-semibold
`);
const ContentItemData2 = ctl(`
  text-16px text-white font-semibold
`);
const rateContainer = ctl(`
  flex flex-col items-baseline lg:flex-row lg:items-center space-x-1 
`);
const ContentItemRate = ctl(`
  text-14px font-semibold text-gray-shade-7
`);

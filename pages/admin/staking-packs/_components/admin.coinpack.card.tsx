import React from "react";
import Link from "next/link";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import { DeleteIconBtnCoinPack } from "@/assets/svgs";
import { StakingPack } from "./admin.coinpack.list";

interface StakingPackCardProps {
  stakingPack: StakingPack;
}
export const StakingPackCard: React.FC<StakingPackCardProps> = ({
  stakingPack,
}) => {
  return (
    <div className={StackCard}>
      <div className={StackCardTop}>
        <div className="flex items-center gap-2">
          <h3 className={CardTitle}>Staking Pack</h3>
          <div className="rounded-lg bg-[#21BF7F] bg-opacity-[20%] px-2 py-1">
            <span className="text-[#21BF7F]">Active</span>
          </div>
        </div>
        <div className="max-w-[70px] rounded-lg bg-gray-shade-3 p-2">
          <DeleteIconBtnCoinPack className="" />
        </div>
      </div>
      <div className={StackCardContent}>
        <div className={StackCardContentWrap}>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitleMax}>Staking Pack</h5>
            <div className={rateContainer}>
              <h4 className={ContentItemData}>
                {stakingPack.rateNTR ?? "N/A"}NTR
              </h4>
              <h6 className={ContentItemRate}>
                (${stakingPack.rateNTR * 0.013102})
              </h6>
            </div>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitle}>Daily Percentage</h5>
            <h4 className={ContentItemData2}>{stakingPack.percentage}</h4>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitleMax}>Daily Profit</h5>
            <h4 className={ContentItemData2}>{stakingPack.profit} NTR</h4>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitleMax}>Claim Lockup</h5>
            <h4 className={ContentItemData2}>{stakingPack.claimLockup}</h4>
          </div>
          <div className={StackCardContentItem}>
            <h5 className={ContentItemTitleMax}>Duration</h5>
            <h4 className={ContentItemData2}>{stakingPack.duration}</h4>
          </div>
        </div>
        <Link href={AppRoutes.admin.update_staking_pack} className="block">
          <Button title={"Update"} variant={"secondary"} />
        </Link>
      </div>
    </div>
  );
};

const StackCardContent = `pt-10 pb-4 px-5`;
const StackCardContentItem = `w-max lg:w-1/3 lg:mb-10`;
const CardTitle = `text-16 f2xl:text-20 font-bold text-white`;
const ContentItemRate = `text-12 f2xl:text-14 text-gray-shade-7`;
const ContentItemData2 = `text-16 f2xl:text-22 text-white font-semibold`;
const ContentItemData = `text-16 f2xl:text-22 textGradient font-semibold`;
const StackCardTop = `flex justify-between items-center bg-background-shade-2 p-5`;
const StackCardContentWrap = `flex flex-wrap pb-10 lg:pb-2 gap-x-8 gap-y-6 lg:gap-0`;
const ContentItemTitle = `text-12 f2xl:text-14 leading-[18px] text-gray-shade-7 pb-4`;
const rateContainer = `flex flex-col items-baseline lg:flex-row lg:items-center space-x-1`;
const StackCard = `stakingCard overflow-hidden bg-background-shade-3 rounded-2xl max-w-[655px]`;
const ContentItemTitleMax = `text-12 f2xl:text-14 leading-[18px] text-gray-shade-7 pb-4 w-max`;

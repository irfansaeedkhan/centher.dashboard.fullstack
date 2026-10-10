import React, { useRef, useState } from "react";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { OptionalType } from "@/staking/types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { Referral } from "@/staking/types/referrals.interface";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import SmallScreenRewardData from "./small-screen-reward-data";
import SmallScreenReferralData from "./small-screen-referral-data";
import { eqAddress } from "@/lib/chat/utils";

const SmallScreenReferralTable: React.FC<{
  isClaiming: string;
  rewards: RefReward[];
  currentTab: string;
  setCurrentTab: (val: "rewards" | "referrals") => void;
  claimRefReward: (user: string) => void;
  referrals: OptionalType<Referral[]>;
  coins: Array<CoinDetails | undefined>;
  pool: ListCardDataOBj | null;
  claimable: boolean;
}> = ({
  isClaiming,
  rewards,
  currentTab,
  setCurrentTab,
  referrals,
  claimRefReward,
  coins,
  pool,
  claimable,
}) => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openButton, setOpenButton] = useState(false);

  useOnClickOutside(ref, () => setOpenDropdown(false));
  useOnClickOutside(ref2, () => setOpenButton(false));

  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-shade-3 bg-black-shade-9 p-4">
      <div className="mb-6 flex items-center justify-between gap-5 bg-transparent fxm:mb-8">
        <div className="flex items-center gap-5">
          <div
            className={clsx(
              "myBox relative flex w-fit flex-shrink-0 cursor-pointer items-center gap-2 py-1.5 text-xs font-medium leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <span>
              {currentTab === "rewards"
                ? "List of Claimed Rewards"
                : "List of Referrals"}
            </span>
            {openDropdown ? (
              <SlArrowUp className="h-5 w-5 flex-shrink-0 text-white" />
            ) : (
              <SlArrowDown className="h-5 w-5 flex-shrink-0 text-white" />
            )}
            {openDropdown && (
              <div
                ref={ref}
                className="absolute top-10 z-[100] h-auto w-[205px] rounded-xl border border-gray-shade-3 bg-black-shade-12"
              >
                <p
                  className="rounded-xl px-3 py-4 text-center text-sm hover:bg-elevation-1/80"
                  onClick={() => {
                    setCurrentTab("referrals");
                    setOpenDropdown(false);
                  }}
                >
                  List of Referrals
                </p>
                <p
                  className="rounded-xl px-3 py-4 text-center text-sm hover:bg-elevation-1/80"
                  onClick={() => {
                    setCurrentTab("rewards");
                    setOpenDropdown(false);
                  }}
                >
                  List of Claimed Rewards
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {currentTab === "rewards" ? (
        <SmallScreenRewardData
          data={rewards}
          decimals={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.reward_token_address)
            )?.decimals as string
          }
          token={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.reward_token_address)
            )?.symbol as string
          }
        />
      ) : (
        <SmallScreenReferralData
          isClaiming={isClaiming}
          claimable={claimable}
          data={referrals}
          token={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.token_address)
            )?.symbol as string
          }
          rewardToken={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.reward_token_address)
            )?.symbol as string
          }
          rewardTokenDecimals={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.reward_token_address)
            )?.decimals as string
          }
          decimals={
            coins.find((e) =>
              eqAddress(e?.contractAddress, pool?.token_address)
            )?.decimals as string
          }
          claimRefReward={claimRefReward}
        />
      )}
    </div>
  );
};

export default SmallScreenReferralTable;

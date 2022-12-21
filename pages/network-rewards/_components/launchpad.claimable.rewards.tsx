import clsx from "clsx";
import React from "react";
import SingleLevelReward from "./single.level.reward";
import ctl from "@netlify/classnames-template-literals";

export interface ClaimableRewardsProps {
  rewardState: "lunchpad-rewards" | "marketplace-rewards";
}

const LaunchpadClaimableRewards: React.FC<ClaimableRewardsProps> = ({
  rewardState,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full h-auto bg-elevation-1 rounded-[14px]">
        <div
          className={clsx(
            `w-full fsm:h-[92px] h-[146px] bg-no-repeat bg-center bg-cover py-5 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4`,
            rewardState === "marketplace-rewards"
              ? "bg-[url(/images/liscense1.png)]"
              : "bg-[url(/images/liscense3.png)]"
          )}
        >
          <div className="text-white fsm:text-sm text-xs space-y-1">
            {rewardState === "lunchpad-rewards" ? (
              <p className="">Lunchpad Rewards</p>
            ) : rewardState === "marketplace-rewards" ? (
              <p className="">Marketplace Rewards</p>
            ) : null}
            {rewardState === "lunchpad-rewards" ? (
              <span className="font-semibold flex gap-2 items-center">
                <p>00 (BUSD)</p>
                <span className="border-l border-white/[0.1] h-3" />
                <p>00 (NTR)</p>
              </span>
            ) : rewardState === "marketplace-rewards" ? (
              <p className="font-semibold flex gap-2 items-center">00 (BNB)</p>
            ) : null}
          </div>
          {rewardState === "lunchpad-rewards" && (
            <button className="fsm:w-[172px] w-full h-10 text-black-shade-3 text-sm font-bold text-center bg-brand-primary rounded-xl">
              Claim Reward
            </button>
          )}
        </div>
        <div className="py-6 flex flex-wrap gap-10 md:pl-10 pl-6">
          <SingleLevelReward rewardState={rewardState} />
          <SingleLevelReward rewardState={rewardState} />
          <SingleLevelReward rewardState={rewardState} />
          <SingleLevelReward rewardState={rewardState} />
          <SingleLevelReward rewardState={rewardState} />
          <SingleLevelReward rewardState={rewardState} />
        </div>
      </div>
      {/* table */}
      <div>
        {rewardState === "lunchpad-rewards" && (
          <div className={TableContainer}>
            <h3 className={TableTitle}>LAUNCHPAD REWARDS</h3>
            <table className={table}>
              <thead className={thead}>
                <tr>
                  <th scope="col" className={th}>
                    Date
                  </th>
                  <th scope="col" className={th}>
                    Public Key (Rewards from)
                  </th>
                  <th scope="col" className={th}>
                    level
                  </th>
                  <th scope="col" className={th}>
                    Days
                  </th>
                  <th scope="col" className={th}>
                    My Rewards <span className="text-white">(BUSD)</span>
                  </th>
                  <th scope="col" className={th}>
                    Claim Rewards
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={tbodyTR}>
                  <td className={td}>12th, Aug 2022</td>
                  <td className={td}>0xab9...8cxz</td>
                  <td className={td}>1</td>
                  <td className={td}>12</td>
                  <td className={td}>3,8</td>
                  <td className={td}>00</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {rewardState === "marketplace-rewards" && (
          <div className={TableContainer}>
            <h3 className={TableTitle}>NFT REWARDS</h3>
            <table className={table}>
              <thead className={thead}>
                <tr>
                  <th scope="col" className={th}>
                    Date
                  </th>
                  <th scope="col" className={th}>
                    Public Key (Rewards from)
                  </th>
                  <th scope="col" className={th}>
                    level
                  </th>
                  <th scope="col" className={th}>
                    Days
                  </th>
                  <th scope="col" className={th}>
                    My Rewards <span className="text-white">(BUSD)</span>
                  </th>
                  <th scope="col" className={th}>
                    Claim Rewards
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={tbodyTR}>
                  <td className={td}>12th, Aug 2022</td>
                  <td className={td}>0xab9...8cxz</td>
                  <td className={td}>1</td>
                  <td className={td}>12</td>
                  <td className={td}>3,8</td>
                  <td className={td}>00</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchpadClaimableRewards;

const TableTitle = ctl(` 
p-5  lg:p-8 lg:pb-5 text-20px font-semibold text-white
`);
const TableContainer = ctl(` 
overflow-x-auto relative bg-background-shade-3 shadow-md rounded-2xl mt-8 lg:mt-12
`);
const table = ctl(` 
overflow-hidden w-full border-2 rounded-2xl border-gray-shade-3 text-sm text-left text-gray-500 bg-background-shade-3 
`);
const thead = ctl(` 
text-14px text-gray-shade-7  uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 first:px-8 last:px-8 px-5 lg:px-6 capitalize
`);
const td = ctl(` 
first:px-8 last:px-8 px-5 lg:px-6 text-14px py-4 lg:py-7  text-white font-medium
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);

// React, Next, NPM Packages
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports

//React, Next, NPM Packages
import { useState } from "react";

//App imports
import Button from "@/components/button";
import {
  StakingPackCard,
  StakingPackList,
} from "@/pages.components/admin.staking.pack";

import {
  AdminFeeDetailsData,
  AdminFeeDetailsTable,
} from "@/pages.components/admin.staking.fee.details";

const StakingPack: NextPage = () => {
  const [tab, setTab] = useState<
    "CoinPack" | "StakingFeeDetails" | "StakingPurchase" | "PackClaimRewards"
  >("CoinPack");

  return (
    <div className={StakingContentContainer}>
      <div className={btnContainer}>
        <Button
          title={"Coin Pack"}
          variant={tab === "CoinPack" ? "v1" : "v2"}
          onClick={() => {
            setTab("CoinPack");
          }}
        />
        <Button
          title={"Staking fee details"}
          variant={tab === "StakingFeeDetails" ? "v1" : "v2"}
          onClick={() => {
            setTab("StakingFeeDetails");
          }}
        />
        <Button
          title={"Staking Purchase"}
          variant={tab === "StakingPurchase" ? "v1" : "v2"}
          onClick={() => {
            setTab("StakingPurchase");
          }}
        />
        <Button
          title={"Pack Claim Rewards"}
          variant={tab === "PackClaimRewards" ? "v1" : "v2"}
          onClick={() => {
            setTab("PackClaimRewards");
          }}
        />
      </div>
      {tab === "CoinPack" && (
        <div className={stackCardContainer}>
          {StakingPackList.map((data) => (
            <StakingPackCard stakingPack={data} key={data.id} />
          ))}
        </div>
      )}
      {tab === "StakingFeeDetails" &&
        AdminFeeDetailsData.map((data) => (
          <AdminFeeDetailsTable feeDetails={data} key={data.id} />
        ))}
    </div>
  );
};

export default StakingPack;

const StakingContentContainer = ctl(`
  stakingpack bg-black-shade-3 w-full min-h-screen p-4 lg:pt-8 lg:pl-7 font-monto
`);

const btnContainer = ctl(`
  flex [&>*]:w-max w-fit bg-black-shade-6 p-1.5 rounded-2xl mb-10
`);

const stackCardContainer = ctl(`
  flex flex-wrap gap-5
`);

// React, Next, NPM Packages
import { useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

//App imports
import Button from "@/components/button";

import { AdminFeeDetailsTable } from "./admin.fee.details.table";
import { StakingPackCard } from "./admin.coinpack.card";
import { StakingPackList } from "./admin.coinpack.list";

export const StakingPacks: NextPage = () => {
  const [tab, setTab] = useState<
    "CoinPack" | "StakingFeeDetails" | "StakingPurchase" | "PackClaimRewards"
  >("CoinPack");

  return (
    <div className={StakingContentContainer}>
      <div className={btnContainer}>
        <Button
          title={"Coin Pack"}
          variant={tab === "CoinPack" ? "primary" : "secondary"}
          onClick={() => {
            setTab("CoinPack");
          }}
        />
        <Button
          title={"Staking fee details"}
          variant={tab === "StakingFeeDetails" ? "primary" : "secondary"}
          onClick={() => {
            setTab("StakingFeeDetails");
          }}
        />
        <Button
          title={"Staking Purchase"}
          variant={tab === "StakingPurchase" ? "primary" : "secondary"}
          onClick={() => {
            setTab("StakingPurchase");
          }}
        />
        <Button
          title={"Pack Claim Rewards"}
          variant={tab === "PackClaimRewards" ? "primary" : "secondary"}
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
      {tab === "StakingFeeDetails" && <AdminFeeDetailsTable />}
    </div>
  );
};

const StakingContentContainer = ctl(`
  stakingpack bg-black-shade-3 w-full min-h-screen p-4 lg:pt-8 lg:pl-7 font-monto
`);

const btnContainer = ctl(`
  flex [&>*]:w-max w-fit bg-black-shade-6 p-1.5 rounded-2xl mb-10
`);

const stackCardContainer = ctl(`
  flex flex-wrap gap-5
`);

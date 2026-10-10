import { useState } from "react";
import { NextPage } from "next";
import Button from "@/components/button";
import { AdminFeeDetailsTable } from "./admin.fee.details.table";
import { StakingPackCard } from "./admin.coinpack.card";
import { StakingPackList } from "./admin.coinpack.list";

export const StakingPacks: NextPage = () => {
  const [tab, setTab] = useState<"CoinPack" | "StakingFeeDetails">("CoinPack");

  return (
    <div className="stakingpack min-h-screen w-full bg-black-shade-3 p-4 font-monto lg:pl-7 lg:pt-8">
      <div className="mb-10 flex w-fit rounded-2xl bg-black-shade-6 p-1.5 [&>*]:w-max">
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
      </div>
      {tab === "CoinPack" && (
        <div className="flex flex-wrap gap-5">
          {StakingPackList.map((data) => (
            <StakingPackCard stakingPack={data} key={data.id} />
          ))}
        </div>
      )}
      {tab === "StakingFeeDetails" && <AdminFeeDetailsTable />}
    </div>
  );
};

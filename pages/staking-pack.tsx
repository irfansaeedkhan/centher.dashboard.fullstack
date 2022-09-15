// React, Next, NPM Packages
import { NextPage } from "next";
import { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";

// Current page imports
import {
  StakingPackCard,
  StakingPackList,
} from "@/pages.components/staking.pack";

const StakingPackPage: NextPage = () => {
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");

  return (
    <div className={dashboardContentContainer}>
      <h1 className={title}>Staking Pack</h1>
      <div className={btnContainer}>
        <Button
          title={"Pack List"}
          variant={"v1"}
          onClick={() => {
            setTab("PackList");
          }}
        />
        <Button
          title={"Activated"}
          variant={"v2"}
          onClick={() => {
            setTab("Activated");
          }}
        />
      </div>
      {tab === "PackList" && (
        <div className={StackCardContainer}>
          {StakingPackList.map((data) => (
            <StakingPackCard stakingPack={data} key={data.id} />
          ))}
        </div>
      )}
      {tab === "Activated" && (
        <h1 className="text-16  lg:text-20 font-bold text-white">Activated</h1>
      )}
    </div>
  );
};

export default StakingPackPage;

// styling
const dashboardContentContainer = ctl(`
  stakingpack bg-black-shade-3 w-full min-h-screen p-4 lg:pt-8 lg:pl-7 font-monto
`);
const title = ctl(`
  textGradient text-24 xl:text-34 leading-[42px] font-medium pb-6 lg:pb-8
`);
const btnContainer = ctl(`
  flex max-w-[416px] bg-black-shade-6 p-1.5 rounded-2xl mb-10
`);
const StackCardContainer = ctl(`
  flex flex-wrap gap-5
`);

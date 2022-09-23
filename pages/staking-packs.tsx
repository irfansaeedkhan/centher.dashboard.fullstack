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
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

const StakingPackPage: NextPage = () => {
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");

  return (
    <AllPagesWrapper pageTitle="Staking Packs">
      <div className={dashboardContentContainer}>
        <h1 className={title}>Staking Pack</h1>
        <div className={btnContainer}>
          <Button
            title={"Pack List"}
            variant={`${tab === "PackList" ? "v1" : "v2"}`}
            onClick={() => {
              setTab("PackList");
            }}
          />
          <Button
            title={"Activated"}
            variant={`${tab === "Activated" ? "v1" : "v2"}`}
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
          <h1 className="text-16  lg:text-20 font-bold text-white">
            Activated
          </h1>
        )}
      </div>
    </AllPagesWrapper>
  );
};

export default StakingPackPage;

// styling
const dashboardContentContainer = ctl(`
  stakingpack bg-black-shade-3 w-full min-h-screen font-monto
`);
const title = ctl(`
  textGradient text-34px font-semibold leading-[42px] font-medium pb-6 
`);
const btnContainer = ctl(`
  ToggleBtnsContainer flex max-w-[428px] bg-black-shade-6 p-1.5 rounded-2xl mb-6 
`);
const StackCardContainer = ctl(`
  flex flex-wrap gap-5
`);

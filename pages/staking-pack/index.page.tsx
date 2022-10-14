// React, Next, NPM Packages
import { NextPage } from "next";
import { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import Button from "@/components/button";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import { StakingPackCard, StakingPackList } from "./_components";

const StakingPackPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");

  return (
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
        <h1 className="text-16  lg:text-20 font-bold text-white">Activated</h1>
      )}
    </div>
  );
};

StakingPackPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking Packs">{page}</AllPagesWrapper>;
};

export default StakingPackPage;

// styling
const dashboardContentContainer = ctl(`
  stakingpack bg-black-shade-3 w-full min-h-screen font-monto
`);
const title = ctl(`
textGradient  pb-6 animationTextHeading text-34px
`);
const btnContainer = ctl(`
  ToggleBtnsContainer flex max-w-[428px] bg-black-shade-6 p-1.5 rounded-2xl mb-6 
`);
const StackCardContainer = ctl(`
  flex flex-wrap gap-5
`);

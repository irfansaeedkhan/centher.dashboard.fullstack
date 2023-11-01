import React, { useState } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import Button from "@/components/button";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { StakingPackCard, StakingPackList } from "./_components";

const StakingPackPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");

  return (
    <div className="stakingpack min-h-screen w-full bg-black-shade-3 font-monto">
      <h1 className="textGradient animationTextHeading pb-6 sm:text-2xl lg:text-[34px]">
        Staking Pack
      </h1>
      <div className="ToggleBtnsContainer mb-6 flex max-w-[428px] rounded-2xl bg-black-shade-6 p-1.5">
        <Button
          title={"Pack List"}
          variant={`${tab === "PackList" ? "primary" : "secondary"}`}
          onClick={() => {
            setTab("PackList");
          }}
        />
        <Button
          title={"Activated"}
          variant={`${tab === "Activated" ? "primary" : "secondary"}`}
          onClick={() => {
            setTab("Activated");
          }}
        />
      </div>
      {tab === "PackList" && (
        <div className="flex flex-wrap gap-5">
          {StakingPackList.map((data) => (
            <StakingPackCard stakingPack={data} key={data.id} />
          ))}
        </div>
      )}
      {tab === "Activated" && (
        <h1 className="text-base font-bold text-white lg:text-xl">Activated</h1>
      )}
    </div>
  );
};

StakingPackPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Staking Packs">{page}</AllPagesWrapper>;
};

export default StakingPackPage;

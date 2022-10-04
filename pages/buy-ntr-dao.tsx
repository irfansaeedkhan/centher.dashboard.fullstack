// React, Next, NPM Packages
import { NextPage } from "next";
import { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import {
  PresaleCard,
  PurchaseNTRDAOCard,
} from "@/pages.components/buy.ntr.dao";

const BuyNTRDAOPage: NextPage = () => {
  const [tab, setTab] = useState<"PackList" | "Activated">("PackList");

  return (
    <AllPagesWrapper pageTitle="Buy NTRDAO">
      <div className={dashboardContentContainer}>
        <h1 className={title}>Buy NTRDAO</h1>
        <div className={daoMainContentContainer}>
          <PresaleCard />
          <PurchaseNTRDAOCard />
          <PresaleCard />
          <PurchaseNTRDAOCard locked={true} />
          <PresaleCard />
          <PurchaseNTRDAOCard locked={true} />
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default BuyNTRDAOPage;

// styling
const dashboardContentContainer = ctl(`
  bg-black-shade-3 w-full max-w-[1144px] min-h-screen font-monto mx-auto pb-10
`);
const title = ctl(`
  textGradient leading-[42px] pb-6 animationTextHeading text-34px 
`);
const daoMainContentContainer = ctl(`
flex flex-col gap-5
`);

// React, Next, NPM Packages
import Link from "next/link";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import { ProfilePageWrapper } from "./_components";

const NFTProfilePurchased: NextPageWithLayout = () => {
  return (
    <div className={nftProfilePageContainer}>
      <div className={tabContentContainer}>
        <h1 className={tabContent}>Purchased (coming soon)</h1>
      </div>
    </div>
  );
};

NFTProfilePurchased.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper>{page}</ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfilePurchased;

// styling
const nftProfilePageContainer = ctl(`
`);

const tabContentContainer = ctl(`
tabContent flex items-center justify-center w-full h-[250px]
`);

const tabContent = ctl(`
textGradient font-semibold leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl w-fit
`);

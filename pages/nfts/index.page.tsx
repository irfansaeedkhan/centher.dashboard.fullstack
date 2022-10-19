// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NFTLeftSideComponent, NFTRightSideComponent } from "./_components";
import { ArrowLeftSimpleIcon } from "@/assets/svgs";

const NFT: NextPageWithLayout = () => {
  return (
    <div className="w-full pb-16">
      <button className={backBtn}>
        <ArrowLeftSimpleIcon />
      </button>
      <div className="flex gap-9 items-start [@media(max-width:1279px)]:flex-col">
        <NFTLeftSideComponent />
        <NFTRightSideComponent />
      </div>
    </div>
  );
};

NFT.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Create NFT">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default NFT;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative 
`);
const backBtn = ctl(`
bg-black-shade-10 rounded-full flex items-center justify-center w-12 h-12
mb-8
`);
const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start 
`);

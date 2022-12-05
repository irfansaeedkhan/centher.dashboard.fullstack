// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { Levels } from "./_components";

let levelData = [];
const ReferralProgram: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Levels />
        {/* <LevelParentCard />
        <LevelChildCard /> */}
        {/* <Banner />
        <TopCreators />
        <HotNFTs />
        <HotCollections /> */}
      </div>
    </div>
  );
};

ReferralProgram.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Referral Program - Nether NFT">
      {page}
    </AllPagesWrapper>
  );
};

export default ReferralProgram;

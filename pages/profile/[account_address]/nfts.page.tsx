// React, Next, NPM Packages
import Link from "next/link";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import { ProfilePageWrapper } from "./_components";
import NFTCard from "@/components/nft.card";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTProfilePageWrapper } from "./_components/nftprofile.page.wrapper";

let dummyData = [
  {
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551-1",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    tokenId: "1",
    creator: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    createTime: "1667598636",
    ipfs: "ipfs://QmWueD3yCmsUeRuniBGBJEd2YyGLMJVb4FGNqTaseh3xHx/nether/Tree.json",
    saleState: "List",
    price: "100000000000000",
    owner: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    endTime: 0,
  },
  {
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551-10",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    tokenId: "10",
    creator: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    createTime: "1667816340",
    ipfs: "ipfs://QmZkjJfroBhoquWbiguHa7KF3zVWwqvaQ848FDmDqPP74F/nether/dev2.json",
    saleState: "List",
    price: "1000000000000000000",
    owner: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    endTime: 0,
  },
  {
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551-11",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    tokenId: "11",
    creator: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    createTime: "1667816496",
    ipfs: "ipfs://Qmcw1tDYtVoQcJ1F8YzkPrimX8HSswZLbpMMciieFGq9ha/nether/test4.json",
    saleState: "List",
    price: "1000000000000000000",
    owner: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    endTime: 0,
  },
  {
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551-12",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    tokenId: "12",
    creator: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    createTime: "1667816580",
    ipfs: "ipfs://QmToC5YtYeWc2rZpGJUdH2WWRSq5PTeuvo6fNC1CUTEcns/nether/test 5.json",
    saleState: "List",
    price: "1000000000000000000",
    owner: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    endTime: 0,
  },
  {
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551-13",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    tokenId: "13",
    creator: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    createTime: "1667816700",
    ipfs: "ipfs://QmdxoyJaHv4pH5jCsR4E94DWyqFJnGzGqXdL8Si4J4guPq/nether/test 6.json",
    saleState: "List",
    price: "1000000000000000000",
    owner: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    endTime: 0,
  },
];
const NFTProfile: NextPageWithLayout = () => {
  return (
    <div className={nftProfilePageContainer}>
      {dummyData.length !== 0 ? (
        <div className="nftCardContainer">
          {/* {dummyData.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))} */}
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No NFTs found yet
          </div>
        </>
      )}
    </div>
  );
};

NFTProfile.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <NFTProfilePageWrapper>{page}</NFTProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfile;

// styling
const nftProfilePageContainer = ctl(`
`);

const tabContentContainer = ctl(`
tabContent flex items-center justify-center w-full h-[250px]
`);

const tabContent = ctl(`
textGradient font-semibold leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl w-fit
`);

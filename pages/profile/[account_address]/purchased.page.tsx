// React, Next, NPM Packages
import Link from "next/link";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useProfileNFTStore } from "@/store/profile.nft.store";

// Current page imports
import { ProfilePageWrapper } from "./_components";
import NFTCard from "@/components/nft.card";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTProfilePageWrapper } from "./_components/nftprofile.page.wrapper";
import { useEffect } from "react";

let dummyData = [
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
  {
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551-17",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    tokenId: 17,
    creator: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    createTime: 1667817360,
    ipfs: "ipfs://QmQa6hJcCxcGRcs99r9DbH7dRaZruvx9HYigvk5xabZ9J2/nether/test 10.json",
    saleState: "List",
    price: "1000000000000000000",
    owner: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    endTime: 0,
  },
];
const NFTProfilePurchased: NextPageWithLayout = () => {
  const {account} = useWeb3React()
  const {
    listedNFTs,
    fetchListedNFTs,
    loading
  } = useProfileNFTStore((state) => ({
    listedNFTs: state.listedNfts,
    fetchListedNFTs: state.fetchListedNFTs,
    loading: state.loadingListedNFTs
  }))

  useEffect(() => {
    if(account) {
      fetchListedNFTs(account, 0, 1000)
    }
  }, [account, fetchListedNFTs])

  return (
    <div className={nftProfilePageContainer}>
      {listedNFTs.length !== 0 ? (
        <div className="nftCardContainer">
          {listedNFTs.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
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

NFTProfilePurchased.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <NFTProfilePageWrapper>{page}</NFTProfilePageWrapper>
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

import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { NFT } from "@/store/explore.store";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import NFTCard from "@/components/nft.card";
import HotNftsSkeleton from "@/components/loading.skeletons/hot.nfts";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { HotNftEmptyIcon } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";

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
  const { account } = useWeb3React();
  const {
    ownedNFTs,
    fetchOwnedNFTs,
    loadingOwnedNFTs,
    listedNFTs,
    fetchListedNFTs,
    loadingListedNFTs,
  } = useProfileNFTStore((state) => ({
    ownedNFTs: state.ownedNfts,
    fetchOwnedNFTs: state.fetchOwnedNFTs,
    loadingOwnedNFTs: state.loadingOwnedNFTs,
    listedNFTs: state.listedNfts,
    fetchListedNFTs: state.fetchListedNFTs,
    loadingListedNFTs: state.loadingListedNFTs,
  }));
  useEffect(() => {
    if (account) {
      fetchOwnedNFTs(account);
    }
  }, [account, fetchOwnedNFTs]);

  useEffect(() => {
    if (account) {
      fetchListedNFTs(account, 0, 1000);
    }
  }, [account, fetchListedNFTs]);

  const [displayNFTs, setDisplayNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    console.log(
      "sniper: loadingOwnedNFTs, loadingListedNFTs, listedNFTs, ownedNFTs",
      loadingOwnedNFTs,
      loadingListedNFTs,
      listedNFTs,
      ownedNFTs
    );
    if (loadingListedNFTs === "loaded" && loadingOwnedNFTs === "loaded") {
      setDisplayNFTs([...listedNFTs, ...ownedNFTs]);
    }
  }, [loadingOwnedNFTs, loadingListedNFTs, listedNFTs, ownedNFTs]);

  return (
    <>
      {displayNFTs.length > 0 && (
        <div className="nftCardContainer">
          {displayNFTs.map((nft: any) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
        </div>
      )}

      {(loadingOwnedNFTs === "loading" ||
        loadingListedNFTs === "loading" ||
        loadingOwnedNFTs === "idle" ||
        loadingListedNFTs === "idle") && (
        <div className="flex flex-wrap gap-10 items-center">
          <NftsSkeleton />
          <NftsSkeleton />
          <NftsSkeleton />
          <NftsSkeleton />
        </div>
      )}

      {/* {loadingOwnedNFTs !== "loaded" && (
        <>
          <div className="flex justify-center items-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No NFTs found yet
          </div>
        </>
      )} */}
    </>
  );
};

NFTProfile.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile">
      <div>{page}</div>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfile;

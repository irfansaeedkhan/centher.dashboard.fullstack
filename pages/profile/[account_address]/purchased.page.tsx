import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

// App imports
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { NFTCard } from "@/components/nft.card";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { HotNftEmptyIcon } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";

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
  const { account } = useWeb3React();
  const { listedNFTs, fetchListedNFTs, loading } = useProfileNFTStore(
    (state) => ({
      listedNFTs: state.listedNfts,
      fetchListedNFTs: state.fetchListedNFTs,
      loading: state.loadingListedNFTs,
    })
  );

  useEffect(() => {
    if (account) {
      fetchListedNFTs(account, 0, 1000);
    }
  }, [account, fetchListedNFTs]);

  return (
    <>
      {listedNFTs.length !== 0 ? (
        <div className="nftCardContainer">
          {listedNFTs.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex items-center justify-center text-[16px] font-semibold text-white">
            No NFTs found yet
          </div>
        </>
      )}
    </>
  );
};

NFTProfilePurchased.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile">{page}</ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfilePurchased;

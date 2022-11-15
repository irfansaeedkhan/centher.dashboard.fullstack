import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CollectionCard } from "@/components/collection.card";
import { HotNftEmptyIcon } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";

let dummyData = [
  {
    __typename: "Collection",
    collection: "0xa42f2d7af692ca6c8c65e17e358ec6d57657be48",
    creator: "0x1fd17298c4397f0def1e2cec0928a7ba6484462d",
    id: "0xa42f2d7af692ca6c8c65e17e358ec6d57657be48",
    ipfs: "ipfs://QmdoDxPBKscHwTkexgyFNYtDyGJnmQtNJstLH9Yz4SLqwB/nether/test collection.json",
    maxSupply:
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    name: "test collection",
    symbol: "test",
    totalSupply: "0",
    txTime: "1667821524",
  },
  {
    __typename: "Collection",
    collection: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    creator: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    id: "0x33ef9ab7c76f0604207ea05cead13b6c46fab551",
    ipfs: "ipfs://QmZU6vLL4egLyvJNMCdurTcV7NjKn4LwVEGZJrgQAQQaKq/nether/Moralis.json",
    maxSupply:
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    name: "Moralis",
    symbol: "MRN",
    totalSupply: "23",
    txTime: "1667595912",
  },
];

const NFTProfileCollections: NextPageWithLayout = () => {
  const { account } = useWeb3React();
  const { collections, fetchCollections, loading } = useProfileNFTStore(
    (state) => ({
      collections: state.collections,
      fetchCollections: state.fetchCollections,
      loading: state.loadingCollections,
    })
  );

  useEffect(() => {
    if (account) {
      fetchCollections(account);
    }
  }, [account, fetchCollections]);

  return (
    <>
      {collections && collections.length !== 0 ? (
        <div className="flex  gap-5 md:flex-wrap lg:flex-nowrap">
          {collections.map((collection) => {
            return <CollectionCard data={collection} key={collection.id} />;
          })}
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No collection found yet
          </div>
        </>
      )}
    </>
  );
};

NFTProfileCollections.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile">
      <div>{page}</div>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfileCollections;

import { useEffect, useMemo, useState } from "react";

import { NFT } from "@/models/nft";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { HotNftEmptyIcon } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";
import { useRouter } from "next/router";
import { NFTCard } from "@/components/nft.card";

const NFTProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);
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

      {loadingOwnedNFTs === "loaded" &&
        loadingListedNFTs === "loaded" &&
        listedNFTs.length === 0 &&
        ownedNFTs.length === 0 && (
          <>
            <div className="flex justify-center items-center text-white">
              <HotNftEmptyIcon />
            </div>
            <div className="flex justify-center items-center font-semibold text-[16px] text-white">
              No NFTs found yet
            </div>
          </>
        )}
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

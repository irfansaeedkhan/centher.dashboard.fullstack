// React, Next, NPM Packages
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { NFT } from "@/models/nft";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { NFTImageCard } from "@/components/nft.image.card";
import { HotNftEmptyIcon } from "@/assets/svgs";
import ProfileNftsLayout from "@/layouts/profile.nfts.layout";

const ListedNFTS: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);
  const { listedNFTs, fetchListedNFTs, loadingListedNFTs } = useProfileNFTStore(
    (state) => ({
      listedNFTs: state.listedNfts,
      fetchListedNFTs: state.fetchListedNFTs,
      loadingListedNFTs: state.loadingListedNFTs,
    })
  );

  useEffect(() => {
    if (account) {
      fetchListedNFTs(account, 0, 1000);
    }
  }, [account, fetchListedNFTs]);

  const [displayNFTs, setDisplayNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    if (loadingListedNFTs === "loaded") {
      setDisplayNFTs([...listedNFTs]);
    }
  }, [loadingListedNFTs, listedNFTs]);

  return (
    <>
      {displayNFTs.length > 0 && (
        <div
          className={clsx(
            ` grid gap-2  `,
            displayNFTs.length > 2
              ? "grid-cols-[repeat(auto-fit,_minmax(104px,_1fr))]  [@media(min-width:768px)]:grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]"
              : "grid-cols-[1fr,1fr,1fr] [@media(min-width:768px)]:grid-cols-[1fr,1fr] [@media(min-width:1440px)]:grid-cols-[1fr,1fr,1fr]"
          )}
        >
          {displayNFTs.map((nft) => (
            <NFTImageCard data={nft} key={nft.id} />
          ))}
        </div>
      )}
      {loadingListedNFTs === "loaded" && listedNFTs.length === 0 && (
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

ListedNFTS.getLayout = (page) => (
  <ProfileNftsLayout>
    <div>{page}</div>
  </ProfileNftsLayout>
);

export default ListedNFTS;

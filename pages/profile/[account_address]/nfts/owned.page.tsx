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

const OwnedNFTS: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);
  const { ownedNfts, fetchOwnedNFTs, loadingOwnedNFTs } = useProfileNFTStore(
    (state) => ({
      ownedNfts: state.ownedNfts,
      fetchOwnedNFTs: state.fetchOwnedNFTs,
      loadingOwnedNFTs: state.loadingOwnedNFTs,
    })
  );

  useEffect(() => {
    if (account) {
      fetchOwnedNFTs(account);
    }
  }, [account, fetchOwnedNFTs]);

  const [displayNFTs, setDisplayNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    if (loadingOwnedNFTs === "loaded") {
      setDisplayNFTs([...ownedNfts]);
    }
  }, [loadingOwnedNFTs, ownedNfts]);

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
      {loadingOwnedNFTs === "loaded" && ownedNfts.length === 0 && (
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

OwnedNFTS.getLayout = (page) => (
  <ProfileNftsLayout>
    <div>{page}</div>
  </ProfileNftsLayout>
);

export default OwnedNFTS;

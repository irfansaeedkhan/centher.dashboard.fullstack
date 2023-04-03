import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";

import { useAllNFTsStore } from "@/store/all.nfts.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { SectionTitle } from "@/pages/marketplace/_components";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NFTCard } from "@/components/nft.card";
import NFTsSkeleton from "@/components/loading.skeletons/nfts";
import { HotNftEmptyIcon } from "@/assets/svgs";

const AllNftsPage: NextPageWithLayout = () => {
  const [lastNFTRef, _lastNFTInView, lastNFTEntry] = useInView();
  const { nfts, offset, fetchNFTs, loading, updateOffset } = useAllNFTsStore(
    (state) => ({
      nfts: state.nfts,
      offset: state.offset,
      fetchNFTs: state.fetchNFTs,
      limit: state.limit,
      updateOffset: state.updateOffset,
      loading: state.loading,
    })
  );

  useEffect(() => {
    if (lastNFTEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastNFTRef, lastNFTEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchNFTs();
    }
  }, [offset, fetchNFTs]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return (
    <div className={`mx-auto max-w-screen-2xl space-y-4 fsm:space-y-6`}>
      <SectionTitle title="All NFTs" showViewAll={false} />

      <div
        className={clsx(
          `mx-auto grid max-w-max gap-5`,
          `[@media(min-width:1780px)]:grid-cols-[repeat(5,_minmax(280px,_1fr))]`,
          `[@media(min-width:1480px)_and_(max-width:1779px)]:grid-cols-[repeat(4,_minmax(280px,_1fr))]`,
          `[@media(min-width:1280px)_and_(max-width:1479px)]:grid-cols-[repeat(3,_minmax(280px,_1fr))]`,
          `[@media(min-width:1230px)_and_(max-width:1279px)]:grid-cols-[repeat(4,_minmax(280px,_1fr))]`,
          `[@media(min-width:930px)_and_(max-width:1229px)]:grid-cols-[repeat(3,_minmax(280px,_1fr))]`,
          `[@media(min-width:620px)_and_(max-width:929px)]:grid-cols-[repeat(2,_minmax(280px,_1fr))]`,
          `[@media(max-width:619px)]:grid-cols-[repeat(1,_minmax(280px,_1fr))]`
        )}
      >
        {nfts.map((nft) => {
          return <NFTCard data={nft} key={nft.id} />;
        })}

        {(loading === "loading" || loading === "idle") && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <NFTsSkeleton key={index} />
            ))}
          </>
        )}

        <div ref={lastNFTRef} />
      </div>

      {((loading === "loaded" && nfts.length === 0) ||
        loading === "failed") && (
        <>
          <div className="flex items-center justify-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex items-center justify-center text-[16px] font-semibold text-white">
            No NFTs found yet
          </div>
        </>
      )}
    </div>
  );
};

AllNftsPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="NFT">{page}</AllPagesWrapper>;
};

export default AllNftsPage;

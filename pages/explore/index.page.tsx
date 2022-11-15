// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "./_components";
import { useExploreStore } from "@/store/explore.store";
import Banner from "./_components/banner";
import TopCreators from "./_components/top.creators";

const MAX_HOT_NFTS = 10;
const MAX_COLLECTIONS = 10;

const ExplorePage: NextPageWithLayout = () => {
  // const collections = useCollections()
  const {
    hotNFTs,
    collections,
    allNFTs,
    fetchHotNFTs,
    fetchCollections,
    fetchAllNFTs,
    allNFTsOffset,
    updateOffset,
    limit,
    loadingHotNFTs,
    loadingCollections,
    loadingAllNFTs,
  } = useExploreStore((state) => ({
    hotNFTs: state.hotNFTs,
    collections: state.collections,
    allNFTs: state.allNFTs,
    fetchHotNFTs: state.fetchHotNFTs,
    fetchCollections: state.fetchCollections,
    fetchAllNFTs: state.fetchAllNFTs,
    allNFTsOffset: state.allNFTsOffset,
    updateOffset: state.updateOffset,
    limit: state.limit,
    loadingHotNFTs: state.loadingHotNFTs,
    loadingCollections: state.loadingCollections,
    loadingAllNFTs: state.loadingAllNFTs,
  }));
  const [lastNotiRef, lastNotiInView] = useInView();

  useEffect(() => {
    if (lastNotiInView) {
      updateOffset();
    }
  }, [lastNotiInView, updateOffset]);

  useEffect(() => {
    fetchAllNFTs(allNFTsOffset, limit);
  }, [fetchAllNFTs, allNFTsOffset, limit]);

  useEffect(() => {
    fetchHotNFTs(0, MAX_HOT_NFTS);
    fetchCollections(0, MAX_COLLECTIONS);
  }, [fetchHotNFTs, fetchCollections]);

  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Banner />
        <TopCreators />
        <HotNFTs loadingHotNFTs={loadingHotNFTs} hotNFTs={hotNFTs} />
        <HotCollections
          loadingCollections={loadingCollections}
          hotCollections={collections}
        />
        {/* <Explore loadingAllNFTs={loadingAllNFTs} allNFTs={allNFTs} /> */}
      </div>
    </div>
  );
};

ExplorePage.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Explore - Nether NFT">{page}</AllPagesWrapper>
  );
};

export default ExplorePage;

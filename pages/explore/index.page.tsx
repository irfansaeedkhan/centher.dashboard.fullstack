// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "./_components";
import { useExploreStore } from "@/store/explore.store";

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
  console.log(
    "loading state: ",
    loadingHotNFTs,
    loadingCollections,
    loadingAllNFTs
  );
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
    <div className="AppWrapper flex flex-col gap-10">
      <HotNFTs hotNFTs={hotNFTs} />
      <HotCollections hotCollections={collections} />
      <Explore allNFTs={allNFTs} />
    </div>
  );
};

ExplorePage.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Explore - Nether NFT">{page}</AllPagesWrapper>
  );
};

export default ExplorePage;


import { useEffect, useState } from "react";
// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { useAllNFTsStore } from "@/store/all.nfts.store";
import { Explore } from "./_components";
import { Category, SortBy } from "@/models/nft";

const MAX_HOT_NFTS = 10;

const AllNftsPage: NextPageWithLayout = () => {
  const [categoryInView, setCategory] = useState<Category>("all");
  const [sortByInView, setSortBy] = useState<SortBy>("recently created");
  
  const { allNFTs, category, sortBy, offset, limit, fetchAllNFTs, updateCategory, updateSortBy, updateOffset, loading } = useAllNFTsStore(
    (state) => ({
      allNFTs: state.allNFTs,
      category: state.category,
      sortBy: state.sortBy,
      offset: state.offset,
      limit: state.limit,
      fetchAllNFTs: state.fetchAllNFTs,
      updateCategory: state.updateCategory,
      updateSortBy: state.updateSortBy,
      updateOffset: state.updateOffset,
      loading: state.loading,
    })
  );

  useEffect(() => {
    fetchAllNFTs(category, sortBy, offset, limit);
  }, [fetchAllNFTs, limit, offset, category, sortBy]);

  useEffect(() => {
    updateCategory(categoryInView)
  }, [categoryInView, updateCategory])

  useEffect(() => {
    updateSortBy(sortByInView)
  }, [sortByInView, updateSortBy])

  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Explore loading={loading} allNFTs={allNFTs} category={categoryInView} sortBy={sortByInView} setCategory={setCategory} setSortBy={setSortBy}/>
      </div>
    </div>
  );
};

AllNftsPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="NFT">{page}</AllPagesWrapper>;
};

export default AllNftsPage;

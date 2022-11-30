import { useEffect, useState } from "react";
// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { useAllNFTsStore } from "@/store/all.nfts.store";

import {
  Category,
  OrderBy,
  OrderDirection,
  sortBy,
  SortBy,
} from "@/models/nft";
import { useInView } from "react-intersection-observer";
import { Explore } from "./_components";

const MAX_HOT_NFTS = 10;

const AllNftsPage: NextPageWithLayout = () => {
  const [categoryInView, setCategory] = useState<Category>("all");
  const [sortByInView, setSortBy] = useState<SortBy>("recently created");
  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();

  const {
    allNFTs,
    category,
    sortByInStore,
    sortDir,
    offset,
    fetchAllNFTs,
    updateCategory,
    updateSortBy,
    loading,
    updateOffset,
  } = useAllNFTsStore((state) => ({
    allNFTs: state.allNFTs,
    category: state.category,
    sortByInStore: state.sortBy,
    sortDir: state.sortDir,
    offset: state.offset,
    limit: state.limit,
    fetchAllNFTs: state.fetchAllNFTs,
    updateCategory: state.updateCategory,
    updateSortBy: state.updateSortBy,
    updateOffset: state.updateOffset,
    loading: state.loading,
  }));

  useEffect(() => {
    fetchAllNFTs(category, sortByInStore, sortDir);
  }, [fetchAllNFTs]);

  useEffect(() => {
    if (offset > 0) {
      fetchAllNFTs(category, sortByInStore, sortDir);
    }
  }, [offset, fetchAllNFTs, category, sortByInStore, sortDir]);

  useEffect(() => {
    updateCategory(categoryInView);
  }, [categoryInView, updateCategory]);

  useEffect(() => {
    let _sortBy: OrderBy = "createTime";
    let _sortDir: OrderDirection = "desc";
    if (sortByInView.toLowerCase() === sortBy[0]) {
      _sortBy = "createTime";
    } else if (sortByInView.toLowerCase() === sortBy[1]) {
      _sortBy = "tradingVolumn";
      _sortDir = "desc";
    } else if (sortByInView.toLowerCase() === sortBy[2]) {
      _sortBy = "tradingVolumn";
      _sortDir = "asc";
    } else if (sortByInView.toLowerCase() === sortBy[3]) {
      _sortBy = "price";
      _sortDir = "desc";
    } else if (sortByInView.toLowerCase() === sortBy[4]) {
      _sortBy = "price";
      _sortDir = "asc";
    }
    updateSortBy(_sortBy, _sortDir);
  }, [sortByInView, updateSortBy]);

  useEffect(() => {
    if (lastPostEntry?.isIntersecting) {
      console.log("first");
      updateOffset();
    }
  }, [lastPostRef, lastPostEntry, updateOffset]);

  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Explore
          ref={lastPostRef}
          loading={loading}
          allNFTs={allNFTs}
          category={category}
          sortBy={sortByInView}
          setCategory={setCategory}
          setSortBy={setSortBy}
        />
      </div>
    </div>
  );
};

AllNftsPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="NFT">{page}</AllPagesWrapper>;
};

export default AllNftsPage;

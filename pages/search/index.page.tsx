import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useSearchStore } from "@/store/search.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import { UserWithFollow } from "./_components";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";
import { SearchUserIcon } from "@/assets/svgs";
import Searchbar from "./_components/search.bar";

const Search: NextPageWithLayout = () => {
  // For infinite scrolling
  const {
    searchQuery,
    searchOffset,
    searchLoadingState,
    searchResults,
    fetchSearchResults,
    updateSearchOffset,
    resetSearchResults,
  } = useSearchStore((state) => ({
    searchQuery: state.searchQuery,
    searchOffset: state.searchOffset,
    searchLoadingState: state.searchLoadingState,
    searchResults: state.searchResults,
    fetchSearchResults: state.fetchSearchResults,
    updateSearchOffset: state.updateSearchOffset,
    resetSearchResults: state.resetSearchResults,
  }));

  const { ref: lastResultRef, entry: lastResultEntry } = useInView();

  useEffect(() => {
    if (lastResultEntry?.isIntersecting) {
      updateSearchOffset();
    }
  }, [updateSearchOffset, lastResultEntry]);

  useEffect(() => {
    if (searchOffset > 0) {
      fetchSearchResults();
    }
  }, [fetchSearchResults, searchOffset]);

  useEffect(() => {
    if (searchQuery) {
      resetSearchResults("loading");
      fetchSearchResults();
    }
  }, [searchQuery, resetSearchResults, fetchSearchResults]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-4 block w-full md:hidden">
        <div className={`animationTextHeading mb-2 text-2xl`}>Search</div>
        <Searchbar />
      </div>
      {searchQuery.trim() !== "" && (
        <div className="fxs:w-full md:w-[544px]">
          <div className={`animationTextHeading mb-4 text-xl fmd:text-2xl`}>
            Search Result
          </div>
          <div className="flex flex-col gap-3">
            {searchResults.length > 0 &&
              searchResults.map((result, i) => {
                if (i === searchResults.length - 1) {
                  return (
                    <UserWithFollow
                      key={result._id}
                      result={result}
                      ref={lastResultRef}
                    />
                  );
                }
                return <UserWithFollow key={result._id} result={result} />;
              })}

            {(searchLoadingState === "loading" ||
              searchLoadingState === "idle") && <SearchUserSkeleton />}

            {searchLoadingState === "loaded" && searchResults.length === 0 && (
              <div>
                <div className="mt-10 flex justify-center">
                  <SearchUserIcon />
                </div>
                <div className="mt-8 flex justify-center text-xl font-semibold text-white">
                  <p>Sorry! No Result Found</p>
                </div>
              </div>
            )}

            {searchLoadingState === "failed" && (
              <div className="font-semibold text-brand-primary">
                Something went wrong!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Search.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Search">{page}</AllPagesWrapper>;
};

export default Search;

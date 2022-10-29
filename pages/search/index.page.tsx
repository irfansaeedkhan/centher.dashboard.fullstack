import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useSearchStore } from "@/store/search.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import { UserWithFollow } from "./_components";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";

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
    <div className="w-full flex justify-center">
      <div className="md:w-[544px] sm:w-full">
        <div
          className={`animationTextHeading mb-8 lg:!text-[34px] md:!text-3xl sm:!text-2xl`}
        >
          Search Result:
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

          {searchResults.length <= 0 && searchLoadingState === "loaded" && (
            <div className="text-brand-primary font-semibold">
              There is no result for this query!
            </div>
          )}

          {(searchLoadingState === "loading" ||
            searchLoadingState === "idle") && <SearchUserSkeleton />}

          {searchLoadingState === "failed" && (
            <div className="text-brand-primary font-semibold">
              Something went wrong!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Search.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Search">{page}</AllPagesWrapper>;
};

export default Search;

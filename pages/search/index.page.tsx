import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useSearchStore } from "@/store/search.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";
import { SearchUserIcon } from "@/assets/svgs";
import { BackButton } from "@/components/button/back-button";
import { UserWithFollow } from "./_components";
import Searchbar from "./_components/search.bar";

// Portfolio-library fix (2026-10-29): the backend /api/search returns
// people only (see lib/search/types.ts — SearchResult is a user shape),
// so a query like "Explainer" found nothing even though matching posts,
// NFTs, collections and launchpad rounds exist. There is no backend
// endpoint that searches those categories, and results must not be
// faked — so the page now labels the tabs honestly: People searches
// live, the other tabs say plainly that their search is not available
// yet and link to the browse surface instead.
type SearchTab = "people" | "posts" | "nfts" | "collections" | "launchpad";

const SEARCH_TABS: { id: SearchTab; label: string; browse: string }[] = [
  { id: "people", label: "People", browse: "/search" },
  { id: "posts", label: "Posts", browse: "/feed" },
  { id: "nfts", label: "NFTs", browse: "/marketplace" },
  { id: "collections", label: "Collections", browse: "/marketplace" },
  { id: "launchpad", label: "Launchpad", browse: "/launchpad/launchpad-list" },
];

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
  const [activeTab, setActiveTab] = useState<SearchTab>("people");

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
    <>
      <BackButton />
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
            <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Search categories">
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white"
                      : "bg-elevation-1 text-gray-shade-7 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab !== "people" ? (
              <div>
                <div className="mt-10 flex justify-center">
                  <SearchUserIcon />
                </div>
                <div className="mt-8 text-center text-xl font-semibold text-white">
                  <p>
                    {SEARCH_TABS.find((t) => t.id === activeTab)?.label}{" "}
                    search is not available yet
                  </p>
                </div>
                <p className="mt-3 text-center text-sm text-gray-shade-7">
                  Search currently covers people only, so a matching{" "}
                  {activeTab === "launchpad" ? "round" : activeTab.slice(0, -1)}{" "}
                  will not appear here. Browse{" "}
                  {SEARCH_TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}{" "}
                  instead:
                </p>
                <div className="mt-4 flex justify-center">
                  <Link
                    href={
                      SEARCH_TABS.find((t) => t.id === activeTab)?.browse ??
                      "/feed"
                    }
                    className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    Browse{" "}
                    {SEARCH_TABS.find((t) => t.id === activeTab)?.label}
                  </Link>
                </div>
              </div>
            ) : (
            <div className="flex flex-col">
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

              {searchLoadingState === "loaded" &&
                searchResults.length === 0 && (
                  <div>
                    <div className="mt-10 flex justify-center">
                      <SearchUserIcon />
                    </div>
                    <div className="mt-8 flex justify-center text-xl font-semibold text-white">
                      <p>Sorry! No Result Found</p>
                    </div>
                    <p className="mt-3 text-center text-sm text-gray-shade-7">
                      No people matched. Posts, NFTs, collections and
                      launchpad rounds are not searchable yet — see the
                      tabs above.
                    </p>
                  </div>
                )}

              {searchLoadingState === "failed" && (
                <div className="textGradient font-semibold">
                  Something went wrong!
                </div>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

Search.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Search">{page}</AllPagesWrapper>;
};

export default Search;

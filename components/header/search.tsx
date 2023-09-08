import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { useSearchStore } from "@/store/search.store";
import { SearchIcon } from "@/assets/svgs";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import {
  SearchPopupData,
  createRecentSearch,
  getRecentSearch,
  search,
  deleteAllRecentSearch,
  deleteSingleRecentSearch,
} from "@/lib/search";
import { LoadingState } from "@/models/common";
import { DeleteRecentSearchModal } from "./delete.recent.search.modal";
import SearchPopupResult from "./search.popup.result";

const SearchBar: React.FC = () => {
  const router = useRouter();

  const { setSearchQuery } = useSearchStore((state) => ({
    setSearchQuery: state.setSearchQuery,
  }));

  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [result, setResult] = useState<SearchPopupData>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>("idle");

  const hasRecentSearches = result.some(
    (item) => item.type === "recent_search"
  );
  const isResultEmpty = result.length === 0;

  const searchAbortControllerRef = useRef<AbortController | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setOpenPopup(false);
  });
  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q.toString());
      setSearchQueryInput(router.query.q.toString());
    } else {
      setSearchQuery("");
      setSearchQueryInput("");
    }
  }, [router.query.q, setSearchQuery]);

  const submitData: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (searchQueryInput.trim() === "") {
      return;
    }

    setSearchQuery(searchQueryInput);
    createRecentSearchHandler(searchQueryInput);

    router.push({
      pathname: AppRoutes.search,
      query: { q: searchQueryInput.trim() },
    });
  };

  const inputFocusHandler = async () => {
    try {
      setLoading("loading");
      setOpenPopup(true);
      const recentSearchResults = await getRecentSearch();
      setResult(recentSearchResults);
      setLoading("loaded");
    } catch (error) {
      customLog(["development"], error);
      setLoading("failed");
    }
  };

  const handleSearchQueryInput: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    setSearchQueryInput(e.target.value);
    if (e.target.value.trim() === "") {
      try {
        const recentSearchResults = await getRecentSearch();
        setResult(recentSearchResults);
        setOpenPopup(true);
      } catch (error) {
        customLog(["development"], error);
      }
    } else {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      searchAbortControllerRef.current = new AbortController();

      try {
        const searchResults = await search(e.target.value);
        setResult(searchResults);

        if (searchResults.length > 0 && e.target.value.trim() !== "") {
          setOpenPopup(true);
        } else {
          setOpenPopup(false);
        }
      } catch (error) {
        customLog(["development"], error);
      }
    }
  };

  const createRecentSearchHandler = async (query: string) => {
    try {
      await createRecentSearch(query);
    } catch (error) {
      customLog(["development"], error);
    }
  };

  const deleteAllRecentSearchHandler = async () => {
    try {
      await deleteAllRecentSearch();
      setResult([]);
    } catch (error) {
      customLog(["development"], error);
    }
  };

  const deleteSingleRecentSearchHandler = async (searchId: string) => {
    try {
      await deleteSingleRecentSearch(searchId);
      setResult((prev) => prev.filter((item) => item._id !== searchId));
    } catch (error) {
      customLog(["development"], error);
    }
  };

  return (
    <form
      className="relative hidden w-full max-w-[528px] md:block"
      onSubmit={submitData}
    >
      <div
        ref={ref}
        className="focus-within:gradient-border-3 !rounded-lg p-[1px]"
      >
        <div className="flex items-center gap-2 rounded-xl bg-[#1E212B] px-3 py-2 ">
          <input
            type="text"
            placeholder="Search"
            className="w-full border-0 bg-transparent p-0 text-white focus:outline-none focus:ring-0"
            value={searchQueryInput}
            onChange={(e) => handleSearchQueryInput(e)}
            onFocus={() => inputFocusHandler()}
          />
          <button type="submit">
            <SearchIcon />
          </button>
        </div>
        {openPopup && (
          <div className="absolute left-0 top-12 z-[200] h-auto max-h-[400px] w-full rounded-xl bg-background-shade-3">
            {/* only show when we have recent-search */}
            {loading === "loaded" && hasRecentSearches && (
              <div className="flex items-center justify-between pl-5 pr-5 pt-2">
                <div className=" text-lg font-medium text-white">Recent</div>
                <div
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="textGradient cursor-pointer text-xs font-medium"
                >
                  Clear All
                </div>
              </div>
            )}

            {loading === "loaded" && isResultEmpty && (
              <div className="p-6 text-center text-gray-shade-2">
                Try searching for people
              </div>
            )}

            {loading === "loaded" && (
              <div>
                {result.map((item) => (
                  <SearchPopupResult
                    item={item}
                    key={item._id}
                    deleteSingleRecentSearchHandler={
                      deleteSingleRecentSearchHandler
                    }
                    setOpenPopup={setOpenPopup}
                    setSearchQueryInput={setSearchQueryInput}
                    createRecentSearchHandler={createRecentSearchHandler}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <DeleteRecentSearchModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteAllRecentSearchHandler}
      />
    </form>
  );
};

export default SearchBar;

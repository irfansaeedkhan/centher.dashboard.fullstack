import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { useOnClickOutside } from "usehooks-ts";
import { useSearchStore } from "@/store/search.store";
import { SearchIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { customLog } from "@/utils/custom.log";
import {
  RecentSearchWithType,
  SearchPopupData,
  SearchResultWithType,
  SearchType,
  createRecentSearch,
  getRecentSearch,
  search,
  deleteAllRecentSearch,
  deleteSingleRecentSearch,
} from "@/lib/search";
import { DeleteRecentSearchModal } from "@/components/header/delete.recent.search.modal";
import { LoadingState } from "@/models/common";

const Searchbar = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q.toString());
      setSearchQueryInput(router.query.q.toString());
    } else {
      setSearchQuery("");
      setSearchQueryInput("");
    }
  }, [router.query.q, setSearchQuery]);

  useOnClickOutside(ref, () => {
    setOpenPopup(false);
  });

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
    <form className="relative w-full" onSubmit={submitData}>
      <div className="focus-within:gradient-border-3 flex items-center gap-2 !rounded-lg bg-background-shade-3 p-[1px] ">
        <input
          type="text"
          placeholder="Search"
          className="w-full border-0 bg-transparent p-0 px-3 py-2 text-white focus:outline-none focus:ring-0"
          value={searchQueryInput}
          onChange={(e) => handleSearchQueryInput(e)}
          onFocus={() => inputFocusHandler()}
        />
        <button type="submit" className="pr-2">
          <SearchIcon />
        </button>
        {openPopup && (
          <div
            ref={ref}
            className="absolute left-0 top-12 z-[200] h-auto max-h-[400px] w-full rounded-xl bg-background-shade-3 shadow-md"
          >
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
                {result.map((item) => {
                  return (
                    <SearchResultItem
                      item={item}
                      key={item._id}
                      onClick={() => {
                        setSearchQueryInput("");
                        setOpenPopup(false);
                      }}
                      deleteSingleRecentSearchHandler={
                        deleteSingleRecentSearchHandler
                      }
                      createRecentSearchHandler={createRecentSearchHandler}
                      setSearchQueryInput={setSearchQueryInput}
                      setOpenPopup={setOpenPopup}
                    />
                  );
                })}
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

export default Searchbar;

interface SearchResultItemProps {
  item: SearchResultWithType | RecentSearchWithType;
  onClick: () => void;
  createRecentSearchHandler: (query: string) => void;
  setSearchQueryInput: (value: string) => void;
  setOpenPopup: (value: boolean) => void;
  deleteSingleRecentSearchHandler: (query: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  onClick,
  createRecentSearchHandler,
  setSearchQueryInput,
  setOpenPopup,
  deleteSingleRecentSearchHandler,
}) => {
  const verificationTick = useVerificationTick({
    user: item.type === SearchType.search_result ? item : null,
  });

  const handleItemClick = () => {
    if (item.type === SearchType.search_result) {
      createRecentSearchHandler(item.display_name);
    }
    setSearchQueryInput(""); // Clear the search input
    setOpenPopup(false); // Close the search result popup
  };

  return (
    <div className="flex items-start gap-2 p-4">
      {/* <SearchIcon /> */}
      {item.type === SearchType.search_result ? (
        <Link
          onClick={() => {
            handleItemClick();
            onClick();
          }}
          href={{
            pathname: AppRoutes.profile.user_id,
            query: { user_id: item._id },
          }}
          className={clsx(
            `word-break flex w-full items-center truncate text-sm font-medium text-white hover:text-brand-primary`
          )}
        >
          <span
            title={item.display_name}
            className={clsx(`block overflow-hidden truncate`)}
          >
            {sliceDisplayName(item.display_name)}
          </span>
          {!!verificationTick && (
            <span className="verifiedIcon ml-0.5 inline-block h-5 w-5 min-w-[1.25rem]  fsm:ml-1">
              <Image
                src={verificationTick}
                alt={
                  item.membership.status === "citizen" ? "Citizen" : "Verified"
                }
                width={16}
                height={16}
              />
            </span>
          )}
        </Link>
      ) : (
        <>
          <SearchIcon className="shrink-0" />
          <Link
            className="word-break flex flex-grow items-center truncate text-sm font-medium text-white hover:text-brand-primary"
            onClick={() => handleItemClick()}
            href={{
              pathname: AppRoutes.search,
              query: {
                q: item.query,
              },
            }}
          >
            <span
              title={item.query}
              className={clsx(`block w-full overflow-hidden truncate`)}
            >
              {item.query}
            </span>
          </Link>
          <IoClose
            onClick={() => {
              deleteSingleRecentSearchHandler(item._id);
            }}
            className="shrink-0 cursor-pointer text-white"
          />
        </>
      )}
    </div>
  );
};

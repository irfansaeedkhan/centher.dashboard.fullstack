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
  SearchPopupItem,
  SearchResponseType,
  createRecentSearch,
  getRecentSearch,
  search,
  deleteAllRecentSearch,
  deleteSingleRecentSearch,
  CreateRecentSearchParams,
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
  const [result, setResult] = useState<SearchPopupItem[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>("idle");

  const hasRecentSearches = result.some(
    (item) => item.response_type === "recent_search"
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
    createRecentSearchHandler({
      search_type: "query",
      query: searchQueryInput.trim(),
    });

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

  const createRecentSearchHandler = async (data: CreateRecentSearchParams) => {
    try {
      await createRecentSearch(data);
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
            className="absolute left-0 top-12 z-[200] h-auto max-h-[400px] w-full overflow-y-auto rounded-xl bg-background-shade-3 shadow-md"
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
  item: SearchPopupItem;
  createRecentSearchHandler: (data: CreateRecentSearchParams) => void;
  setSearchQueryInput: (value: string) => void;
  setOpenPopup: (value: boolean) => void;
  deleteSingleRecentSearchHandler: (query: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  createRecentSearchHandler,
  setSearchQueryInput,
  setOpenPopup,
  deleteSingleRecentSearchHandler,
}) => {
  const router = useRouter();
  const verificationTick = useVerificationTick({
    user:
      item.response_type === SearchResponseType.search_result
        ? item
        : item.response_type === SearchResponseType.recent_search &&
          item.search_type === "user"
        ? item.user_data
        : null,
  });

  const handleItemClick = () => {
    if (item.response_type === SearchResponseType.search_result) {
      createRecentSearchHandler({
        search_type: "user",
        searched_user: item._id,
      });
    }
    setSearchQueryInput("");
    setOpenPopup(false);
  };

  return (
    <div className="group flex items-center gap-2 p-4">
      {item.response_type === SearchResponseType.recent_search &&
        item.search_type === "user" && (
          <>
            {item.user_data.profile_image && (
              <Image
                src={item.user_data.profile_image}
                alt={item.user_data.display_name}
                width={40}
                height={40}
                className={`mr-2 h-[40px] w-[40px] cursor-pointer rounded-full object-cover`}
                sizes={"256px"}
                onClick={() => {
                  handleItemClick();
                  router.push({
                    pathname: AppRoutes.profile.user_id,
                    query: {
                      user_id: item.user_data._id,
                    },
                  });
                }}
              />
            )}
            <Link
              className="word-break flex w-full flex-grow cursor-pointer items-center truncate text-sm font-medium text-white"
              onClick={() => handleItemClick()}
              href={{
                pathname: AppRoutes.profile.user_id,
                query: {
                  user_id: item.user_data._id,
                },
              }}
            >
              <span
                title={item.user_data.display_name}
                className={clsx(
                  `group-hover:textGradient block overflow-hidden truncate`
                )}
              >
                {item && sliceDisplayName(item.user_data.display_name)}
              </span>
              {verificationTick && (
                <span className="verifiedIcon ml-0.5 inline-flex h-[22px] w-[22px] min-w-[22px] fsm:ml-1">
                  <Image
                    src={verificationTick}
                    alt={
                      item.user_data.membership.status === "citizen"
                        ? "Citizen"
                        : "Verified"
                    }
                    width={16}
                    height={16}
                  />
                </span>
              )}
            </Link>
            <IoClose
              onClick={() => {
                deleteSingleRecentSearchHandler(item._id);
              }}
              className="cursor-pointer text-white"
            />
          </>
        )}

      {item.response_type === SearchResponseType.recent_search &&
        item.search_type !== "user" && ( // Not using `item.search_type === "query"` because in old data it might not be present
          <>
            <SearchIcon />
            <Link
              className="word-break flex flex-grow cursor-pointer items-center truncate text-sm font-medium text-white"
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
                className={clsx(
                  `group-hover:textGradient block w-full overflow-hidden truncate`
                )}
              >
                {item.query}
              </span>
            </Link>
            <IoClose
              onClick={() => {
                deleteSingleRecentSearchHandler(item._id);
              }}
              className="cursor-pointer text-white"
            />
          </>
        )}

      {item.response_type === SearchResponseType.search_result && (
        <>
          {item.profile_image && (
            <Image
              src={item.profile_image}
              alt={item.display_name}
              width={40}
              height={40}
              className={`mr-2 h-[40px] w-[40px] cursor-pointer rounded-full object-cover`}
              sizes={"256px"}
              onClick={() => {
                handleItemClick();
                router.push({
                  pathname: AppRoutes.profile.user_id,
                  query: {
                    user_id: item._id,
                  },
                });
              }}
            />
          )}
          <Link
            className="word-break flex w-full flex-grow cursor-pointer items-center truncate text-sm font-medium text-white"
            onClick={() => handleItemClick()}
            href={{
              pathname: AppRoutes.profile.user_id,
              query: {
                user_id: item._id,
              },
            }}
          >
            <span
              title={item.display_name}
              className={clsx(
                `group-hover:textGradient block overflow-hidden truncate`
              )}
            >
              {item && sliceDisplayName(item.display_name)}
            </span>
            {verificationTick && (
              <span className="verifiedIcon ml-0.5 inline-flex h-[22px] w-[22px] min-w-[22px] fsm:ml-1">
                <Image
                  src={verificationTick}
                  alt={
                    item.membership.status === "citizen"
                      ? "Citizen"
                      : "Verified"
                  }
                  width={16}
                  height={16}
                />
              </span>
            )}
          </Link>
        </>
      )}
    </div>
  );
};

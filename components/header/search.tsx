import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSearchStore } from "@/store/search.store";
import { axiosNodeApi } from "@/utils/axios";
import { SearchIcon } from "@/assets/svgs";
import { useOnClickOutside } from "usehooks-ts";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";

const SearchBar = () => {
  const router = useRouter();

  const { setSearchQuery } = useSearchStore((state) => ({
    setSearchQuery: state.setSearchQuery,
  }));

  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [result, setResult] = useState([]);

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
      setOpenPopup(false);
    } else {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      searchAbortControllerRef.current = new AbortController();

      await axiosNodeApi
        .get(`/api/search?q=${e.target.value}&limit=5&offset=0`, {
          signal: searchAbortControllerRef.current.signal,
        })
        .then((res) => {
          setResult(res.data.search_results);

          if (
            res.data.search_results.length > 0 &&
            e.target.value.trim() !== ""
          ) {
            setOpenPopup(true);
          } else {
            setOpenPopup(false);
          }
        })
        .catch((e) => {
          customLog(e, ["development"]);
        });
    }
  };

  return (
    <form
      className="relative w-full max-w-[528px] md:block hidden"
      onSubmit={submitData}
    >
      <div
        ref={ref}
        className="flex gap-2 items-center bg-[#1E212B] px-3 py-2 rounded-xl focus-within:ring-1 focus-within:ring-brand-primary"
      >
        <input
          type="text"
          placeholder="Search"
          className="focus:outline-none p-0 focus:ring-0 w-full text-white bg-transparent border-0"
          value={searchQueryInput}
          onChange={(e) => handleSearchQueryInput(e)}
        />
        <button type="submit">
          <SearchIcon />
        </button>
        {openPopup && (
          <div className="absolute top-12 left-0 max-h-[400px] h-auto w-full bg-background-shade-3 rounded-xl z-[200]">
            <div>
              {result.map((item: any, i) => {
                return (
                  <div key={i} className="p-5 flex gap-2 items-center">
                    <SearchIcon />
                    <Link
                      onClick={() => {
                        setSearchQueryInput("");
                        setOpenPopup(false);
                      }}
                      href={`/profile/${item.account_address}`}
                    >
                      <p className="text-white text-sm font-medium hover:text-brand-primary">
                        {item.display_name}
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { useSearchStore } from "@/store/search.store";
import { axiosApiCenther } from "@/utils/axios";
import { SearchIcon } from "@/assets/svgs";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import SearchPopupResult from "./search.popup.result";

interface Props {}

const SearchBar: React.FC<Props> = () => {
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

      await axiosApiCenther
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
          customLog(["development"], e);
        });
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
          />
          <button type="submit">
            <SearchIcon />
          </button>
        </div>
        {openPopup && (
          <div className="absolute left-0 top-12 z-[200] h-auto max-h-[400px] w-full rounded-xl bg-background-shade-3">
            <div>
              {result.map((item: any, i) => (
                <SearchPopupResult
                  user={item}
                  key={item._id}
                  setOpenPopup={setOpenPopup}
                  setSearchQueryInput={setSearchQueryInput}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

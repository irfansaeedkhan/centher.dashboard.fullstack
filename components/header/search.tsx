import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSearchStore } from "@/store/search.store";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { axiosNodeApi } from "@/utils/axios";
import useGetUser from "@/hooks/use.get.user";
import { SearchIcon } from "@/assets/svgs";
import { useOnClickOutside } from "usehooks-ts";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { User } from "@/models/user";

import SearchPopupResult from "./search.popup.result";

interface Props {
  ver_user: User;
}

const SearchBar: React.FC<Props> = ({ ver_user }) => {
  const router = useRouter();

  const { setSearchQuery } = useSearchStore((state) => ({
    setSearchQuery: state.setSearchQuery,
  }));
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

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
      className="relative hidden w-full max-w-[528px] md:block"
      onSubmit={submitData}
    >
      <div
        ref={ref}
        className="flex items-center gap-2 rounded-xl bg-[#1E212B] px-3 py-2 focus-within:ring-1 focus-within:ring-brand-primary"
      >
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
        {openPopup && (
          <div className="absolute top-12 left-0 z-[200] h-auto max-h-[400px] w-full rounded-xl bg-background-shade-3">
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

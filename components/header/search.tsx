import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useSearchStore } from "@/store/search.store";
import { SearchIcon } from "@/assets/svgs";

const Search = () => {
  const router = useRouter();

  const { setSearchQuery } = useSearchStore((state) => ({
    setSearchQuery: state.setSearchQuery,
  }));

  const [searchQueryInput, setSearchQueryInput] = useState("");

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
    router.push(`/search?q=${searchQueryInput.trim()}`);
  };

  return (
    <form className="relative" onSubmit={submitData}>
      <div
        className="flex gap-2 items-center bg-[#1E212B] xl:max-w-[500px] xl:min-w-[400px] w-auto lg:max-w-[400px] lg:min-w-[300px] md:max-w-[300px] md:min-w-[200px] h-[44px] px-3 py-2 rounded-xl focus-within:ring-1
  focus-within:ring-brand-primary"
      >
        <input
          type="text"
          placeholder="Search"
          className="focus:outline-none p-0 focus:ring-0 w-full text-white bg-transparent border-0"
          value={searchQueryInput}
          onChange={(e) => setSearchQueryInput(e.target.value)}
        />
        <button type="submit">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
};

export default Search;

import { SearchIcon } from "@/assets/svgs";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value);
  };

  const submitData: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return;
    }
    router.push(`/search?q=${searchQuery.trim()}`);
    setSearchQuery("");
  };

  return (
    <form className="relative" onSubmit={submitData}>
      <div
        className="flex gap-2 items-center bg-[#1E212B] xl:max-w-[500px] xl:min-w-[400px] w-auto lg:max-w-[400px] lg:min-w-[300px] md:max-w-[300px] md:min-w-[200px] h-[44px] px-3 py-2 rounded-xl md:flex sm:hidden focus-within:ring-1
  focus-within:ring-brand-primary"
      >
        <input
          type="text"
          placeholder="Search"
          className="focus:outline-none p-0 focus:ring-0 w-full text-white bg-transparent border-0"
          value={searchQuery}
          onChange={handleChange}
        />
        <button type="submit">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
};

export default Search;

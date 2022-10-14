import { SearchIcon } from "@/assets/svgs";
import React from "react";

const Search = () => {
  return (
    <div className="relative">
      <div className="flex gap-2 items-center bg-[#1E212B] xl:max-w-[500px] xl:min-w-[400px] w-auto  lg:max-w-[400px] lg:min-w-[300px] md:max-w-[300px] md:min-w-[200px] h-[44px] px-3 py-2 rounded-xl md:flex sm:hidden ">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search"
          className="focus:outline-none p-0 focus:ring-0 w-full text-white bg-transparent border-0"
          // onChange={handleChangeLarge}
        />
      </div>
    </div>
  );
};

export default Search;

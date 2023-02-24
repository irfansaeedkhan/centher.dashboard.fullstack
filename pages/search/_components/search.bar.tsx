import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

import { useSearchStore } from "@/store/search.store";
import { axiosNodeApi } from "@/utils/axios";
import { SearchIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { IUserWithFollow } from ".";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import Image from "next/image";

const Searchbar = () => {
  const router = useRouter();

  const { setSearchQuery } = useSearchStore((state) => ({
    setSearchQuery: state.setSearchQuery,
  }));

  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [result, setResult] = useState<IUserWithFollow[]>([]);

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
      await axiosNodeApi
        .get(`/api/search?q=${e.target.value}&limit=5&offset=0`)
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
        });
    }
  };

  return (
    <form className="relative w-full" onSubmit={submitData}>
      <div className="flex items-center gap-2 rounded-xl bg-background-shade-3 px-3 py-2 focus-within:ring-1 focus-within:ring-brand-primary">
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
          <div className="absolute top-12 left-0 z-[200] h-auto max-h-[400px] w-full rounded-xl bg-background-shade-3 shadow-md">
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
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default Searchbar;

interface SearchResultItemProps {
  item: IUserWithFollow;
  onClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  onClick,
}) => {
  const verificationTick = useVerificationTick(item);

  return (
    <div className="flex items-start gap-2 p-4">
      {/* <SearchIcon /> */}
      <Link
        onClick={onClick}
        href={`/profile/${item.account_address}`}
        className={clsx(
          ` inline-block  break-words  text-center text-sm font-medium  text-white  hover:text-brand-primary  
          ${
            !item.display_name.includes(" ") &&
            item.display_name.length > 20 &&
            " w-[68vw] md:w-full "
          }`
        )}
      >
        <span title={item.display_name}>
          {sliceDisplayName(item.display_name)}
        </span>
        {!!verificationTick && (
          <span className="verifiedIcon ml-0.5 inline-block h-5 w-5 fsm:ml-1">
            <Image
              src={verificationTick}
              alt={"Verified"}
              width={20}
              height={20}
              className="mt-[4px]"
            />
          </span>
        )}
      </Link>
    </div>
  );
};

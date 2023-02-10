import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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
      <div className="flex gap-2 items-center bg-background-shade-3 px-3 py-2 rounded-xl focus-within:ring-1 focus-within:ring-brand-primary">
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
          <div className="absolute top-12 left-0 max-h-[400px] h-auto w-full bg-background-shade-3 rounded-xl z-[200] shadow-md">
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
    <div className="p-4 flex gap-2 items-center">
      <SearchIcon />
      <Link
        onClick={onClick}
        href={`/profile/${item.account_address}`}
        className="text-white text-sm font-medium hover:text-brand-primary flex items-center"
      >
        <span>{sliceDisplayName(item.display_name)}</span>
        {!!verificationTick && (
          <span className="verifiedIcon h-5 w-5 ml-0.5 fsm:ml-1">
            <Image
              src={verificationTick}
              alt={"Verified"}
              width={20}
              height={20}
            />
          </span>
        )}
      </Link>
    </div>
  );
};

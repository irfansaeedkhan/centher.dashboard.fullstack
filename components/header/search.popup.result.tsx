import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";
import {
  RecentSearchWithType,
  SearchResultWithType,
  SearchType,
} from "@/lib/search";
import { SearchIcon } from "@/assets/svgs";

interface Props {
  item: SearchResultWithType | RecentSearchWithType;
  createRecentSearchHandler: (query: string) => void;
  setSearchQueryInput: (value: string) => void;
  setOpenPopup: (value: boolean) => void;
  deleteSingleRecentSearchHandler: (query: string) => void;
}

const SearchPopupResult: React.FC<Props> = ({
  item,
  setSearchQueryInput,
  setOpenPopup,
  createRecentSearchHandler,
  deleteSingleRecentSearchHandler,
}) => {
  const verificationTick = useVerificationTick({
    user: item.type === SearchType.search_result ? item : null,
  });

  const handleItemClick = () => {
    if (item.type === SearchType.search_result) {
      createRecentSearchHandler(item.display_name);
    }
    setSearchQueryInput("");
    setOpenPopup(false);
  };

  return (
    <div className="flex items-start gap-2 p-6">
      {item.type === SearchType.search_result ? (
        <Link
          className="word-break flex w-full items-center truncate text-sm font-medium text-white hover:text-brand-primary"
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
            className={clsx(`block overflow-hidden truncate`)}
          >
            {item && sliceDisplayName(item.display_name)}
          </span>
          {verificationTick && (
            <span className="verifiedIcon ml-0.5 inline-flex h-[22px] w-[22px] min-w-[22px] fsm:ml-1">
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
          <SearchIcon />
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
            className="cursor-pointer text-white"
          />
        </>
      )}
    </div>
  );
};

export default SearchPopupResult;

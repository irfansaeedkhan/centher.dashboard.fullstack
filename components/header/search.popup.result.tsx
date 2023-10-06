import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { AppRoutes } from "@/constants/app.routes";
import {
  CreateRecentSearchParams,
  SearchPopupItem,
  SearchResponseType,
} from "@/lib/search";
import { SearchIcon } from "@/assets/svgs";

interface Props {
  item: SearchPopupItem;
  createRecentSearchHandler: (data: CreateRecentSearchParams) => void;
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
                <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
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
              className="word-break flex flex-grow items-center truncate text-sm font-medium text-white"
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
              <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
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

export default SearchPopupResult;

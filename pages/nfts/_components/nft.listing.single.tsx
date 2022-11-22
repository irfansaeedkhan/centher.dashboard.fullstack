import React from "react";

import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import useGetUser from "@/hooks/use.get.user";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { useRouter } from "next/router";

interface Props {
  item: IListHistory;
}

export const NFTListingSingle: React.FC<Props> = ({ item }) => {
  const router = useRouter();
  console.log(router.query.collection);
  const { user: buyer } = useGetUser(item.buyer);
  const { user: seller } = useGetUser(item.seller);

  let prefix = "Listed";
  if (item.type === "ListForSale") {
    prefix = "Listed";
  } else if (item.type === "CancelForSale") {
    prefix = "Canceled";
  } else if (item.type === "EditForSale") {
    prefix = "Price Changed";
  } else if (item.type === "CreateAuction") {
    prefix = "Auction Created";
  } else if (
    item.type === "BuyItem" ||
    item.type === "AcceptBid" ||
    item.type === "EndAuction"
  ) {
    prefix = "Bought";
  } else {
    return null;
  }
  return (
    <div className="flex gap-3">
      <div className="w-2 h-2 rounded-full bg-yellow-theme mt-[3px]"></div>
      <div className="flex flex-col gap-3">
        <h5 className="flex gap-2 items-center text-white text-12px font-normal">
          {prefix} by{" "}
          <span className="font-semibold cursor-pointer hover:text-brand-primary-dark">
            {item.type === "BuyItem" ||
            item.type === "AcceptBid" ||
            item.type === "EndAuction" ? (
              <Link
                href={{
                  pathname: AppRoutes.profile.nfts,
                  query: {
                    account_address: item.buyer,
                  },
                }}
              >
                {" "}
                {buyer?.display_name ? (
                  <span>{buyer?.display_name}</span>
                ) : (
                  <div className="rounded-sm !w-[50px] !h-4 bg-gray-shade-3 animate-pulse"></div>
                )}
              </Link>
            ) : (
              <Link
                href={{
                  pathname: AppRoutes.profile.nfts,
                  query: {
                    account_address: item.seller,
                  },
                }}
              >
                {seller?.display_name ? (
                  <span>{seller?.display_name}</span>
                ) : (
                  <div className="rounded-sm !w-[50px] !h-4 bg-gray-shade-3 animate-pulse"></div>
                )}
              </Link>
            )}
          </span>
        </h5>
        <h6 className="text-12px text-gray-shade-2 font-normal">
          {new Date(item.txTime * 1000).toString()}
        </h6>
      </div>
    </div>
  );
};

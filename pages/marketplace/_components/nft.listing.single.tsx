import React from "react";

import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import useGetUser from "@/hooks/use.get.user";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { useRouter } from "next/router";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

interface Props {
  item: IListHistory;
}

export const NFTListingSingle: React.FC<Props> = ({ item }) => {
  const router = useRouter();
  // console.log(router.query.collection);
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
      <div className="mt-[3px] h-2 w-2 rounded-full bg-yellow-theme"></div>
      <div className="flex flex-col gap-3">
        <h5 className="text-12px flex items-center gap-2 font-normal text-white">
          <span className="min-w-max">{prefix} by </span>
          <span
            className={`cursor-pointer  font-semibold hover:text-brand-primary-dark  `}
          >
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
                  <span
                    title={buyer.display_name}
                    className={`block w-full max-w-[140px] overflow-hidden truncate break-words [@media(min-width:400px)]:max-w-[205px] [@media(min-width:500px)]:max-w-[345px]`}
                  >
                    {sliceDisplayName(buyer.display_name)}
                  </span>
                ) : (
                  <div className="!h-4 !w-[50px] animate-pulse rounded-sm bg-gray-shade-3"></div>
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
                  <span
                    title={seller.display_name}
                    className={`block w-full max-w-[140px] overflow-hidden truncate break-words [@media(min-width:400px)]:max-w-[205px] [@media(min-width:500px)]:max-w-[345px]`}
                  >
                    {sliceDisplayName(seller.display_name)}
                  </span>
                ) : (
                  <div className="!h-4 !w-[50px] animate-pulse rounded-sm bg-gray-shade-3"></div>
                )}
              </Link>
            )}
          </span>
        </h5>
        <h6 className="text-12px font-normal text-gray-shade-2">
          {new Date(item.txTime * 1000).toString()}
        </h6>
      </div>
    </div>
  );
};

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";

interface Props {
  item: IListHistory;
}

export const NFTListingSingle: React.FC<Props> = ({ item }) => {
  const { user: buyer } = useGetUser(item.buyer);
  const { user: seller } = useGetUser(item.seller);
  const verificationTickSeller = useVerificationTick({ user: seller });
  const verificationTickBuyer = useVerificationTick({ user: buyer });

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
  } else if (item.type === "TransferOwnerShip") {
    prefix = "Transfered";
  } else {
    return null;
  }
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-2 w-2 rounded-full bg-gradient-pattern"></div>
      <div className="flex flex-col gap-3">
        <h5 className="text-12px flex items-center gap-2 font-normal text-white">
          <span className="min-w-max">{prefix} by </span>
          <span className={`text-gradient-hover cursor-pointer font-semibold`}>
            {item.type === "BuyItem" ||
            item.type === "AcceptBid" ||
            item.type === "EndAuction" ? (
              <Link
                href={{
                  pathname: AppRoutes.profile.nfts,
                  query: {
                    user_id: item.buyer,
                  },
                }}
              >
                {" "}
                {buyer?.display_name ? (
                  <div className="flex items-center">
                    <span
                      title={buyer.display_name}
                      className={`block w-auto max-w-[140px] overflow-hidden truncate break-words [@media(min-width:400px)]:max-w-[205px] [@media(min-width:500px)]:max-w-[345px]`}
                    >
                      {sliceDisplayName(buyer.display_name)}
                    </span>
                    {verificationTickBuyer && (
                      <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                        <Image
                          src={verificationTickBuyer}
                          alt={
                            buyer.membership.status === "citizen"
                              ? "Citizen"
                              : "Verified"
                          }
                          width={16}
                          height={16}
                        />
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="!h-4 !w-[50px] animate-pulse rounded-sm bg-gray-shade-3"></div>
                )}
              </Link>
            ) : (
              <Link
                href={{
                  pathname: AppRoutes.profile.nfts,
                  query: {
                    user_id: item.seller,
                  },
                }}
              >
                {seller?.display_name ? (
                  <div className="flex items-center">
                    <span
                      title={seller.display_name}
                      className={`block w-auto max-w-[140px] overflow-hidden truncate break-words [@media(min-width:400px)]:max-w-[205px] [@media(min-width:500px)]:max-w-[345px]`}
                    >
                      {sliceDisplayName(seller.display_name)}
                    </span>
                    {verificationTickSeller && (
                      <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                        <Image
                          src={verificationTickSeller}
                          alt={
                            seller.membership.status === "citizen"
                              ? "Citizen"
                              : "Verified"
                          }
                          width={16}
                          height={16}
                        />
                      </span>
                    )}
                  </div>
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

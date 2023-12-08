import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";

interface Props {
  item: CFSNFTForPage["marketplaceSaleHistory"][0];
}

export const NFTListingSingle: React.FC<Props> = ({ item }) => {
  const verificationTickSeller = useVerificationTick({
    user: item.seller_data,
  });
  const verificationTickBuyer = useVerificationTick({ user: item.buyer_data });

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
        <h5 className="flex items-center gap-2 text-xs font-normal text-white">
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
                <div className="flex items-center">
                  <span
                    title={item.buyer_data.display_name}
                    className={`block w-auto max-w-[140px] overflow-hidden truncate break-words [@media(min-width:400px)]:max-w-[205px] [@media(min-width:500px)]:max-w-[345px]`}
                  >
                    {sliceDisplayName(item.buyer_data.display_name)}
                  </span>
                  {verificationTickBuyer && (
                    <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                      <Image
                        src={verificationTickBuyer}
                        alt={
                          item.buyer_data.membership.status === "citizen"
                            ? "Citizen"
                            : "Verified"
                        }
                        width={16}
                        height={16}
                      />
                    </span>
                  )}
                </div>
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
                <div className="flex items-center">
                  <span
                    title={item.seller_data.display_name}
                    className={`block w-auto max-w-[140px] overflow-hidden truncate break-words [@media(min-width:400px)]:max-w-[205px] [@media(min-width:500px)]:max-w-[345px]`}
                  >
                    {sliceDisplayName(item.seller_data.display_name)}
                  </span>
                  {verificationTickSeller && (
                    <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                      <Image
                        src={verificationTickSeller}
                        alt={
                          item.seller_data.membership.status === "citizen"
                            ? "Citizen"
                            : "Verified"
                        }
                        width={16}
                        height={16}
                      />
                    </span>
                  )}
                </div>
              </Link>
            )}
          </span>
        </h5>
        <h6 className="text-xs font-normal text-gray-shade-2">
          {new Date(+item.txTime * 1000).toString()}
        </h6>
      </div>
    </div>
  );
};

import React, { useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import cloneDeep from "clone-deep";
import { AppRoutes } from "@/constants/app.routes";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";

interface Props {
  bids: CFSNFTForPage["auctionInfo"]["bids"];
}

export const NFTOffers: React.FC<Props> = ({ bids }) => {
  // FIXME: useBNBPrice is fetched in a lot of components, we should lift it up to the parent component or use a global state
  const bnbPrice = useBNBPrice();
  const sortedBids = useMemo(() => {
    let _sortedData = bids ? cloneDeep(bids) : [];
    _sortedData && _sortedData.length > 0
      ? _sortedData.sort((a, b) => Number(a.txTime) - Number(b.txTime))
      : [];

    return _sortedData;
  }, [bids]);

  return !!sortedBids.length ? (
    <div className={`w-full`}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={`accordion-button relative mb-3 flex w-full items-center  rounded-none border-b-2 border-gray-shade-3 !bg-transparent  py-4 text-left text-base font-semibold text-white transition focus:outline-none`}
            >
              Offers
            </button>
          </h2>
          <div>
            <div className="accordion-body rounded-10px bg-transparent">
              <div
                className={clsx(
                  "relative overflow-x-auto rounded-2xl shadow-md"
                )}
              >
                <table
                  className={`w-full overflow-hidden rounded-2xl border-2 border-gray-shade-3 bg-black-shade-4 text-left text-sm text-gray-500`}
                >
                  <thead
                    className={`bg-background-shade-3 text-sm uppercase text-gray-shade-7`}
                  >
                    <tr>
                      <th scope="col" className={th}>
                        Unit Price
                      </th>
                      <th scope="col" className={th}>
                        USD Price
                      </th>
                      <th scope="col" className={th}>
                        Expiration
                      </th>
                      <th scope="col" className={th}>
                        From
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBids.map((item, index) => {
                      const current = Date.now() / 1000;
                      const month = (current - +item.txTime) / 86400 / 30;
                      return (
                        <tr
                          className={`border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11`}
                          key={index}
                        >
                          <td className={`${td} !text-gray-shade-7`}>
                            {`${normalizeValue(
                              formatEther2Number(item.price)
                            )} BNB`}
                          </td>
                          <td className={td}>
                            ${formatBNB2USD(item.price, bnbPrice)}
                          </td>
                          <td className={td}>{month.toFixed(2)} month</td>
                          <td className={`${td} textGradient`}>
                            <Link
                              href={{
                                pathname: AppRoutes.profile.nfts,
                                query: {
                                  user_id: item.bidder,
                                },
                              }}
                              className={``}
                            >
                              {sliceDisplayName(item.bidder_data.display_name)}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const th = `py-4 lg:py-7 px-5 lg:px-3`;
const td = `text-sm py-4 lg:py-7 px-5 lg:px-3 text-white font-medium`;

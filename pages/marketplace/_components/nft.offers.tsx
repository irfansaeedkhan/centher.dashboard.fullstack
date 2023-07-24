import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { AppRoutes } from "@/constants/app.routes";
import { IBid } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";

interface NFTOffersProps {
  data: IBid[];
}
export const NFTOffers = ({ data }: NFTOffersProps) => {
  const bnbPrice = useBNBPrice();
  // sort data by time
  data?.sort((a, b) => {
    return b.txTime - a.txTime;
  });
  return (
    <div className={`w-full`}>
      {data?.length ? (
        <div className="accordion" id="accordionExample">
          <div className="accordion-item ">
            <h2 className="accordion-header mb-0" id="headingOne">
              <button className={AccordionButton}>Offers</button>
            </h2>
            <div>
              <div className="accordion-body rounded-10px bg-transparent">
                <div
                  className={clsx(
                    "relative overflow-x-auto  rounded-2xl shadow-md ",
                    data.length > 0 ? "" : " mt-5 lg:mt-8"
                  )}
                >
                  {data.length > 0 ? (
                    <table
                      className={`w-full overflow-hidden rounded-2xl border-2 border-gray-shade-3 bg-black-shade-4 text-left text-sm text-gray-500`}
                    >
                      <thead
                        className={`text-14px bg-background-shade-3 uppercase text-gray-shade-7`}
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
                        {data.map((item, index) => {
                          const current = Date.now() / 1000;
                          const month = (current - item.txTime) / 86400 / 30;
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
                              <td className={`${td} !text-brand-primary`}>
                                <Link
                                  href={{
                                    pathname: AppRoutes.profile.nfts,
                                    query: {
                                      user_id: item.bidder,
                                    },
                                  }}
                                  className={``}
                                >
                                  {formatAddress(item.bidder)}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-lg text-white">
                      {" "}
                      No offers yet!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
// styling

const AccordionButton = `
accordion-button relative flex items-center w-full py-4  text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`;
const th = `py-4 lg:py-7 px-5 lg:px-3`;
const td = `text-14px py-4 lg:py-7 px-5 lg:px-3 text-white font-medium`;

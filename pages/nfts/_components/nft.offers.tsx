// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
import Button from "@/components/button";
import { IBid } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import {useBNBPrice} from "@/hooks/use.get.bnb.price";
import { AppRoutes } from "@/constants/app.routes";

interface NFTOffersProps {
  data: IBid[];
}
export const NFTOffers = ({ data }: NFTOffersProps) => {
  const bnbPrice = useBNBPrice();
  return (
    <div className={NFTOffersContainer}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item bg-transparent ">
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={AccordionButton}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#OffersComponent"
              aria-expanded="true"
              aria-controls="OffersComponent"
            >
              Offers
            </button>
          </h2>
          <div
            id="OffersComponent"
            className={AccordionCollapse}
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body ">
              <div className={TableContainer}>
                <table className={table}>
                  <thead className={thead}>
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
                      {/* <th scope="col" className={th}>
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      const current = Date.now() / 1000;
                      const month = (current - item.txTime) / 86400 / 30;
                      return (
                        <tr className={tbodyTR} key={index}>
                          <td className={`${td} !text-gray-shade-7`}>
                            {formatEther2Number(item.price)} BNB
                          </td>
                          <td className={td}>
                            ${formatBNB2USD(item.price, bnbPrice)}
                          </td>
                          <td className={td}>{month.toFixed(2)} month</td>
                          <td className={`${td} !text-yellow-theme`}>
                            <Link
                              href={{
                                pathname: AppRoutes.profile.nfts,
                                query: {
                                  account_address: item.bidder,
                                },
                              }}
                              className={``}
                            >
                              {formatAddress(item.bidder)}
                            </Link>
                          </td>
                          {/* <td className={td}>
                          <Button
                            title="Accept"
                            variant="v1"
                            className="max-w-[80px]"
                          />
                        </td> */}
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
  );
};
// styling
const NFTOffersContainer = ctl(`
w-full 
`);
const AccordionButton = ctl(`
accordion-button relative flex items-center w-full py-4 px-5 text-base text-white text-left !bg-transparent  rounded-none transition focus:outline-none text-14px font-semibold border-b-2 border-gray-shade-3 mb-3
`);
const AccordionCollapse = ctl(`
accordion-collapse collapse show 
`);
const TableContainer = ctl(` 
overflow-x-auto relative  shadow-md rounded-2xl mt-8 lg:mt-12
`);
const table = ctl(` 
overflow-hidden w-full border-2 rounded-2xl border-gray-shade-3 text-sm text-left text-gray-500 bg-black-shade-4
`);
const thead = ctl(` 
text-14px text-gray-shade-7 uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 px-5 lg:px-3
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);
const td = ctl(` 
text-14px py-4 lg:py-7 px-5 lg:px-3 text-white font-medium
`);
